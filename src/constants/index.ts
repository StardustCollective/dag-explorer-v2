export const COIN_IDS = {
  dag: 'constellation-labs',
  btc: 'bitcoin',
};

export enum SearchableItem {
  Address = 'ADDRESS',
  Snapshot = 'SNAPSHOT',
  Hash = 'HASH',
}

export enum IconType {
  Address = 'AddressShape',
  Snapshot = 'SnapshotShape',
  Transaction = 'TransactionShape',
  Block = 'BlockShape',
}

export enum HgtpNetwork {
  MAINNET_1 = 'mainnet1',
  MAINNET = 'mainnet',
  INTEGRATIONNET = 'integrationnet',
  TESTNET = 'testnet',
}

export const isHgtpNetwork = (value: any): value is HgtpNetwork => Object.values(HgtpNetwork).includes(value);

export type NetworkVersion = '1.0' | '2.0';
export const AVAILABLE_NETWORKS: Record<HgtpNetwork, string> = {
  mainnet1: 'MainNet 1',
  testnet: 'TestNet',
  mainnet: 'MainNet',
  integrationnet: 'IntegrationNet',
};
