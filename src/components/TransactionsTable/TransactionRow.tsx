import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { Snapshot, TotalSupply, Transaction } from '../../types';
import { formatPrice, formatAmount, fitStringInCell, formatTime } from '../../utils/numbers';
import styles from './TransactionRow.module.scss';

const { REACT_APP_TESTNET_L0_NODE_URL } = process.env;
const URL = REACT_APP_TESTNET_L0_NODE_URL + '/dag';
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
  const [snapshotDag, setSnapshotDag] = useState<TotalSupply>(null);
  useEffect(() => {
    const fetchDagSupply = async (ordinal: number) => {
      const data = await fetch(URL + '/' + ordinal + '/total-supply');
      const json = await data.json();
      setSnapshotDag(json);
    };

    if (snapshot) {
      fetchDagSupply(snapshot.ordinal).catch((e) => console.log(e));
    }
  }, []);

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
      const source = fitStringInCell(tx.source);
      const destination = fitStringInCell(tx.destination);
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
