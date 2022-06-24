import { Fragment, useCallback, useEffect, useState } from 'react';
import { useGetSnapshotTransactions } from '../../api/block-explorer';
import { Transaction } from '../../api/types';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import BlockShape from '../../assets/icons/BlockShape.svg';

const LIMIT = 10;

export const BlockDetailsTableWrapper = ({
  snapshotOrdinal,
  blockHash,
}: {
  snapshotOrdinal: number;
  blockHash: string;
}) => {
  const snapshotTxs = useGetSnapshotTransactions(snapshotOrdinal);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(null);
  const [transactionsToShow, setTransactionsToShow] = useState<Transaction[]>(null);
  const [page, setPage] = useState<number>(1);

  const transformTransactions = useCallback((transactions: Transaction[]) => {
    const filteredTxs = transactions.filter((tx) => tx.blockHash === blockHash);
    setAllTransactions(filteredTxs);
  }, []);

  useEffect(() => {
    if (!snapshotTxs.isFetching) {
      transformTransactions(snapshotTxs.data);
    }
  }, [snapshotTxs.isFetching]);

  useEffect(() => {
    if (allTransactions) {
      setTransactionsToShow(allTransactions.slice(LIMIT * (page - 1), LIMIT * page));
      setPage((page) => page + 1);
    }
  }, [allTransactions]);
  return transactionsToShow ? <TransactionsTable transactions={transactionsToShow} icon={BlockShape} /> : <Fragment />;
};
