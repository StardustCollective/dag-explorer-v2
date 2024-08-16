import styles from './MainnetOneTable.module.scss';
import { useLocation } from 'react-router-dom';
import { MainnetOneTransaction, Skeleton } from '../../types';
import { HeaderRow } from '../TransactionsTable/HeaderRow';
import { TransactionRow } from './TransactionRow';
import { SkeletonTransactionsTable } from '../TransactionsTable/SkeletonTransactionsTable';
import { cloneElement, useContext } from 'react';
import { PricesContext, PricesContextType } from '../../context/PricesContext';
import { CardDataRow, TableCards } from '../TransactionsTable/TableCards';
import { TransactionShape } from '../Shapes/TransactionShape';
import { fitStringInCell, formatAmount, formatNumber, formatTime, NumberFormat } from '../../utils/numbers';

export const MainnetOneTransactionTable = ({
  skeleton,
  transactions,
  icon,
  headerText,
  limit,
}: {
  skeleton?: Skeleton;
  transactions: MainnetOneTransaction[];
  icon?: JSX.Element;
  headerText?: string;
  limit?: number;
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { dagInfo } = useContext(PricesContext) as PricesContextType;
  const mql = window.matchMedia('(max-width: 580px)');
  const titles = ['TXN HASH', 'TIMESTAMP', 'FROM', 'TO', 'AMOUNT', 'FEE'];

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
    transactions.map((tx) => <TransactionRow dagInfo={dagInfo} key={tx.hash} transaction={tx} icon={icon} />);

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

  const transactionCards = new Set<CardDataRow[]>();
  if (transactions) {
    transactions.forEach((tx) => {
      const txCard: CardDataRow[] = [];
      txCard.push({
        value: fitStringInCell(tx.hash),
        linkTo: '/transactions/' + tx.hash,
        toCopy: tx.hash,
        element: <TransactionShape />,
      });
      txCard.push({ value: formatTime(tx.timestamp, 'relative'), dataTip: formatTime(tx.timestamp, 'full') });
      txCard.push({ value: fitStringInCell(tx.sender), linkTo: '/address/' + tx.sender, toCopy: tx.sender });
      txCard.push({
        value: fitStringInCell(tx.receiver),
        linkTo: '/address/' + tx.receiver,
        toCopy: tx.receiver,
      });
      txCard.push({ value: formatAmount(tx.amount, 8) });
      txCard.push({ value: formatNumber(tx.fee, NumberFormat.WHOLE) + ' dDAG' });
      transactionCards.add(txCard);
    });
  }

  return (
    <>
      <div className={`${styles.table} ${isHomePage ? styles.homeContainer : styles.container}`}>
        {headerText && <div className={styles.headerText}>{headerText}</div>}
        {headerText && cloneElement(icon, { classname: styles.icon, size: '20px' })}
        <HeaderRow />
        {transactions && txRows}
        {transactions && transactions.length === 0 && emptyRows}
      </div>

      <div className={styles.cards}>
        <TableCards titles={titles} elements={transactionCards} headerText={headerText} icon={icon} />
      </div>
    </>
  );
};
