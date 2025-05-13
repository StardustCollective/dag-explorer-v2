
import { HgtpNetwork, isHgtpNetwork } from "./consts/network";

export const getNetworkFromHostname = (hostname: string) => {
  const network = hostname.split(".")[0];

  if (!isHgtpNetwork(network)) {
    return null;
  }

  return network;
};

export const getNetworkFromHeaders = async (
  headers: Headers | Promise<Headers>
) => {
  headers = await headers;

  const host = headers.get("host");

  if (!host) {
    return null;
  }

  return getNetworkFromHostname(host);
};

export const getNetworkFromParams = async (
  params: Promise<{ network: string }>
) => {
  const { network } = await params;

  if (!isHgtpNetwork(network)) {
    return null;
  }

  return network;
};

export const getNetworkFromHeadersOrFail = async (
  headers: Headers | Promise<Headers>
) => {
  const network = await getNetworkFromHeaders(headers);

  if (!network) {
    throw new Error("Network not found");
  }

  return network;
};

export const getNetworkFromParamsOrFail = async (
  params: Promise<{ network: string }>
) => {
  const network = await getNetworkFromParams(params);

  if (!network) {
    throw new Error("Network not found");
  }

  return network;
};

export const getNetworkUrl = (network: HgtpNetwork, prevUrl: string | URL) => {
  const nextUrl = new URL(prevUrl);
  nextUrl.hostname = getNetworkFromHostname(nextUrl.hostname)
    ? `${network}.${nextUrl.hostname.split(/\.(.+)/)[1]}`
    : `${network}.${nextUrl.hostname}`;
  return nextUrl;
};
