"use server";

import crypto from "crypto";

import { Profanity } from "@2toad/profanity";
import { dag4 } from "@stardust-collective/dag4";
import dayjs from "dayjs";

import { HgtpNetwork } from "@/common/consts";
import { getRedis } from "@/common/redis";
import { IAPIResponseData, INextTokenPaginationOptions } from "@/types";
import { safeJsonParse, UserError } from "@/utils";

export type IVerifiedSignature = {
  hash: string;
  address: string;
  pubKey: string;
  signature: string;
  message: string;
  timestamp: string;
};

const DefaultTTLInSeconds = 24 * 60 * 60;

const checkProfanity = (message: string) => {
  const profanity = new Profanity({
    languages: ["es", "en", "de", "fr", "pt"],
  });
  return profanity.exists(message);
};

const getRedisSignatureKey = (network: HgtpNetwork, hash: string) =>
  ["DagExplorerApp", network, "VerifiedSignatures", hash].join(":");

export const verifySignature = async (
  timestamp: string,
  pubKey: string,
  signature: string,
  message: string
): Promise<IVerifiedSignature | null> => {
  const signatureRequest = {
    content: message,
    metadata: {},
  };

  const signatureRequestEncoded = Buffer.from(
    JSON.stringify(signatureRequest),
    "utf-8"
  ).toString("base64");

  const rawMessage = `\u0019Constellation Signed Message:\n${signatureRequestEncoded.length}\n${signatureRequestEncoded}`;

  const hash = crypto
    .createHash("sha256")
    .update(rawMessage)
    .update(pubKey)
    .update(timestamp)
    .digest("hex");

  const address = dag4.keyStore.getDagAddressFromPublicKey(pubKey);

  const verified = await dag4.keyStore.verify(pubKey, rawMessage, signature);

  if (!verified) {
    return null;
  }

  return {
    hash,
    address,
    pubKey,
    signature,
    message,
    timestamp,
  };
};

export const publishSignature = async (
  network: HgtpNetwork,
  pubKey: string,
  signature: string,
  message: string
) => {
  const isProfanity = checkProfanity(message);

  if (isProfanity) {
    throw new UserError("Unable to publish signature with profane content");
  }

  const timestamp = dayjs();

  const verifiedSignature = await verifySignature(
    timestamp.toISOString(),
    pubKey,
    signature,
    message
  );

  if (!verifiedSignature) {
    throw new UserError("Signature verification failed");
  }

  const redis = await getRedis();

  const pipeline = redis.pipeline();
  pipeline.set(
    getRedisSignatureKey(network, verifiedSignature.hash),
    JSON.stringify(verifiedSignature),
    "EX",
    DefaultTTLInSeconds,
    "NX"
  );
  pipeline.zadd(
    getRedisSignatureKey(network, "signatures"),
    timestamp.unix(),
    verifiedSignature.hash
  );
  await pipeline.exec();

  return verifiedSignature;
};

export const getSignature = async (
  network: HgtpNetwork,
  hash: string
): Promise<IVerifiedSignature | null> => {
  const redis = await getRedis();

  const signature = await redis.get(getRedisSignatureKey(network, hash));

  return signature ? JSON.parse(signature) : null;
};

export const cleanupSignatures = async (network: HgtpNetwork) => {
  const timestamp = dayjs();

  const redis = await getRedis();

  await redis.zremrangebyscore(
    getRedisSignatureKey(network, "signatures"),
    "-inf",
    timestamp.subtract(DefaultTTLInSeconds, "seconds").unix()
  );
};

export const getSignatures = async (
  network: HgtpNetwork,
  options?: INextTokenPaginationOptions
): Promise<IAPIResponseData<IVerifiedSignature>> => {
  await cleanupSignatures(network);

  const redis = await getRedis();

  const next = safeJsonParse(
    Buffer.from(options?.tokenPagination?.next ?? "", "base64url").toString(),
    {
      cursor: 0,
    } as { cursor?: number }
  );

  const limit = options?.tokenPagination?.limit ?? 20;

  const cursor = next?.cursor ? `(${next.cursor}` : "+inf";

  const signaturesKeys = await redis.zrevrangebyscore(
    getRedisSignatureKey(network, "signatures"),
    cursor,
    "-inf",
    "LIMIT",
    0,
    limit
  );

  if (signaturesKeys.length === 0) {
    return { records: [] };
  }

  const signatures = (
    await redis.mget(
      ...signaturesKeys.map((key) => getRedisSignatureKey(network, key))
    )
  ).filter((signature): signature is string => signature !== null);

  const lastId = signaturesKeys[signaturesKeys.length - 1];
  const score = await redis.zscore(
    getRedisSignatureKey(network, "signatures"),
    lastId
  );

  return {
    records: signatures.map((signature) => JSON.parse(signature)),
    next: score
      ? Buffer.from(
          JSON.stringify({ cursor: score.toString() }),
          "utf-8"
        ).toString("base64url")
      : undefined,
  };
};
