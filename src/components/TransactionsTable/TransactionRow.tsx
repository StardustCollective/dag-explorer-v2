import { Link, useLocation } from 'react-router-dom';
import { Snapshot, Transaction } from '../../api/types';
import styles from './TransactionRow.module.scss';

const fitStringInCell = (value: string) => value.slice(0, 5) + '...' + value.slice(value.length - 5);

export const TransactionRow = ({ tx, icon, snapshot }: { tx?: Transaction; icon?: string; snapshot?: Snapshot }) => {
  let txRow = undefined;
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (tx) {
    if (isHomePage) {
      const hash = fitStringInCell(tx.hash);
      const date = new Date(tx.timestamp);

      txRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && <img src={icon} />}
              <Link to={'/transactions/' + tx.hash}>{hash}</Link>
            </div>
          </div>
          <div className={styles.txnCell}>{date.toLocaleString()}</div>
          <div className={styles.txnCell}>{(tx.amount / Math.pow(10, 8)).toFixed(8)}</div>
        </>
      );
    } else {
      const date = new Date(tx.timestamp);
      const hash = fitStringInCell(tx.hash);
      const source = fitStringInCell(tx.source);
      const destination = fitStringInCell(tx.destination);
      txRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && <img src={icon} />}
              <Link to={'/transactions/' + tx.hash}>{hash}</Link>
            </div>
          </div>
          <div className={styles.txnCell}>{date.toLocaleString()}</div>
          <div className={styles.txnCell}>
            <Link to={'/snapshots/' + tx.snapshotOrdinal}>{tx.snapshotOrdinal}</Link>
          </div>
          <div className={styles.txnCell}>{(tx.fee / Math.pow(10, 8)).toFixed(8)}</div>
          <div className={styles.txnCell}>
            <Link to={'/address/' + tx.source}>{source}</Link>
          </div>
          <div className={styles.txnCell}>
            <Link to={'/address/' + tx.destination}>{destination}</Link>
          </div>
          <div className={styles.txnCell}>{(tx.amount / Math.pow(10, 8)).toFixed(8)}</div>
        </>
      );
    }
  }

  let snapRow = undefined;
  if (snapshot) {
    if (isHomePage) {
      const date = new Date(snapshot.timestamp);
      const hash = fitStringInCell(snapshot.hash);
      snapRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && <img src={icon} />}
              <Link to={'/snapshots/' + snapshot.hash}>{hash}</Link>
            </div>
          </div>
          <div className={styles.txnCell}>{date.toLocaleString()}</div>
          <div className={styles.txnCell}>{snapshot.height}</div>
        </>
      );
    } else {
      const date = new Date(snapshot.timestamp);
      const hash = fitStringInCell(snapshot.hash);
      const lastHash = fitStringInCell(snapshot.lastSnapshotHash);
      snapRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && <img src={icon} />}
              <Link to={'/snapshots/' + snapshot.hash}>{hash}</Link>
            </div>
          </div>
          <div className={styles.txnCell}>{date.toLocaleString()}</div>
          <div className={styles.txnCell}>
            <Link to={'/snapshots/' + snapshot.ordinal}>{snapshot.ordinal}</Link>
          </div>
          <div className={styles.txnCell}>{snapshot.height.toString()}</div>
          <div className={styles.txnCell}>{lastHash}</div>
          <div className={styles.txnCell}>{snapshot.blocks.length.toString()}</div>
          <div className={styles.txnCell}>{snapshot.subHeight.toString()}</div>
        </>
      );
    }
  }

  if (!tx && !snapshot) {
    if (isHomePage) {
      snapRow = (
        <>
          <div className={styles.txnEmptyRow} />
          <div className={styles.txnEmptyRow} />
          <div className={styles.txnEmptyRow} />
        </>
      );
    } else {
      snapRow = (
        <>
          <div className={styles.txnEmptyRow} />
          <div className={styles.txnEmptyRow} />
          <div className={styles.txnEmptyRow} />
          <div className={styles.txnEmptyRow} />
          <div className={styles.txnEmptyRow} />
          <div className={styles.txnEmptyRow} />
          <div className={styles.txnEmptyRow} />
        </>
      );
    }
  }

  return tx ? txRow : snapRow;
};
