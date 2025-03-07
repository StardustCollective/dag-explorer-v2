import { isHgtpNetwork } from "./consts/network";

export const getNetworkFromHeaders = async (headersList: Headers) => {
  const host = headersList.get("host");

  if (!host) {
    return null;
  }

  const network = host.split(".")[0];

  if (!isHgtpNetwork(network)) {
    return null;
  }

  return network;
};

export const getNetworkFromParams = async (params: Promise<{ network: string }>) => {
  const { network } = await params;

  if (!isHgtpNetwork(network)) {
    return null;
  }

  return network;
};
