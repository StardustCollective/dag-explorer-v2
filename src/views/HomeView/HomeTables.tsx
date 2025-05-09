import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLatestDAGTransactions, useGetLatestMetagraphTransactions } from '../../api/block-explorer/transaction';
import { useGetLatestDAGSnapshots, useGetLatestMetagraphSnapshots } from '../../api/block-explorer/snapshots';
import { SnapshotShape } from '../../components/Shapes/SnapshotShape';
import { TransactionShape } from '../../components/Shapes/TransactionShape';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { Snapshot, Transaction } from '../../types';
import { NotFound } from '../NotFoundView/NotFound';
import { HgtpNetwork } from '../../constants';

import styles from './HomeView.module.scss';

const HomeTables = ({ limit, refetchEvery, network }: { limit: number; refetchEvery: number; network: HgtpNetwork }) => {
  const navigate = useNavigate();

  const dagSnapshotsInfo = useGetLatestDAGSnapshots({ limit: limit }, refetchEvery);
  const metagraphSnapshotsInfo = useGetLatestMetagraphSnapshots({ limit: limit }, refetchEvery);

  const dagTransactionsInfo = useGetLatestDAGTransactions({ limit: limit }, refetchEvery);
  const metagraphTransactionsInfo = useGetLatestMetagraphTransactions({ limit: limit }, refetchEvery);

  const [dagTransactions, setDagTransactions] = useState<Transaction[]>(null);
  const [metagraphTransactions, setMetagraphTransactions] = useState<Transaction[]>(null);

  const [dagSnapshots, setDagSnapshots] = useState<Snapshot[]>(null);
  const [metagraphSnapshots, setMetagraphSnapshots] = useState<Snapshot[]>(null);

  const [error, setError] = useState<string>(undefined);

  useEffect(() => {
    if (dagSnapshotsInfo.isError) {
      if (dagSnapshotsInfo.error.message !== '404') {
        setError(dagSnapshotsInfo.error.message);
      }
    }
    if (metagraphSnapshotsInfo.isError) {
      if (metagraphSnapshotsInfo.error.message !== '404') {
        setError(metagraphSnapshotsInfo.error.message);
      }
    }
    if (dagTransactionsInfo.isError) {
      if (dagTransactionsInfo.error.message !== '404') {
        setError(dagTransactionsInfo.error.message);
      }
    }
    if (metagraphTransactionsInfo.isError) {
      if (metagraphTransactionsInfo.error.message !== '404') {
        setError(metagraphTransactionsInfo.error.message);
      }
    }
  }, [
    dagSnapshotsInfo.isError,
    dagTransactionsInfo.isError,
    metagraphTransactionsInfo.isError,
    metagraphSnapshotsInfo.isError,
  ]);

  useEffect(() => {
    if (!dagTransactionsInfo.isFetching && !dagTransactionsInfo.isError) {
      setDagTransactions(dagTransactionsInfo.data.data);
    }
  }, [dagTransactionsInfo.isFetching]);

  useEffect(() => {
    if (!metagraphTransactionsInfo.isFetching && !metagraphTransactionsInfo.isError) {
      setMetagraphTransactions(metagraphTransactionsInfo.data.data);
    }
  }, [metagraphTransactionsInfo.isFetching]);

  useEffect(() => {
    if (!dagSnapshotsInfo.isFetching && !dagSnapshotsInfo.isError) {
      setDagSnapshots(dagSnapshotsInfo.data.data);
    }
  }, [dagSnapshotsInfo.isFetching]);

  useEffect(() => {
    if (!metagraphSnapshotsInfo.isFetching && !metagraphSnapshotsInfo.isError) {
      setMetagraphSnapshots(metagraphSnapshotsInfo.data.data);
    }
  }, [metagraphSnapshotsInfo.isFetching]);

  return error ? (
    <NotFound entire={false} errorCode={error} notRow />
  ) : (
    <>
      <div className={styles.tables}>
        <TransactionsTable
          skeleton={{ showSkeleton: !dagSnapshots, headerCols: ['ORDINAL', 'TIMESTAMP', 'BLOCKS'] }}
          limit={limit}
          snapshots={dagSnapshots}
          icon={<SnapshotShape />}
          headerText={'Latest DAG snapshots'}
        />

        <TransactionsTable
          skeleton={{ showSkeleton: !dagTransactions && dagTransactionsInfo.isLoading && !dagTransactionsInfo.isError }}
          limit={limit}
          transactions={dagTransactions}
          icon={<TransactionShape />}
          headerText={'Latest DAG transactions'}
        />
      </div>
      <div className={styles.viewAllContainer}>
        {!error && (
          <>
            <div className={styles.viewAll} onClick={() => navigate('/snapshots')}>
              View all Snapshots
            </div>
            <div className={styles.viewAll} onClick={() => navigate('/transactions')}>
              View all Transactions
            </div>
          </>
        )}
      </div>

      <div className={styles.tables}>
        <TransactionsTable
          skeleton={{ showSkeleton: !metagraphSnapshots, headerCols: ['METAGRAPH', 'ORDINAL', 'TIMESTAMP', 'SNAPSHOT FEE'] }}
          limit={1}
          snapshots={metagraphSnapshots}
          icon={<SnapshotShape />}
          headerText={'Latest Metagraph snapshots'}
          showMetagraphSymbol
        />

        <TransactionsTable
          skeleton={{
            showSkeleton:
              !metagraphTransactions && metagraphTransactionsInfo.isLoading && !metagraphTransactionsInfo.isError,
          }}
          limit={1}
          transactions={metagraphTransactions}
          icon={<TransactionShape />}
          headerText={'Latest Metagraph transactions'}
        />
      </div>
    </>
  );
};

export default HomeTables;
