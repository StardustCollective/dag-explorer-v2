import { useLocation } from 'react-router-dom';
import { Snapshot, Transaction } from '../../api/types';
import { HeaderRow } from './HeaderRow';
import { TransactionRow } from './TransactionRow';
import styles from './TransactionsTable.module.scss';

export const TransactionsTable = ({
  transactions,
  icon,
  snapshots,
  headerText,
}: {
  transactions?: Transaction[];
  icon?: string;
  snapshots?: Snapshot[];
  headerText?: string;
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  let txRows =
    transactions &&
    transactions.length > 0 &&
    transactions.map((tx) => <TransactionRow key={tx.hash} tx={tx} icon={icon} />);

  let snapRows =
    snapshots &&
    snapshots.length > 0 &&
    snapshots.map((snap) => <TransactionRow key={snap.hash} snapshot={snap} icon={icon} />);

  const emptyRows = [];
  for (let i = 0; i < 10; i++) {
    emptyRows.push(<TransactionRow key={i} tx={null} snapshot={null} />);
  }
  if (!transactions) {
    txRows = emptyRows;
  }

  if (!snapshots) {
    snapRows = emptyRows;
  }

  return (
    <div className={isHomePage ? styles.homeContainer : styles.container}>
      {headerText && <div className={styles.headerText}>{headerText}</div>}
      {headerText && <span />}
      {headerText && <img className={styles.icon} src={icon} height={'20px'} />}
      <HeaderRow />
      {transactions && txRows}
      {snapshots && snapRows}
      {!transactions && !snapshots && emptyRows}
    </div>
  );
};
