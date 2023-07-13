import { useCallback, useEffect, useState } from 'react';
import { useGetSnapshotTransactions } from '../../api/block-explorer';
import { Transaction } from '../../types';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { SnapshotShape } from '../../components/Shapes/SnapshotShape';
import { useGetMetagraph } from '../../api/block-explorer/metagraphs';
import { fillTransactionsWithMetagraphInfo } from '../../utils/metagraph';

export const BlockDetailsTableWrapper = ({
  snapshotOrdinal,
  blockHash,
  limit,
  page,
  setLastPage,
  setHasTx,
  metagraphId,
}: {
  snapshotOrdinal: number;
  blockHash: string;
  limit: number;
  page: number;
  metagraphId?: string;
  setLastPage: () => void;
  setHasTx: () => void;
}) => {
  const snapshotTxs = useGetSnapshotTransactions(snapshotOrdinal, {}, metagraphId);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(null);
  const [transactionsToShow, setTransactionsToShow] = useState<Transaction[]>(null);

  const metagraphInfo = useGetMetagraph(metagraphId);

  const transformTransactions = useCallback((transactions: Transaction[]) => {
    const filteredTxs = transactions.filter((tx) => tx.blockHash === blockHash);
    setAllTransactions(filteredTxs);
  }, []);

  useEffect(() => {
    if (!snapshotTxs.isFetching && !metagraphInfo.isFetching) {
      if (metagraphInfo.data) {
        const txns = fillTransactionsWithMetagraphInfo(metagraphId, snapshotTxs.data.data, metagraphInfo.data);
        transformTransactions(txns);
      } else {
        transformTransactions(snapshotTxs.data.data);
      }
      if (snapshotTxs.data && snapshotTxs.data.data.length > 0) {
        setHasTx();
      }
    }
  }, [snapshotTxs.isFetching, metagraphInfo.isFetching]);

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
      icon={<SnapshotShape />}
    />
  );
};
