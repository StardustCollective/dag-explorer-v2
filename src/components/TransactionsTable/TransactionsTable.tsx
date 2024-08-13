import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Snapshot, Transaction, Skeleton } from '../../types';
import { HeaderRow } from './HeaderRow';
import { TransactionRow } from './TransactionRow';
import { SkeletonTransactionsTable } from './SkeletonTransactionsTable';
import { useContext, cloneElement } from 'react';
import { PricesContext, PricesContextType } from '../../context/PricesContext';
import { CardDataRow, TableCards } from './TableCards';
import { fitStringInCell, formatAmount, formatNumber, formatTime, NumberFormat } from '../../utils/numbers';
import { TransactionShape } from '../Shapes/TransactionShape';
import { SnapshotShape } from '../Shapes/SnapshotShape';
import styles from './TransactionsTable.module.scss';
import Decimal from 'decimal.js';

export const TransactionsTable = ({
  skeleton,
  transactions,
  icon,
  snapshots,
  headerText,
  limit,
  showMetagraphSymbol,
}: {
  skeleton?: Skeleton;
  transactions?: Transaction[];
  icon?: JSX.Element;
  snapshots?: Snapshot[];
  headerText?: string;
  limit?: number;
  showMetagraphSymbol?: boolean;
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { dagInfo } = useContext(PricesContext) as PricesContextType;

  const titles = transactions
    ? ['TXN HASH', 'TIMESTAMP', 'SNAPSHOT', 'FROM', 'TO', 'AMOUNT', 'FEE']
    : showMetagraphSymbol
    ? ['METAGRAPH', 'ORDINAL', 'TIMESTAMP', 'FEE']
    : ['ORDINAL', 'TIMESTAMP', 'BLOCKS COUNT'];

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
        showMetagraphSymbol={showMetagraphSymbol}
      />
    );
  }

  let txRows =
    transactions &&
    transactions.length > 0 &&
    transactions.map((tx, idx) => (
      <TransactionRow
        dagInfo={dagInfo}
        key={tx.hash}
        tx={tx}
        icon={icon}
        isLastRow={transactions.length >= limit && idx + 1 === transactions.length}
      />
    ));

  let snapRows =
    snapshots &&
    snapshots.length > 0 &&
    snapshots.map((snap, idx) => (
      <TransactionRow
        dagInfo={dagInfo}
        key={snap.hash}
        snapshot={snap}
        icon={icon}
        showMetagraphSymbol={showMetagraphSymbol}
        isLastRow={idx + 1 === snapshots.length}
      />
    ));

  const emptyRows = [];
  for (let i = 0; i < limit; i++) {
    emptyRows.push(
      <TransactionRow
        key={i}
        tx={null}
        snapshot={null}
        isLastRow={i + 1 === limit}
        showMetagraphSymbol={showMetagraphSymbol}
      />
    );
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

  const cardsSet = new Set<CardDataRow[]>();
  if (transactions) {
    transactions.forEach((tx) => {
      const txCard: CardDataRow[] = [];
      txCard.push({
        value: fitStringInCell(tx.hash),
        linkTo: tx.isMetagraphTransaction
          ? `/metagraphs/${tx.metagraphId}/transactions/${tx.hash}`
          : `/transactions/${tx.hash}`,
        toCopy: tx.hash,
        element: <TransactionShape />,
      });
      txCard.push({ value: formatTime(tx.timestamp, 'relative'), dataTip: formatTime(tx.timestamp, 'full') });
      txCard.push({
        value: tx.snapshotOrdinal,
        linkTo: tx.isMetagraphTransaction
          ? `/metagraphs/${tx.metagraphId}/snapshots/${tx.snapshotOrdinal}`
          : '/snapshots/' + tx.snapshotOrdinal,
      });
      txCard.push({ value: fitStringInCell(tx.source), linkTo: '/address/' + tx.source, toCopy: tx.source });
      txCard.push({
        value: fitStringInCell(tx.destination),
        linkTo: '/address/' + tx.destination,
        toCopy: tx.destination,
      });
      txCard.push({ value: formatAmount(tx.amount, 8, false, tx.symbol) });
      txCard.push({ value: formatNumber(tx.fee, NumberFormat.WHOLE) + ' d' + tx.symbol });
      cardsSet.add(txCard);
    });
  }

  if (snapshots) {
    snapshots.forEach((snap) => {
      const snapshotCard: CardDataRow[] = [];
      snap.isMetagraphSnapshot && snapshotCard.push({ value: snap.symbol });
      snapshotCard.push({
        value: snap.ordinal,
        linkTo: snap.metagraphId
          ? `/metagraphs/${snap.metagraphId}/snapshots/${snap.ordinal}`
          : `/snapshots/${snap.ordinal}`,
        element: <SnapshotShape />,
      });
      snapshotCard.push({ value: formatTime(snap.timestamp, 'relative'), dataTip: formatTime(snap.timestamp, 'full') });
      snapshotCard.push({
        value: snap.metagraphId
          ? formatNumber(new Decimal(snap.fee ?? 0).div(Decimal.pow(10, 8)), NumberFormat.DECIMALS_TRIMMED_EXPAND) +
            ' DAG'
          : snap.blocks
          ? snap.blocks.length
          : 0,
      });
      cardsSet.add(snapshotCard);
    });
  }

  return (
    <>
      <div
        className={clsx(
          styles.table,
          isHomePage
            ? showMetagraphSymbol
              ? styles.homeContainerMetagraph
              : styles.homeContainer
            : snapshots && !transactions
            ? styles.containerSnap
            : styles.container
        )}
      >
        {headerText && <div className={styles.headerText}>{headerText}</div>}
        {headerText && <span />}
        {showMetagraphSymbol && headerText && <span />}
        {headerText && cloneElement(icon, { classname: styles.icon, size: '20px' })}
        <HeaderRow forSnapshots={snapshots && !transactions} showMetagraphSymbol={showMetagraphSymbol} />
        {transactions && txRows}
        {snapshots && snapRows}
        {!transactions && !snapshots && emptyRows}
      </div>
      <div className={styles.cards}>
        <TableCards titles={titles} elements={cardsSet} headerText={headerText} icon={icon} />
      </div>
    </>
  );
};
