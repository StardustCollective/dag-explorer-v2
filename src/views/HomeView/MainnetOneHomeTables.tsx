import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLatestSnapshots, useGetLatestTransactions } from '../../api/mainnet_1/block-explorer';
import { MainnetOneSnapshot, MainnetOneTransaction } from '../../types';
import { MainnetOneSnapshotTable } from '../../components/MainnetOneTable/MainnetOneTable';
import { MainnetOneTransactionTable } from '../../components/MainnetOneTable/MainnetOneTransactionTable';
import styles from './HomeView.module.scss';
import { SnapshotShape } from '../../components/Shapes/SnapshotShape';
import { TransactionShape } from '../../components/Shapes/TransactionShape';
import { NotFound } from '../NotFoundView/NotFound';

const MainnetOneHomeTables = ({ limit, handleError }: { limit: number; handleError: () => void }) => {
  const navigate = useNavigate();
  const startAt = '0';
  const endAt = '9';
  const query = `?startAt="${startAt}"&endAt="${endAt}"&orderBy="$key"`;
  const snapshotsInfo = useGetLatestSnapshots(query);
  const transactionsInfo = useGetLatestTransactions(query);
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
    handleError();
  }, [error]);

  return error ? (
    <NotFound entire={false} errorCode={error} />
  ) : (
    <>
      <MainnetOneSnapshotTable
        skeleton={{ showSkeleton: !snapshots, forSnapshots: true, headerCols: ['HEIGHT', 'TX COUNT', 'AMOUNT'] }}
        limit={limit}
        snapshots={snapshots}
        icon={<SnapshotShape />}
        headerText={'Latest snapshots'}
      />

      <div className={styles.viewAllMobile} onClick={() => navigate('/snapshots')}>
        View all Snapshots
      </div>

      <MainnetOneTransactionTable
        skeleton={{ showSkeleton: !transactions }}
        limit={limit}
        transactions={transactions}
        icon={<TransactionShape />}
        headerText={'Latest transactions'}
      />

      <div className={styles.viewAllMobile} onClick={() => navigate('/transactions')}>
        View all Transactions
      </div>
    </>
  );
};

export default MainnetOneHomeTables;
