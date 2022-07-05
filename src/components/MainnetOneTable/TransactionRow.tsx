import { Link, useLocation } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { MainnetOneTransaction } from '../../types';
import { fitStringInCell, formatAmount, formatPrice, formatTime } from '../../utils/numbers';
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
            <div className={styles.txContainer}>
              {icon && icon}
              <Link to={'/transactions/' + transaction.hash}>{hash}</Link>
            </div>
          </div>
          <div className={`${styles.txnCell} ${styles.date}`}>
            <p data-tip={fullDate}>{date}</p>
            <ReactTooltip />
          </div>
          <div className={styles.txnCell}>
            <Link to={'/snapshots/' + transaction.snapshot}>{fitStringInCell(transaction.snapshot)}</Link>
          </div>
          <div className={styles.txnCell}>{formatAmount(transaction.fee, 8)}</div>
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
