import { useContext, useState } from 'react';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import StatsSection from './StatsSection/StatsSection';
import { useNavigate } from 'react-router-dom';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import MainnetOneHomeTables from './MainnetOneHomeTables';
import HomeTables from './HomeTables';

import styles from './HomeView.module.scss';

const REFETCH_EVERY = 15000;

export const HomeView = () => {
  const navigate = useNavigate();
  const { networkVersion, network } = useContext(NetworkContext) as NetworkContextType;

  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };
  const LIMIT = ['mainnet', 'mainnet1'].includes(network) ? 10 : 5
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
          {networkVersion === '1.0' && (
            <MainnetOneHomeTables limit={LIMIT} refetchEvery={REFETCH_EVERY} handleError={handleError} />
          )}
          {networkVersion === '1.0' && !error && (
            <div className={styles.viewAllContainer}>
              <div className={styles.viewAll} onClick={() => navigate('/snapshots')}>
                View all Snapshots
              </div>
              <div className={styles.viewAll} onClick={() => navigate('/transactions')}>
                View all Transactions
              </div>
            </div>
          )}
          {networkVersion === '2.0' && <HomeTables limit={LIMIT} refetchEvery={REFETCH_EVERY} network={network}/>}
        </div>
      </main>
    </>
  );
};
