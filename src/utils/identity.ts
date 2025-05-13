import crypto from "crypto";

import * as noble from "@noble/secp256k1";
import { dag4 } from "@stardust-collective/dag4";

export const getPrivateKeyFromId = (id: string) => {
  let rounds = 0;
  let hash: Buffer = Buffer.from([]);
  do {
    hash = crypto
      .createHash("sha256")
      .update(id)
      .update(Buffer.from([rounds]))
      .digest();
    rounds++;
  } while (!noble.utils.isValidPrivateKey(hash));
  return hash.toString("hex");
};

export const getPublicKeyFromId = (id: string) => {
  const pk = getPrivateKeyFromId(id);
  return dag4.keyStore.getPublicKeyFromPrivate(pk) as string;
};

export const getConstellationAddressFromId = (id: string) => {
  const pk = getPrivateKeyFromId(id);
  return dag4.keyStore.getDagAddressFromPrivateKey(pk) as string;
};
