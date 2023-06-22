import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { Snapshot, Transaction } from '../../types';
import { formatPrice, formatAmount, fitStringInCell, formatTime } from '../../utils/numbers';
import CopyIcon from '../../assets/icons/CopyNoBorder.svg';
import styles from './TransactionRow.module.scss';
import clsx from 'clsx';

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
  const [copied, setCopied] = useState<boolean>(false);

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

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
              {tx.isMetagraphTransaction && tx.metagraphId ? (
                <Link to={`/metagraphs/${tx.metagraphId}/transactions/${tx.hash}`}>{hash}</Link>
              ) : (
                <Link to={`/transactions/${tx.hash}`}>{hash}</Link>
              )}
            </div>
          </div>
          <div className={styles.txnCell}>
            <p data-tip={fullDate}>{date}</p>
            <ReactTooltip />
          </div>
          <div className={`${styles.txnCell} ${styles.amount}`}>
            {dagInfo && !tx.isMetagraphTransaction && (
              <div className={styles.usd}>{'($' + formatPrice(tx.amount, dagInfo, 2) + ' USD)'}</div>
            )}
            <div className={styles.dag}>{formatAmount(tx.amount, 8, false, tx.symbol)}</div>
          </div>
        </>
      );
    } else {
      txRow = (
        <>
          <div className={styles.txnCell}>
            <div className={`${styles.txContainer} ${styles.timestamp}`}>
              {icon && icon}
              {tx.isMetagraphTransaction && tx.metagraphId ? (
                <Link to={`/metagraphs/${tx.metagraphId}/transactions/${tx.hash}`}>{hash}</Link>
              ) : (
                <Link to={`/transactions/${tx.hash}`}>{hash}</Link>
              )}
            </div>
            <div className={`${styles.txContainer} ${styles.subTimestamp}`}>
              <div className={styles.stackedIcon}>{icon && icon}</div>
              <div className={styles.hashWithDate}>
                {tx.isMetagraphTransaction && tx.metagraphId ? (
                  <Link to={`/metagraphs/${tx.metagraphId}/transactions/${tx.hash}`}>{hash}</Link>
                ) : (
                  <Link to={`/transactions/${tx.hash}`}>{hash}</Link>
                )}
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
            {formatAmount(tx.fee, 8, false, tx.symbol)}
          </div>
          <div className={`${styles.txnCell} ${styles.stackFromTo}`}>
            <div className={styles.stackRow}>
              <div className={styles.alignRight}>
                <div className={styles.copyLink}>
                  <Link to={'/address/' + tx.source}>{fitStringInCell(tx.source)}</Link>
                  {!copied && (
                    <img className={`${styles.copy}`} src={CopyIcon} onClick={() => handleCopyToClipboard(tx.source)} />
                  )}
                  {copied && (
                    <>
                      <img
                        data-tip="Copied to Clipboard!"
                        className={styles.copy}
                        src={CopyIcon}
                        onClick={() => handleCopyToClipboard(tx.source)}
                      />
                      <ReactTooltip />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={clsx(styles.txnCell, styles.txnDirection)}>
            {tx.direction && (
              <div
                className={clsx(
                  tx.direction === 'OUT' ? styles.transactionDirectionIndigo : styles.transactionDirectionGreen
                )}
              >
                <span>{tx.direction}</span>
              </div>
            )}
          </div>
          <div className={`${styles.txnCell} ${styles.stackFromTo}`}>
            <div className={styles.stackRow}>
              <div className={styles.alignRight}>
                <div className={styles.copyLink}>
                  <Link to={'/address/' + tx.destination}>{fitStringInCell(tx.destination)}</Link>
                  {!copied && (
                    <img
                      className={`${styles.copy}`}
                      src={CopyIcon}
                      onClick={() => handleCopyToClipboard(tx.destination)}
                    />
                  )}
                  {copied && (
                    <>
                      <img
                        data-tip="Copied to Clipboard!"
                        className={styles.copy}
                        src={CopyIcon}
                        onClick={() => handleCopyToClipboard(tx.destination)}
                      />
                      <ReactTooltip />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.txnCell} ${styles.amount}`}>
            {dagInfo && !tx.isMetagraphTransaction && (
              <div className={styles.usd}>{'($' + formatPrice(tx.amount, dagInfo, 2) + ' USD)'}</div>
            )}
            <div className={styles.dag}>{formatAmount(tx.amount, 8, false, tx.symbol)}</div>
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
