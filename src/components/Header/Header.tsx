import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AVAILABLE_NETWORKS } from '../../constants';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { SearchBar } from '../SearchBar/SearchBar';
import styles from './Header.module.scss';
import { AddressShape } from '../Shapes/AddressShape';
import { SnapshotShape } from '../Shapes/SnapshotShape';
import { TransactionShape } from '../Shapes/TransactionShape';
import { Warning } from 'phosphor-react';

export const Header = () => {
  const { pathname } = useLocation();
  const { network } = useContext(NetworkContext) as NetworkContextType;

  return (
    <header className={`${styles.fullWidth} ${styles.bgGray}`}>
      <div className={styles.testnetWarningContainer}>
        {network === 'testnet' && (
          <div className={styles.testnetWarning}>
            <Warning color={'#f79009'} weight="fill" size={'1.5rem'} />
            <div>Note: Constellation Testnet is different than the Mainnet and is unstable. </div>
          </div>
        )}
      </div>
      <div className={styles.header}>
        <div className={`${styles.maxWidth} ${styles.center}`}>
          <div className={styles.networkHeader}>
            <p className={'headerSubtitle'}>CONSTELLATION NETWORK</p>
            <div className={styles.networkHeaderGroup}>
              <p className={'networkName'}>{AVAILABLE_NETWORKS[network]}</p>
              {/*network === 'mainnet2' && <p className={styles.badge}>2.0</p>*/}
              {network === 'testnet' && <p className={styles.badge}>2.0</p>}
              {network === 'mainnet1' && <div className={styles.badge}>1.0</div>}
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
                  <AddressShape classname={styles.shape} />
                  <p className={`${styles.text} headerExamples`}> address</p>
                </div>
                <div className={styles.example}>
                  <SnapshotShape classname={styles.shape} />
                  <p className={`${styles.text} headerExamples`}> snapshot</p>
                </div>
                <div className={styles.example}>
                  <TransactionShape classname={styles.shape} />
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
