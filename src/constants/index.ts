export const COIN_IDS = {
  dag: 'constellation-labs',
  btc: 'bitcoin',
};

export enum SearchableItem {
  Address = 'ADDRESS',
  Snapshot = 'SNAPSHOT',
  Transaction = 'TRANSACTION',
}

export enum IconType {
  Address = 'AddressShape',
  Snapshot = 'SnapshotShape',
  Transaction = 'TransactionShape',
  Block = 'BlockShape',
}

export type Network = 'testnet' | 'mainnet1' | 'mainnet';
export type NetworkVersion = '1.0' | '2.0';
export const AVAILABLE_NETWORKS: Record<Network, string> = {
  mainnet1: 'Mainnet 1',
  testnet: 'Testnet',
  mainnet: 'Mainnet',
};
