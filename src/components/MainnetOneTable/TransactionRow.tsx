import { Link, useLocation } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { MainnetOneTransaction } from '../../types';
import { fitStringInCell, formatAmount, formatNumber, formatPrice, formatTime, NumberFormat } from '../../utils/numbers';
import styles from './SnapshotRow.module.scss';

export const TransactionRow = ({
  transaction,
  dagInfo,
  icon,
}: {
  icon?: JSX.Element;
  transaction?: MainnetOneTransaction;
  dagInfo?: any;
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  let snapRow = undefined;
  if (transaction) {
    const hash = fitStringInCell(transaction.hash);
    const date = formatTime(transaction.timestamp, 'relative');
    const fullDate = formatTime(transaction.timestamp, 'full');

    if (isHomePage) {
      snapRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && icon}
              <Link to={'/transactions/' + transaction.hash}>{hash}</Link>
            </div>
          </div>
          <div className={styles.txnCell}>
            <p data-tip={fullDate}>{date}</p>
            <ReactTooltip />
          </div>
          <div className={`${styles.txnCell} ${styles.amount}`}>
            {dagInfo && (
              <div className={styles.usd}>{'($' + formatPrice(transaction.amount, dagInfo, 2) + ' USD)'}</div>
            )}
            <div className={styles.dag}>{formatAmount(transaction.amount, 8)}</div>
          </div>
        </>
      );
    } else {
      snapRow = (
        <>
          <div className={styles.txnCell}>
            <div className={`${styles.txContainer} ${styles.timestamp}`}>
              {icon && icon}
              <Link to={'/transactions/' + transaction.hash}>{hash}</Link>
            </div>
            <div className={`${styles.txContainer} ${styles.subTimestamp}`}>
              <div className={styles.stackedIcon}>{icon && icon}</div>
              <div className={styles.hashWithDate}>
                <Link to={'/transactions/' + transaction.hash}>{hash}</Link>
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
            <Link to={'/snapshots/' + transaction.snapshot}>{fitStringInCell(transaction.snapshot)}</Link>
          </div>
          <div className={`${styles.txnCell} ${styles.enoughSpace} ${styles.amount} ${styles.alignItemsLeft}`}>
            {formatNumber(transaction.fee, NumberFormat.WHOLE) + ' dDAG'}
          </div>
          <div className={`${styles.txnCell} ${styles.stackFromTo}`}>
            <div className={styles.stackRow}>
              <div className={styles.alignLeft}>From:</div>
              <div className={styles.alignRight}>
                {<Link to={'/address/' + transaction.sender}>{fitStringInCell(transaction.sender)}</Link>}
              </div>
            </div>
            <div className={styles.stackRow}>
              <div className={styles.alignLeft}>To:</div>
              <div className={styles.alignRight}>
                {<Link to={'/address/' + transaction.receiver}>{fitStringInCell(transaction.receiver)}</Link>}
              </div>
            </div>
          </div>
          <div className={`${styles.txnCell} ${styles.amount}`}>
            {dagInfo && (
              <div className={styles.usd}>{'($' + formatPrice(transaction.amount, dagInfo, 2) + ' USD)'}</div>
            )}
            <div className={styles.dag}>{formatAmount(transaction.amount, 8)}</div>
          </div>
        </>
      );
    }
  }

  if (!transaction) {
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

  return snapRow;
};
