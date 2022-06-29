import { useContext, useEffect, useState } from 'react';
import { useGetAllSnapshots } from '../../api/block-explorer/global-snapshot';
import { useGetAllTransactions } from '../../api/block-explorer/transaction';
import { Snapshot, Transaction } from '../../types';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import styles from './HomeView.module.scss';
import StatsSection from './StatsSection/StatsSection';
import TransactionShape from '../../assets/icons/TransactionShape.svg';
import SnapshotShape from '../../assets/icons/SnapshotShape.svg';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { useNavigate } from 'react-router-dom';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import MainnetOneHomeTables from './MainnetOneHomeTables';

const LIMIT = 10;

export const HomeView = () => {
  const navigate = useNavigate();
  const { network } = useContext(NetworkContext) as NetworkContextType;

  const snapshotsInfo = useGetAllSnapshots({ limit: LIMIT });
  const transactionsInfo = useGetAllTransactions({ limit: LIMIT });

  const [transactions, setTransactions] = useState<Transaction[]>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>(null);

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
          {network === 'mainnet1' && <MainnetOneHomeTables />}
          {network === 'testnet' && (
            <>
              <TransactionsTable
                skeleton={{ showSkeleton: !snapshots }}
                limit={LIMIT}
                snapshots={snapshots}
                icon={SnapshotShape}
                headerText={snapshots ? 'Latest snapshots' : null}
              />

              {snapshots && snapshots.length > 0 && (
                <div className={styles.viewAllMobile} onClick={() => navigate('/snapshots')}>
                  View all Snapshots
                </div>
              )}

              <TransactionsTable
                skeleton={{ showSkeleton: !transactions }}
                limit={LIMIT}
                transactions={transactions}
                icon={TransactionShape}
                headerText={transactions ? 'Latest transactions' : null}
              />

              {transactions && transactions.length > 0 && (
                <div className={styles.viewAllMobile} onClick={() => navigate('/transactions')}>
                  View all Transactions
                </div>
              )}
            </>
          )}
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
