import clsx from 'clsx';
import { HeaderRow } from './HeaderRow';
import styles from './TransactionsTable.module.scss';
import styles2 from './TransactionRow.module.scss';
import styles3 from '../MainnetOneTable/MainnetOneTable.module.scss';
import { cloneElement } from 'react';
import { useNetwork } from '../../context/NetworkContext';
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
  const { networkVersion } = useNetwork();
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
          isLastRow={index + 1 === transactions.length}
        />
      ))}
    </div>
  );
};

const SkeletonTransactionRow = ({
  isHomePage,
  forSnapshots,
  showMetagraphSymbol,
  isLastRow,
}: {
  isHomePage: boolean;
  forSnapshots?: boolean;
  showMetagraphSymbol?: boolean;
  isLastRow?: boolean;
}) => {
  const { network } = useNetwork();
  return isHomePage ? (
    <>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      {showMetagraphSymbol && (
        <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
          <div className={clsx(styles.skeleton, styles.value)} />
        </div>
      )}
    </>
  ) : network === 'mainnet1' || forSnapshots ? (
    <>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
    </>
  ) : (
    <>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
    </>
  );
};
