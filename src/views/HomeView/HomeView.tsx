import { useContext, useState } from 'react';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import styles from './HomeView.module.scss';
import StatsSection from './StatsSection/StatsSection';
import { useNavigate } from 'react-router-dom';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import MainnetOneHomeTables from './MainnetOneHomeTables';
import HomeTables from './HomeTables';

const LIMIT = 10;

export const HomeView = () => {
  const navigate = useNavigate();
  const { network } = useContext(NetworkContext) as NetworkContextType;

  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };
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
          {network === 'mainnet1' && <MainnetOneHomeTables limit={LIMIT} handleError={handleError} />}
          {network === 'testnet' && <HomeTables limit={LIMIT} handleError={handleError} />}
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
      </main>
    </>
  );
};
