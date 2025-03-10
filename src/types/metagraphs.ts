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

export type IMetagraphNodeLayer = {
  url: string | null;
  nodes: number;
};

export type IMetagraph = {
  metagraphId: string;
  metagraphName: string;
  metagraphDescription: string;
  metagraphSymbol: string;
  metagraphIcon: string;
  metagraphSiteUrl: string | null;
  metagraphStakingWalletAddress: string | null;
  metagraphFeesWalletAddress: string | null;
  metagraphNodes?: {
    l0: IMetagraphNodeLayer;
    cl1: IMetagraphNodeLayer;
    dl1: IMetagraphNodeLayer;
  };
};
