import clsx from 'clsx';
import { HeaderRow } from './HeaderRow';
import styles from './TransactionsTable.module.scss';
import styles2 from './TransactionRow.module.scss';
import styles3 from '../MainnetOneTable/MainnetOneTable.module.scss';
import { cloneElement, useContext } from 'react';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { useLocation } from 'react-router-dom';

export const SkeletonTransactionsTable = ({
  rows,
  forSnapshots,
  headerText,
  icon,
  headerCols,
  showMetagraphSymbol,
}: {
  rows: number;
  forSnapshots?: boolean;
  headerText?: string;
  icon?: JSX.Element;
  headerCols?: string[];
  showMetagraphSymbol?: boolean;
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { networkVersion } = useContext(NetworkContext) as NetworkContextType;
  const transactions = Array.from({ length: rows });
  return (
    <div
      className={
        isHomePage
          ? showMetagraphSymbol
            ? styles.homeContainerMetagraph
            : styles.homeContainer
          : location.pathname === '/snapshots'
          ? styles.containerSnap
          : networkVersion === '2.0'
          ? styles.container
          : styles3.container
      }
    >
      {headerText && <div className={styles.headerText}>{headerText}</div>}
      {headerText && <span />}
      {showMetagraphSymbol && headerText && <span />}
      {headerText && cloneElement(icon, { classname: styles3.icon, size: '20px' })}
      <HeaderRow headerCols={headerCols} forSnapshots={forSnapshots} />
      {transactions.map((_, index) => (
        <SkeletonTransactionRow
          forSnapshots={forSnapshots}
          isHomePage={isHomePage}
          key={index}
          showMetagraphSymbol={showMetagraphSymbol}
        />
      ))}
    </div>
  );
};

const SkeletonTransactionRow = ({
  isHomePage,
  forSnapshots,
  showMetagraphSymbol,
}: {
  isHomePage: boolean;
  forSnapshots?: boolean;
  showMetagraphSymbol?: boolean;
}) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  return isHomePage ? (
    <>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      {showMetagraphSymbol && (
        <div className={styles2.txnCell}>
          <div className={clsx(styles.skeleton, styles.value)} />
        </div>
      )}
    </>
  ) : network === 'mainnet1' || forSnapshots ? (
    <>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
    </>
  ) : (
    <>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={styles2.txnCell}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
    </>
  );
};
