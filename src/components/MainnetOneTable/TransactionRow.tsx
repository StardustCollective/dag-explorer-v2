import { Link, useLocation } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { MainnetOneTransaction } from '../../types';
import { fitStringInCell, formatAmount, formatTime } from '../../utils/numbers';
import styles from './SnapshotRow.module.scss';

export const TransactionRow = ({ icon, transaction }: { icon?: string; transaction?: MainnetOneTransaction }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  let snapRow = undefined;
  if (transaction) {
    const hash = fitStringInCell(transaction.hash);
    const date = new Date(transaction.timestamp);
    if (isHomePage) {
      const date = new Date(transaction.timestamp);
      snapRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && <img src={icon} />}
              <Link to={'/transactions/' + transaction.hash}>{hash}</Link>
            </div>
          </div>
          <div className={styles.txnCell}>
            <p data-tip={date.toUTCString()}>{formatTime(date)}</p>
            <ReactTooltip />
          </div>
          <div className={styles.txnCell}>{formatAmount(transaction.amount, 8)}</div>
        </>
      );
    } else {
      snapRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && <img src={icon} />}
              <Link to={'/transactions/' + transaction.hash}>{hash}</Link>
            </div>
          </div>
          <div className={`${styles.txnCell} ${styles.date}`}>
            <p data-tip={date.toUTCString()}>{formatTime(date)}</p>
            <ReactTooltip />
          </div>
          <div className={styles.txnCell}>
            <Link to={'/snapshots/' + transaction.snapshot}>{fitStringInCell(transaction.snapshot)}</Link>
          </div>
          <div className={styles.txnCell}>{transaction.fee}</div>
          <div className={styles.txnCell}>
            {<Link to={'/address/' + transaction.sender}>{fitStringInCell(transaction.sender)}</Link>}
          </div>
          <div className={styles.txnCell}>
            {<Link to={'/address/' + transaction.receiver}>{fitStringInCell(transaction.receiver)}</Link>}
          </div>
          <div className={styles.txnCell}>{formatAmount(transaction.amount, 8)}</div>
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
