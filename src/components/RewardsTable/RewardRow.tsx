import { useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { AddressRewardsResponse } from '../../types';
import { formatPrice, formatAmount, fitStringInCell, formatTime } from '../../utils/numbers';
import CopyIcon from '../../assets/icons/CopyNoBorder.svg';
import styles from './RewardRow.module.scss';

export const RewardRow = ({
  reward,
  icon,
  dagInfo,
  isLastRow,
}: {
  reward?: AddressRewardsResponse;
  icon?: JSX.Element;
  dagInfo?: any;
  isLastRow?: boolean;
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  let txRow = undefined;

  if (reward) {
    const date = formatTime(reward.accruedAt, 'relative');
    const fullDate = formatTime(reward.accruedAt, 'full');
    txRow = (
      <>
        <div className={`${clsx(isLastRow ? styles.txnCellLastRow : styles.txnCell)} ${styles.stackFromTo}`}>
          <div className={styles.stackRow}>
            <div className={styles.alignRight}>
              <div className={styles.copyLink}>
                <Link to={'/address/' + reward.address}>{fitStringInCell(reward.address)}</Link>
                {!copied && (
                  <img
                    className={`${styles.copy}`}
                    src={CopyIcon}
                    onClick={() => handleCopyToClipboard(reward.address)}
                  />
                )}
                {copied && (
                  <>
                    <img
                      data-tip="Copied to Clipboard!"
                      className={styles.copy}
                      src={CopyIcon}
                      onClick={() => handleCopyToClipboard(reward.address)}
                    />
                    <ReactTooltip />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={clsx(isLastRow ? styles.txnCellLastRow : styles.txnCell)}>
          {reward.metagraphId ? (
            <Link to={`/metagraphs/${reward.metagraphId}/snapshots/${reward.ordinal}`}>{reward.ordinal}</Link>
          ) : (
            <Link to={'/snapshots/' + reward.ordinal}>{reward.ordinal}</Link>
          )}
        </div>
        <div className={`${clsx(isLastRow ? styles.txnCellLastRow : styles.txnCell)} ${styles.amount}`}>
          {dagInfo && !reward.metagraphId && (
            <div className={styles.usd}>{'($' + formatPrice(reward.amount, dagInfo, 2) + ' USD)'}</div>
          )}
          <div className={styles.dag}>{formatAmount(reward.amount, 8, false, reward.symbol)}</div>
        </div>
        <div
          className={`${clsx(isLastRow ? styles.txnCellLastRow : styles.txnCell)} ${styles.date} ${styles.timestamp}`}
        >
          <p data-tip={fullDate}>{date}</p>
          <ReactTooltip />
        </div>
      </>
    );
  }

  let snapRow = undefined;

  if (!reward) {
    snapRow = (
      <>
        <div className={clsx(isLastRow ? styles.txnEmptyLastRow : styles.txnEmptyRow)} />
        <div className={clsx(isLastRow ? styles.txnEmptyLastRow : styles.txnEmptyRow)} />
        <div className={clsx(isLastRow ? styles.txnEmptyLastRow : styles.txnEmptyRow)} />
        <div className={clsx(isLastRow ? styles.txnEmptyLastRow : styles.txnEmptyRow)} />
        <div className={clsx(isLastRow ? styles.txnEmptyLastRow : styles.txnEmptyRow)} />
        <div className={clsx(isLastRow ? styles.txnEmptyLastRow : styles.txnEmptyRow)} />
        <div className={clsx(isLastRow ? styles.txnEmptyLastRow : styles.txnEmptyRow)} />
        <div className={clsx(isLastRow ? styles.txnEmptyLastRow : styles.txnEmptyRow)} />
      </>
    );
  }

  return reward ? txRow : snapRow;
};
