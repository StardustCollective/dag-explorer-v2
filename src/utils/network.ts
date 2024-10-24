import { AppStage, HgtpNetwork, isAppStage, isHgtpNetwork } from '../constants';

export const detectSubdomain = () => {
  let subdomain;

  const host = window.location.host;
  const arr = host.split('.').slice(0, host.includes('localhost') ? -1 : -2);

  if (arr.length > 0) subdomain = arr[0];
  return subdomain;
};

export type INetworkContext = {
  stage: AppStage;
  network: HgtpNetwork;
};

export const getNetworkContextFromDomain = (domain: string): INetworkContext => {
  const pattern = /(?:(\w+)(?:-(\w+))?)?\.?(?:dagexplorer\.io|localhost)(?::\d+)?/i;
  const match = pattern.exec(domain);

  return {
    stage: isAppStage(match[2]) ? match[2] : AppStage.PRODUCTION,
    network: isHgtpNetwork(match[1]) ? match[1] : HgtpNetwork.MAINNET,
  };
};

export const getNetworkContextFromLocation = () => {
  const hostname = window.location.hostname;
  return getNetworkContextFromDomain(hostname);
};
