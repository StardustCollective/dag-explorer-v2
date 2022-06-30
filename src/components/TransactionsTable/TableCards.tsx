import { MainnetOneSnapshot, MainnetOneTransaction, Snapshot, Transaction } from '../../types';
import { MobileCard } from './MobileCard';
import styles from './TransactionsTable.module.scss';

export const TableCards = ({
  showSkeleton,
  titles,
  snapshots,
  txs,
  limit,
  headerText,
  icon,
  mainnetOneTxs,
  mainnetOneSnaps,
}: {
  showSkeleton?: boolean;
  titles?: string[];
  snapshots?: Snapshot[];
  txs?: Transaction[];
  limit?: number;
  headerText?: string;
  icon?: string;
  mainnetOneTxs?: MainnetOneTransaction[];
  mainnetOneSnaps?: MainnetOneSnapshot[];
}) => {
  const header = headerText && (
    <div className={styles.headerCards} key={'headerText'}>
      <div className={styles.headerText}>{headerText}</div>
      <span />
      <img className={styles.icon} src={icon} height={'20px'} />
    </div>
  );
  const content: JSX.Element[] = [];
  header && content.push(header);

  snapshots && snapshots.map((snap, index) => content.push(<MobileCard titles={titles} snapshot={snap} key={index} />));
  txs && txs.map((tx, index) => content.push(<MobileCard titles={titles} transaction={tx} key={index} />));
  mainnetOneTxs &&
    mainnetOneTxs.map((tx, index) => content.push(<MobileCard titles={titles} mainnetOneTx={tx} key={index} />));
  mainnetOneSnaps &&
    mainnetOneSnaps.map((snap, index) =>
      content.push(<MobileCard titles={titles} mainnetOneSnap={snap} key={index} />)
    );

  if (showSkeleton) {
    for (let i = 0; i < limit; i++) {
      content.push(<MobileCard titles={titles} isSkeleton />);
    }
  }

  if ((header && content.length === 1) || content.length === 0) {
    content.push(
      <div className="overviewText" key={'noTxs'}>
        <p>There are no {txs ? 'transactions' : 'snapshots'}</p>
      </div>
    );
  }

  return <>{content}</>;
};
