import { useEffect, useState } from 'react';
import { useGetLatestSnapshots, useGetLatestTransactions } from '../../api/mainnet_1/block-explorer';
import { MainnetOneSnapshot, MainnetOneTransaction } from '../../types';
import { MainnetOneSnapshotTable } from '../../components/MainnetOneTable/MainnetOneTable';
import { MainnetOneTransactionTable } from '../../components/MainnetOneTable/MainnetOneTransactionTable';
import styles from './HomeView.module.scss';
import { SnapshotShape } from '../../components/Shapes/SnapshotShape';
import { TransactionShape } from '../../components/Shapes/TransactionShape';
import { NotFound } from '../NotFoundView/NotFound';

const MainnetOneHomeTables = ({
  limit,
  handleError,
  refetchEvery,
}: {
  limit: number;
  handleError: () => void;
  refetchEvery: number;
}) => {
  const startAt = '0';
  const endAt = '9';
  const query = `?startAt="${startAt}"&endAt="${endAt}"&orderBy="$key"`;
  const snapshotsInfo = useGetLatestSnapshots(query, refetchEvery);
  const transactionsInfo = useGetLatestTransactions(query, refetchEvery);
  const [snapshots, setSnapshots] = useState<MainnetOneSnapshot[]>();
  const [transactions, setTransactions] = useState<MainnetOneTransaction[]>();
  const [error, setError] = useState<string>(undefined);

  useEffect(() => {
    if (snapshotsInfo.isError) {
      setError(snapshotsInfo.error.message);
    }
    if (transactionsInfo.isError) {
      setError(transactionsInfo.error.message);
    }
  }, [snapshotsInfo.isError, transactionsInfo.isError]);

  useEffect(() => {
    if (!snapshotsInfo.isFetching && !snapshotsInfo.isError) {
      const arrSnaps: MainnetOneSnapshot[] = [];
      Object.values(snapshotsInfo.data).map((e) => arrSnaps.push(e));
      setSnapshots(arrSnaps);
    }
  }, [snapshotsInfo.isFetching]);

  useEffect(() => {
    if (!transactionsInfo.isFetching && !transactionsInfo.isError) {
      const arrTxs: MainnetOneTransaction[] = [];
      Object.values(transactionsInfo.data).map((e) => arrTxs.push(e));
      setTransactions(arrTxs);
    }
  }, [transactionsInfo.isFetching]);

  useEffect(() => {
    if (error) {
      handleError();
    }
  }, [error]);

  return error ? (
    <NotFound entire={false} errorCode={error} />
  ) : (
    <>
     <div className={styles.tables}>
      <MainnetOneSnapshotTable
        skeleton={{ showSkeleton: !snapshots, forSnapshots: true }}
        limit={limit}
        snapshots={snapshots}
        icon={<SnapshotShape />}
        headerText={'Latest snapshots'}
      />

      <MainnetOneTransactionTable
        skeleton={{ showSkeleton: !transactions }}
        limit={limit}
        transactions={transactions}
        icon={<TransactionShape />}
        headerText={'Latest transactions'}
      />
      </div>
    </>
  );
};

export default MainnetOneHomeTables;
