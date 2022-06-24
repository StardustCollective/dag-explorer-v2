import { Link } from 'react-router-dom';
import { Transaction } from '../../api/types';
import styles from './TransactionRow.module.scss';

const fitStringInCell = (value: string) => value.slice(0, 5) + '...' + value.slice(value.length - 5);

export const TransactionRow = ({ tx, icon }: { tx: Transaction; icon?: string }) => {
  let row;
  if (tx) {
    const date = new Date(tx.timestamp);
    const hash = fitStringInCell(tx.hash);
    const source = fitStringInCell(tx.source);
    const destination = fitStringInCell(tx.destination);
    row = (
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
  } else {
    row = (
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
  return row;
};
