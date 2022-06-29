import styles from './MainnetOneTable.module.scss';
import { useLocation } from 'react-router-dom';
import { MainnetOneTransaction } from '../../types';
import { HeaderRow } from '../TransactionsTable/HeaderRow';
import { TransactionRow } from './TransactionRow';
import { SkeletonTransactionsTable } from '../TransactionsTable/SkeletonTransactionsTable';
import { TableCards } from '../TransactionsTable/TableCards';

type Skeleton = {
  headerCols?: string[];
  forSnapshots?: boolean;
  showSkeleton: boolean;
};

export const MainnetOneTransactionTable = ({
  skeleton,
  transactions,
  icon,
  headerText,
  limit,
}: {
  skeleton?: Skeleton;
  transactions: MainnetOneTransaction[];
  icon: string;
  headerText?: string;
  limit?: number;
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const mql = window.matchMedia('(max-width: 580px)');
  const titles = ['TXN HASH', 'TIMESTAMP', 'FROM', 'TO', 'AMOUNT'];

  if (skeleton && skeleton.showSkeleton) {
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

  const txRows =
    transactions &&
    transactions.length > 0 &&
    transactions.map((tx) => <TransactionRow key={tx.hash} transaction={tx} icon={icon} />);

  const emptyRows = [];
  for (let i = 0; i < 10; i++) {
    emptyRows.push(<TransactionRow key={i} transaction={null} />);
  }

  if (txRows && limit && txRows.length < limit) {
    let i = 0;
    while (txRows.length < limit) {
      txRows.push(<TransactionRow key={i} transaction={null} />);
      i++;
    }
  }

  return (
    <>
      <div className={`${styles.table} ${isHomePage ? styles.homeContainer : styles.container}`}>
        {headerText && <div className={styles.headerText}>{headerText}</div>}
        {headerText && <span />}
        {headerText && <img className={styles.icon} src={icon} height={'20px'} />}
        <HeaderRow />
        {transactions && txRows}
        {transactions && transactions.length === 0 && emptyRows}
      </div>

      <div className={styles.cards}>
        <TableCards titles={titles} mainnetOneTxs={transactions} headerText={headerText} icon={icon} />
      </div>
    </>
  );
};
