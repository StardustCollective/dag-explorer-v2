import { useCallback, useEffect, useState } from 'react';
import { useGetSnapshotTransactions } from '../../api/block-explorer';
import { Transaction } from '../../types';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import BlockShape from '../../assets/icons/BlockShape.svg';

export const BlockDetailsTableWrapper = ({
  snapshotOrdinal,
  blockHash,
  limit,
  page,
  setLastPage,
  setHasTx,
}: {
  snapshotOrdinal: number;
  blockHash: string;
  limit: number;
  page: number;
  setLastPage: () => void;
  setHasTx: () => void;
}) => {
  const snapshotTxs = useGetSnapshotTransactions(snapshotOrdinal);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(null);
  const [transactionsToShow, setTransactionsToShow] = useState<Transaction[]>(null);

  const transformTransactions = useCallback((transactions: Transaction[]) => {
    const filteredTxs = transactions.filter((tx) => tx.blockHash === blockHash);
    setAllTransactions(filteredTxs);
  }, []);

  useEffect(() => {
    if (!snapshotTxs.isFetching) {
      transformTransactions(snapshotTxs.data);
      if (snapshotTxs.data && snapshotTxs.data.length > 0) {
        setHasTx();
      }
    }
  }, [snapshotTxs.isFetching]);

  useEffect(() => {
    if (allTransactions) {
      const txToShow = allTransactions.slice(limit * (page - 1), limit * page);
      if (txToShow.length < limit) {
        setLastPage();
      }
      setTransactionsToShow(allTransactions.slice(limit * (page - 1), limit * page));
    }
  }, [allTransactions, page]);

  return (
    <TransactionsTable
      skeleton={{ showSkeleton: !transactionsToShow }}
      limit={limit}
      transactions={transactionsToShow}
      icon={BlockShape}
    />
  );
};
