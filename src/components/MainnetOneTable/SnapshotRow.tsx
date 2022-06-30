import { Link, useLocation } from 'react-router-dom';
import { MainnetOneSnapshot } from '../../types';
import { formatAmount } from '../../utils/numbers';
import styles from './SnapshotRow.module.scss';

export const SnapshotRow = ({ icon, snapshot }: { icon?: string; snapshot?: MainnetOneSnapshot }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  let snapRow = undefined;

  if (snapshot) {
    if (isHomePage) {
      snapRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && <img src={icon} />}
              <Link to={'/snapshots/' + snapshot.height}>{snapshot.height}</Link>
            </div>
          </div>
          <div className={styles.txnCell}>{snapshot.txCount}</div>
          <div className={styles.txnCell}>{formatAmount(snapshot.dagAmount, 8)}</div>
        </>
      );
    } else {
      snapRow = (
        <>
          <div className={styles.txnCell}>
            <div className={styles.txContainer}>
              {icon && <img src={icon} />}
              <Link to={'/snapshots/' + snapshot.height}>{snapshot.height}</Link>
            </div>
          </div>
          <div className={styles.txnCell}>{snapshot.txCount}</div>
          <div className={styles.txnCell}>{formatAmount(snapshot.feeAmount, 8)}</div>
          <div className={`${styles.txnCell}`}>{formatAmount(snapshot.dagAmount, 8)}</div>
        </>
      );
    }
  }

  if (!snapshot) {
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
