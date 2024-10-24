import { AppStage, HgtpNetwork, isAppStage, isHgtpNetwork } from '../constants';

export type INetworkContext = {
  baseDomain: string | false;
  stage: AppStage | false;
  network: HgtpNetwork | false;
};

export const getNetworkContextFromDomain = (domain: string): INetworkContext => {
  const pattern = /(?:(\w+)(?:-(\w+))?)?\.?(dagexplorer\.io|localhost)(?::\d+)?/i;
  const match = pattern.exec(domain);

  return {
    baseDomain: match[3] ?? false,
    stage: isAppStage(match[1]) ? match[1] : isAppStage(match[2]) ? match[2] : false,
    network: isHgtpNetwork(match[1]) ? match[1] : false,
  };
};

export const getNetworkContextFromLocation = () => {
  const hostname = window.location.hostname;
  return getNetworkContextFromDomain(hostname);
};
