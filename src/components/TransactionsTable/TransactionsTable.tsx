import { useLocation } from 'react-router-dom';
import { Snapshot, Transaction, Skeleton } from '../../types';
import { TableCards } from './TableCards';
import { HeaderRow } from './HeaderRow';
import { TransactionRow } from './TransactionRow';
import styles from './TransactionsTable.module.scss';
import { SkeletonTransactionsTable } from './SkeletonTransactionsTable';
import { useContext } from 'react';
import { PricesContext, PricesContextType } from '../../context/PricesContext';

export const TransactionsTable = ({
  skeleton,
  transactions,
  icon,
  snapshots,
  headerText,
  limit,
}: {
  skeleton?: Skeleton;
  transactions?: Transaction[];
  icon?: string;
  snapshots?: Snapshot[];
  headerText?: string;
  limit?: number;
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { dagInfo } = useContext(PricesContext) as PricesContextType;

  const titles = transactions
    ? ['TXN HASH', 'TIMESTAMP', 'SNAPSHOT', 'FROM', 'TO', 'AMOUNT']
    : ['HEIGHT', 'TIMESTAMP', 'BLOCKS COUNT'];
  const needDagInfo = transactions && transactions.length > 0;
  const mql = window.matchMedia('(max-width: 580px)');

  if ((skeleton && skeleton.showSkeleton) || (needDagInfo && !dagInfo)) {
    return mql.matches ? (
      <div className={styles.cards}>
        <TableCards limit={limit} showSkeleton={skeleton.showSkeleton} titles={titles} />
      </div>
    ) : (
      <SkeletonTransactionsTable
        headerCols={skeleton.headerCols}
        forSnapshots={skeleton.forSnapshots}
        rows={limit}
        headerText={headerText}
        icon={icon}
      />
    );
  }

  let txRows =
    transactions &&
    transactions.length > 0 &&
    transactions.map((tx) => <TransactionRow dagInfo={dagInfo} key={tx.hash} tx={tx} icon={icon} />);

  let snapRows =
    snapshots &&
    snapshots.length > 0 &&
    snapshots.map((snap) => <TransactionRow key={snap.hash} snapshot={snap} icon={icon} />);

  const emptyRows = [];
  for (let i = 0; i < limit; i++) {
    emptyRows.push(<TransactionRow key={i} tx={null} snapshot={null} />);
  }
  if (!transactions || transactions.length === 0) {
    txRows = emptyRows;
  }

  if (!snapshots || snapshots.length === 0) {
    snapRows = emptyRows;
  }

  if (txRows && limit && txRows.length < limit) {
    let i = 0;
    while (txRows.length < limit) {
      txRows.push(<TransactionRow key={i} />);
      i++;
    }
  }

  if (snapRows && limit && snapRows.length < limit) {
    let i = 0;
    while (snapRows.length < limit) {
      snapRows.push(<TransactionRow key={i} />);
      i++;
    }
  }

  return (
    <>
      <div
        className={`${styles.table}
        ${isHomePage ? styles.homeContainer : snapshots && !transactions ? styles.containerSnap : styles.container}`}
      >
        {headerText && <div className={styles.headerText}>{headerText}</div>}
        {headerText && <span />}
        {headerText && <img className={styles.icon} src={icon} height={'20px'} />}
        <HeaderRow forSnapshots={snapshots && !transactions} />
        {transactions && txRows}
        {snapshots && snapRows}
        {!transactions && !snapshots && emptyRows}
      </div>
      <div className={styles.cards}>
        <TableCards titles={titles} txs={transactions} snapshots={snapshots} headerText={headerText} icon={icon} />
      </div>
    </>
  );
};
