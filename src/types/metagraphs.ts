export type IMetagraphProject = {
  id: string;
  metagraphId: string | null;
  network: string;
  name: string;
  icon_url: string | null;
  type: "public" | "private";
  snapshots90d: number | null;
  fees90d: number | null;
  snapshotsTotal: number | null;
  feesTotal: number | null;
};

export type IAPIMetagraph = {
  id: string;
  name: string;
  description: string;
  symbol: string;
  iconUrl: string;
  siteUrl: string | null;
  stakingWalletAddress: string | null;
  feesWalletAddress: string | null;
};

export type IAPIMetagraphNodeLayerInfo = {
  url: string | null;
  nodes: number;
};

export type IAPIMetagraphNodes = {
  id: string;
  nodes: {
    l0: IAPIMetagraphNodeLayerInfo;
    cl1: IAPIMetagraphNodeLayerInfo;
    dl1: IAPIMetagraphNodeLayerInfo;
  };
};
