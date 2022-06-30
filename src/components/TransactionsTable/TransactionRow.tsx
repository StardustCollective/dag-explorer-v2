import { Link, useLocation } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { Snapshot, Transaction } from '../../types';
import { formatTime, formatPrice, formatAmount, fitStringInCell } from '../../utils/numbers';
import styles from './TransactionRow.module.scss';

const formater = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 });
export const TransactionRow = ({
  tx,
  icon,
  snapshot,
  dagAmount,
}: {
  tx?: Transaction;
  icon?: string;
  snapshot?: Snapshot;
  dagAmount?: number;
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  let txRow = undefined;

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
          <div className={styles.txnCell}>
            <p data-tip={date.toUTCString()}>{formatTime(date)}</p>
            <ReactTooltip />
          </div>
          <div className={`${styles.txnCell} ${styles.amount}`}>
            <div className={styles.usd}>
              {'($' + formater.format(parseFloat(formatPrice(formatAmount(tx.amount, 8), dagAmount, 8))) + ' USD)'}
            </div>
            <div className={styles.dag}>{formatAmount(tx.amount, 8)}</div>
          </div>
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
          <div className={styles.txnCell}>
            <p data-tip={date.toUTCString()}>{formatTime(date)}</p>
            <ReactTooltip />
          </div>
          <div className={styles.txnCell}>
            <Link to={'/snapshots/' + tx.snapshotOrdinal}>{tx.snapshotOrdinal}</Link>
          </div>
          <div className={`${styles.txnCell} ${styles.amount}`}>{formatAmount(tx.fee, 8)}</div>
          <div className={styles.txnCell}>
            <Link to={'/address/' + tx.source}>{source}</Link>
          </div>
          <div className={styles.txnCell}>
            <Link to={'/address/' + tx.destination}>{destination}</Link>
          </div>
          <div className={styles.txnCell}>{formatAmount(tx.amount, 8)}</div>
        </>
      );
    }
  }

  let snapRow = undefined;
  if (snapshot) {
    if (isHomePage) {
      const date = new Date(snapshot.timestamp);
      snapRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && <img src={icon} />}
              <Link to={'/snapshots/' + snapshot.ordinal}>{snapshot.ordinal}</Link>
            </div>
          </div>
          <div className={styles.txnCell}>
            <p data-tip={date.toUTCString()}>{formatTime(date)}</p>
            <ReactTooltip />
          </div>

          <div className={styles.txnCell}>{snapshot.height}</div>
        </>
      );
    } else {
      const date = new Date(snapshot.timestamp);
      snapRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && <img src={icon} />}
              <Link to={'/snapshots/' + snapshot.hash}>{fitStringInCell(snapshot.hash)}</Link>
            </div>
          </div>
          <div className={`${styles.txnCell} ${styles.date}`}>
            <p data-tip={date.toUTCString()}>{formatTime(date)}</p>
            <ReactTooltip />
          </div>

          <div className={styles.txnCell}>
            <Link to={'/snapshots/' + snapshot.ordinal}>{snapshot.ordinal}</Link>
          </div>

          <div className={styles.txnCell}>{snapshot.blocks.length}</div>
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
