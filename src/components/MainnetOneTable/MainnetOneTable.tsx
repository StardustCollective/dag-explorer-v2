import { useLocation } from 'react-router-dom';
import { MainnetOneSnapshot } from '../../types';
import { HeaderRow } from '../TransactionsTable/HeaderRow';
import { SkeletonTransactionsTable } from '../TransactionsTable/SkeletonTransactionsTable';
import { TableCards } from '../TransactionsTable/TableCards';
import styles from './MainnetOneTable.module.scss';
import { SnapshotRow } from './SnapshotRow';

type Skeleton = {
  headerCols?: string[];
  forSnapshots?: boolean;
  showSkeleton: boolean;
};
export const MainnetOneSnapshotTable = ({
  skeleton,
  snapshots,
  icon,
  headerText,
  limit,
}: {
  skeleton?: Skeleton;
  snapshots: MainnetOneSnapshot[];
  icon: string;
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
        headerCols={skeleton.headerCols}
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

  return (
    <>
      <div className={`${styles.table} ${isHomePage ? styles.homeContainer : styles.containerSnap}`}>
        {headerText && <div className={styles.headerText}>{headerText}</div>}
        {headerText && <span />}
        {headerText && <img className={styles.icon} src={icon} height={'20px'} />}
        <HeaderRow forSnapshots={true} />
        {snapshots && snapRows}
        {snapshots && snapshots.length === 0 && emptyRows}
      </div>
      <div className={styles.cards}>
        <TableCards titles={titles} mainnetOneSnaps={snapshots} headerText={headerText} icon={icon} />
      </div>
    </>
  );
};