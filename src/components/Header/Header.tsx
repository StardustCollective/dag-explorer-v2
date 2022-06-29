import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AVAILABLE_NETWORKS } from '../../constants';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { SearchBar } from '../SearchBar/SearchBar';
import styles from './Header.module.scss';
import addressShape from '../../assets/icons/AddressShape.svg';
import transactionShape from '../../assets/icons/TransactionShape.svg';
import snapshotShape from '../../assets/icons/SnapshotShape.svg';

export const Header = () => {
  const { pathname } = useLocation();
  const { network } = useContext(NetworkContext) as NetworkContextType;

  return (
    <header className={`${styles.fullWidth} ${styles.bgGray}`}>
      <div className={styles.header}>
        <div className={`${styles.maxWidth} ${styles.center}`}>
          <div className={styles.networkHeader}>
            <p className={'headerSubtitle'}>EXPLORE NETWORK</p>
            <div className={styles.networkHeaderGroup}>
              <p className={'networkName'}>{AVAILABLE_NETWORKS[network]}</p>
              {/*network === 'mainnet2' && <p className={styles.badge}>2.0</p>*/}
            </div>
          </div>

          {pathname !== '/' ? (
            <div className={`${styles.searchbar} ${styles.headerSearchMobile}`}>
              <SearchBar />
            </div>
          ) : (
            <div className={styles.rightSide}>
              <p className={`${styles.text} headerExamples`}>Search examples:</p>
              <div className={styles.examples}>
                <div className={styles.example}>
                  <img className={styles.shape} src={addressShape} />
                  <p className={`${styles.text} headerExamples`}> address</p>
                </div>
                <div className={styles.example}>
                  <img className={styles.shape} src={snapshotShape} />
                  <p className={`${styles.text} headerExamples`}> snapshot</p>
                </div>
                <div className={styles.example}>
                  <img className={styles.shape} src={transactionShape} />
                  <p className={`${styles.text} headerExamples`}> transaction</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
