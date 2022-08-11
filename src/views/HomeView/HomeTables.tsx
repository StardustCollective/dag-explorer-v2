import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllSnapshots } from '../../api/block-explorer/global-snapshot';
import { useGetAllTransactions } from '../../api/block-explorer/transaction';
import { SnapshotShape } from '../../components/Shapes/SnapshotShape';
import { TransactionShape } from '../../components/Shapes/TransactionShape';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { Snapshot, Transaction } from '../../types';
import { NotFound } from '../NotFoundView/NotFound';
import styles from './HomeView.module.scss';

const HomeTables = ({
  limit,
  handleError,
  refetchEvery,
}: {
  limit: number;
  handleError: () => void;
  refetchEvery: number;
}) => {
  const navigate = useNavigate();
  const snapshotsInfo = useGetAllSnapshots({ limit: limit }, refetchEvery);
  const transactionsInfo = useGetAllTransactions({ limit: limit }, refetchEvery);

  const [transactions, setTransactions] = useState<Transaction[]>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>(null);
  const [error, setError] = useState<string>(undefined);

  useEffect(() => {
    if (snapshotsInfo.isError) {
      setError(snapshotsInfo.error.message);
    }
    if (transactionsInfo.isError) {
      if (transactionsInfo.error.message !== '404') {
        setError(transactionsInfo.error.message);
      }
    }
  }, [snapshotsInfo.isError, transactionsInfo.isError]);

  useEffect(() => {
    if (!transactionsInfo.isFetching && !transactionsInfo.isError) {
      setTransactions(transactionsInfo.data);
    }
  }, [transactionsInfo.isFetching]);

  useEffect(() => {
    if (!snapshotsInfo.isFetching && !snapshotsInfo.isError) {
      setSnapshots(snapshotsInfo.data);
    }
  }, [snapshotsInfo.isFetching]);

  useEffect(() => {
    if (error) {
      handleError();
    }
  }, [error]);

  return error ? (
    <NotFound entire={false} errorCode={error} notRow />
  ) : (
    <>
      <TransactionsTable
        skeleton={{ showSkeleton: !snapshots, headerCols: ['ORDINAL', 'TIMESTAMP', 'BLOCKS'] }}
        limit={limit}
        snapshots={snapshots}
        icon={<SnapshotShape />}
        headerText={'Latest snapshots'}
      />

      {snapshots && snapshots.length > 0 && (
        <div className={styles.viewAllMobile} onClick={() => navigate('/snapshots')}>
          View all Snapshots
        </div>
      )}

      <TransactionsTable
        skeleton={{ showSkeleton: !transactions && transactionsInfo.isLoading && !transactionsInfo.isError }}
        limit={limit}
        transactions={transactions}
        icon={<TransactionShape />}
        headerText={'Latest transactions'}
      />

      {transactions && transactions.length > 0 && (
        <div className={styles.viewAllMobile} onClick={() => navigate('/transactions')}>
          View all Transactions
        </div>
      )}
    </>
  );
};

export default HomeTables;
