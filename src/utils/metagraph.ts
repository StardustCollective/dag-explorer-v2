import { MetagraphInfo, Transaction } from '../types';

const fillTransactionsWithMetagraphInfo = (metagraphId: string, txns: Transaction[], metagraph: MetagraphInfo) => {
  const parsedTxn = txns.map((txn) => {
    txn.symbol = metagraph.metagraphSymbol;
    txn.isMetagraphTransaction = true;
    txn.metagraphId = metagraphId;
    return txn;
  });

  return parsedTxn;
};

export { fillTransactionsWithMetagraphInfo };
