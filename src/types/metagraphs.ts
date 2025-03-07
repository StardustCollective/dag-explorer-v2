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