import clsx from 'clsx';
import { useState } from 'react';
import ReactTooltip from 'react-tooltip';

import { AddressMetagraphResponse } from '../../types';
import { fitStringInCell, formatAmount } from '../../utils/numbers';

import { ReactComponent as DefaultTokenIcon } from '../../assets/icons/DefaultTokenIcon.svg';
import { ReactComponent as DAGToken } from '../../assets/icons/DAGToken.svg';
import CopyIcon from '../../assets/icons/CopyNoBorder.svg';

import styles from './TokenRow.module.scss';
import { Link } from 'react-router-dom';

export const TokenRow = ({
  metagraphToken,
  variant,
}: {
  metagraphToken?: AddressMetagraphResponse;
  variant?: string;
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const classCell = clsx(styles.normalText, 'normalPlexMono');
  return (
    <div className={clsx(styles.tokenRow, variant)}>
      {metagraphToken ? (
        <>
          <div className={styles.tokenCell}>
            <Link to={`/metagraphs/${metagraphToken.metagraphId}`} className={clsx(classCell, styles.link)}>
              {metagraphToken.metagraphIcon ? (
                <img className={styles.tokenIcon} src={metagraphToken.metagraphIcon} />
              ) : metagraphToken.metagraphSymbol === 'DAG' ? (
                <DAGToken className={styles.tokenIcon} />
              ) : (
                <DefaultTokenIcon className={styles.tokenIcon} />
              )}
              {metagraphToken.metagraphName}
            </Link>
          </div>
          <div className={styles.tokenCell}>
            <p className={clsx(classCell, styles.gray)}>{metagraphToken.metagraphSymbol}</p>
          </div>
          <div className={styles.tokenCell}>
            <Link to={`/metagraphs/${metagraphToken.metagraphId}`} className={clsx(classCell, styles.link)}>
              {fitStringInCell(metagraphToken.metagraphId, 8)}
            </Link>
            {!copied && (
              <img
                className={`${styles.copy}`}
                src={CopyIcon}
                onClick={() => handleCopyToClipboard(metagraphToken.metagraphId)}
              />
            )}
            {copied && (
              <>
                <img
                  data-tip="Copied to Clipboard!"
                  className={styles.copy}
                  src={CopyIcon}
                  onClick={() => handleCopyToClipboard(metagraphToken.metagraphId)}
                />
                <ReactTooltip />
              </>
            )}
          </div>
          <div className={styles.tokenCell}>
            <p className={clsx(classCell, styles.gray)}>
              {formatAmount(metagraphToken.balance, 6, false, metagraphToken.metagraphSymbol)}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className={clsx(classCell, styles.tokenCell, styles.gray)}> — </div>
          <div className={clsx(classCell, styles.tokenCell, styles.gray)}> — </div>
          <div className={clsx(classCell, styles.tokenCell, styles.gray)}> — </div>
          <div className={clsx(classCell, styles.tokenCell, styles.gray)}> — </div>
        </>
      )}
    </div>
  );
};
