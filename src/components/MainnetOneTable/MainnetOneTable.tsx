import { cloneElement } from 'react';
import { useLocation } from 'react-router-dom';
import { MainnetOneSnapshot, Skeleton } from '../../types';
import { formatAmount } from '../../utils/numbers';
import { SnapshotShape } from '../Shapes/SnapshotShape';
import { HeaderRow } from '../TransactionsTable/HeaderRow';
import { SkeletonTransactionsTable } from '../TransactionsTable/SkeletonTransactionsTable';
import { CardDataRow, TableCards } from '../TransactionsTable/TableCards';
import styles from './MainnetOneTable.module.scss';
import { SnapshotRow } from './SnapshotRow';

export const MainnetOneSnapshotTable = ({
  skeleton,
  snapshots,
  icon,
  headerText,
  limit,
}: {
  skeleton?: Skeleton;
  snapshots: MainnetOneSnapshot[];
  icon?: JSX.Element;
  headerText?: string;
  limit: number;
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const mql = window.matchMedia('(max-width: 580px)');
  const titles = ['HEIGHT', 'AMOUNT', 'TX COUNT'];

  if (skeleton && skeleton.showSkeleton) {
    return mql.matches ? (
      <div className={styles.cards}>
        <TableCards limit={limit} showSkeleton={skeleton.showSkeleton} titles={titles} />
      </div>
    ) : (
      <SkeletonTransactionsTable
        forSnapshots={skeleton.forSnapshots}
        rows={limit}
        headerText={headerText}
        icon={icon}
      />
    );
  }

  const snapRows =
    snapshots &&
    snapshots.length > 0 &&
    snapshots.map((snap) => <SnapshotRow key={snap.height} snapshot={snap} icon={icon} />);

  const emptyRows = [];
  for (let i = 0; i < limit; i++) {
    emptyRows.push(<SnapshotRow key={i} snapshot={null} />);
  }

  const snapshotCards = new Set<CardDataRow[]>();
  if (snapshots) {
    snapshots.forEach((snap) => {
      const card: CardDataRow[] = [];
      card.push({ value: snap.height, linkTo: '/snapshots/' + snap.height, element: <SnapshotShape /> });
      card.push({ value: formatAmount(snap.dagAmount, 8) });
      card.push({ value: snap.txCount });
      snapshotCards.add(card);
    });
  }

  return (
    <>
      <div className={`${styles.table} ${isHomePage ? styles.homeContainer : styles.containerSnap}`}>
        {headerText && <div className={styles.headerText}>{headerText}</div>}
        {headerText && cloneElement(icon, { classname: styles.icon, size: '20px' })}
        <HeaderRow forSnapshots={true} />
        {snapshots && snapRows}
        {snapshots && snapshots.length === 0 && emptyRows}
      </div>
      <div className={styles.cards}>
        <TableCards titles={titles} elements={snapshotCards} headerText={headerText} icon={icon} />
      </div>
    </>
  );
};
