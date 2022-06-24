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

export type Network = 'testnet' | 'mainnet1' | 'mainnet2';
export const AVAILABLE_NETWORKS: Record<Network, string> = {
  mainnet1: 'Mainnet',
  mainnet2: 'Mainnet',
  testnet: 'Testnet',
};
