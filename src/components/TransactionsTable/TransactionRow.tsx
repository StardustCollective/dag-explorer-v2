import { Link, useLocation } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { Snapshot, Transaction } from '../../types';
import { formatPrice, formatAmount, fitStringInCell, formatTime } from '../../utils/numbers';
import styles from './TransactionRow.module.scss';

export const TransactionRow = ({
  tx,
  icon,
  snapshot,
  dagInfo,
}: {
  tx?: Transaction;
  icon?: JSX.Element;
  snapshot?: Snapshot;
  dagInfo?: any;
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  let txRow = undefined;

  if (tx) {
    const hash = fitStringInCell(tx.hash);
    const date = formatTime(tx.timestamp, 'relative');
    const fullDate = formatTime(tx.timestamp, 'full');
    if (isHomePage) {
      txRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && icon}
              <Link to={'/transactions/' + tx.hash}>{hash}</Link>
            </div>
          </div>
          <div className={styles.txnCell}>
            <p data-tip={fullDate}>{date}</p>
            <ReactTooltip />
          </div>
          <div className={`${styles.txnCell} ${styles.amount}`}>
            {dagInfo && <div className={styles.usd}>{'($' + formatPrice(tx.amount, dagInfo, 2) + ' USD)'}</div>}
            <div className={styles.dag}>{formatAmount(tx.amount, 8)}</div>
          </div>
        </>
      );
    } else {
      txRow = (
        <>
          <div className={styles.txnCell}>
            <div className={`${styles.txContainer} ${styles.timestamp}`}>
              {icon && icon}
              <Link to={'/transactions/' + tx.hash}>{hash}</Link>
            </div>
            <div className={`${styles.txContainer} ${styles.subTimestamp}`}>
              <div className={styles.stackedIcon}>{icon && icon}</div>
              <div className={styles.hashWithDate}>
                <Link to={'/transactions/' + tx.hash}>{hash}</Link>
                <p data-tip={fullDate}>{date}</p>
                <ReactTooltip />
              </div>
            </div>
          </div>
          <div className={`${styles.txnCell} ${styles.date} ${styles.timestamp}`}>
            <p data-tip={fullDate}>{date}</p>
            <ReactTooltip />
          </div>
          <div className={`${styles.txnCell}`}>
            <Link to={'/snapshots/' + tx.snapshotOrdinal}>{tx.snapshotOrdinal}</Link>
          </div>
          <div className={`${styles.txnCell} ${styles.enoughSpace} ${styles.amount} ${styles.alignItemsLeft}`}>
            {formatAmount(tx.fee, 8)}
          </div>
          <div className={`${styles.txnCell} ${styles.stackFromTo}`}>
            <div className={styles.stackRow}>
              <div className={`${styles.alignLeft}`}>From:</div>
              <div className={styles.alignRight}>
                {<Link to={'/address/' + tx.source}>{fitStringInCell(tx.source)}</Link>}
              </div>
            </div>
            <div className={styles.stackRow}>
              <div className={`${styles.alignLeft}`}>To:</div>
              <div className={styles.alignRight}>
                {<Link to={'/address/' + tx.destination}>{fitStringInCell(tx.destination)}</Link>}
              </div>
            </div>
          </div>
          <div className={`${styles.txnCell} ${styles.amount}`}>
            {dagInfo && <div className={styles.usd}>{'($' + formatPrice(tx.amount, dagInfo, 2) + ' USD)'}</div>}
            <div className={styles.dag}>{formatAmount(tx.amount, 8)}</div>
          </div>
        </>
      );
    }
  }

  let snapRow = undefined;
  if (snapshot) {
    const date = formatTime(snapshot.timestamp, 'relative');
    const fullDate = formatTime(snapshot.timestamp, 'full');
    if (isHomePage) {
      snapRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && icon}
              <Link to={'/snapshots/' + snapshot.ordinal}>{snapshot.ordinal}</Link>
            </div>
          </div>
          <div className={styles.txnCell}>
            <p data-tip={fullDate}>{date}</p>
            <ReactTooltip />
          </div>
          <div className={`${styles.txnCell}`}>
            <div className={styles.dag}>{snapshot.blocks.length}</div>
          </div>
        </>
      );
    } else {
      snapRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && icon}
              <Link to={'/snapshots/' + snapshot.hash}>{fitStringInCell(snapshot.hash)}</Link>
            </div>
          </div>
          <div className={`${styles.txnCell} ${styles.date}`}>
            <p data-tip={fullDate}>{date}</p>
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
