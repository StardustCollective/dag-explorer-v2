import { useEffect, useState } from 'react';
import { useGetAllSnapshots } from '../../api/block-explorer/global-snapshot';
import { useGetAllTransactions } from '../../api/block-explorer/transaction';
import { Snapshot, Transaction } from '../../api/types';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import styles from './HomeView.module.scss';
import StatsSection from './StatsSection/StatsSection';
import TransactionShape from '../../assets/icons/TransactionShape.svg';
import SnapshotShape from '../../assets/icons/SnapshotShape.svg';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { useNavigate } from 'react-router-dom';

const LIMIT = 10;

export const HomeView = () => {
  const navigate = useNavigate();
  const snapshotsInfo = useGetAllSnapshots({ limit: LIMIT });
  const transactionsInfo = useGetAllTransactions({ limit: LIMIT });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

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
  return (
    <>
      <section className={`${styles.fullWidth} ${styles.section}`}>
        <div className={`${styles.row} ${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <main className={`${styles.fullWidth2} background`}>
        <div className={`${styles.row} ${styles.fila1}`}>
          <StatsSection />
        </div>
        <div className={`${styles.row} ${styles.fila2}`}>
          <TransactionsTable snapshots={snapshots} icon={SnapshotShape} headerText={'Latest snapshots'} />
          <TransactionsTable transactions={transactions} icon={TransactionShape} headerText={'Latest transactions'} />
          <div className={styles.viewAll} onClick={() => navigate('/snapshots')}>
            View all Snapshots
          </div>
          <div className={styles.viewAll} onClick={() => navigate('/transactions')}>
            View all Transactions
          </div>
        </div>
      </main>
    </>
  );
};
