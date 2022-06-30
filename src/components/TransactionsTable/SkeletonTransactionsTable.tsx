import { HeaderRow } from './HeaderRow';
import styles from './TransactionsTable.module.scss';
import styles2 from './TransactionRow.module.scss';
import styles3 from '../MainnetOneTable/MainnetOneTable.module.scss';
import { useContext } from 'react';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { useLocation } from 'react-router-dom';

export const SkeletonTransactionsTable = ({
  rows,
  forSnapshots,
  headerText,
  icon,
  headerCols,
}: {
  rows: number;
  forSnapshots?: boolean;
  headerText?: string;
  icon?: string;
  headerCols?: string[];
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const transactions = Array.from({ length: rows });
  return (
    <div
      className={
        isHomePage
          ? styles.homeContainer
          : location.pathname === '/snapshots'
          ? styles.containerSnap
          : network === 'testnet'
          ? styles.container
          : styles3.container
      }
    >
      {headerText && <div className={styles.headerText}>{headerText}</div>}
      {headerText && <span />}
      {headerText && <img className={styles.icon} src={icon} height={'20px'} />}{' '}
      <HeaderRow headerCols={headerCols} forSnapshots={forSnapshots} />
      {transactions.map((_, index) => (
        <SkeletonTransactionRow isHomePage={isHomePage} key={index} />
      ))}
    </div>
  );
};

const SkeletonTransactionRow = ({ isHomePage }: { isHomePage: boolean }) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  return isHomePage ? (
    <>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
    </>
  ) : network === 'mainnet1' ? (
    <>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
    </>
  ) : (
    <>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
    </>
  );
};
