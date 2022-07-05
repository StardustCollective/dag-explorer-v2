import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLatestSnapshots, useGetLatestTransactions } from '../../api/mainnet_1/block-explorer';
import { MainnetOneSnapshot, MainnetOneTransaction } from '../../types';
import { MainnetOneSnapshotTable } from '../../components/MainnetOneTable/MainnetOneTable';
import { MainnetOneTransactionTable } from '../../components/MainnetOneTable/MainnetOneTransactionTable';
import styles from './HomeView.module.scss';
import { SnapshotShape } from '../../components/Shapes/SnapshotShape';
import { TransactionShape } from '../../components/Shapes/TransactionShape';

const LIMIT = 10;
const MainnetOneHomeTables = () => {
  const navigate = useNavigate();
  const startAt = '0';
  const endAt = '9';
  const query = `?startAt="${startAt}"&endAt="${endAt}"&orderBy="$key"`;
  const snapshotsInfo = useGetLatestSnapshots(query);
  const transactionsInfo = useGetLatestTransactions(query);
  const [snapshots, setSnapshots] = useState<MainnetOneSnapshot[]>();
  const [transactions, setTransactions] = useState<MainnetOneTransaction[]>();

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

  return (
    <>
      <MainnetOneSnapshotTable
        skeleton={{ showSkeleton: !snapshots, forSnapshots: true, headerCols: ['HEIGHT', 'TX COUNT', 'AMOUNT'] }}
        limit={LIMIT}
        snapshots={snapshots}
        icon={<SnapshotShape />}
        headerText={'Latest snapshots'}
      />

      <div className={styles.viewAllMobile} onClick={() => navigate('/snapshots')}>
        View all Snapshots
      </div>

      <MainnetOneTransactionTable
        skeleton={{ showSkeleton: !transactions }}
        limit={LIMIT}
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
