import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { fitStringInCell, formatTime } from '../../utils/numbers';
import styles from './DetailRow.module.scss';
import CopyIcon from '../../assets/icons/Copy.svg';

export const Content = ({
  ...props
}: {
  borderBottom?: boolean;
  value?: string;
  title: string;
  linkTo?: string;
  onlyLink?: React.ReactNode;
  skeleton?: boolean;
  icon?: JSX.Element;
  copy?: boolean;
  date?: string;
  subValue?: string;
  isLong?: boolean;
  isMain?: boolean;
  isStatus?: boolean;
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const { skeleton, icon, linkTo, onlyLink, value, isLong, date, copy, subValue, isMain, isStatus } = props;

  return skeleton ? (
    <div className={`${styles.skeleton} ${styles.value}`} />
  ) : (
    <div className={`${styles.content} ${isStatus && styles.status}`}>
      {icon && icon}
      <div className={`${styles.value}`}>
        {linkTo ? (
          <Link to={linkTo + '/' + value} className={isMain ? styles.truncate : undefined}>
            {isLong && !date && !isMain ? fitStringInCell(value) : value}
          </Link>
        ) : (
          <div className={isMain ? styles.truncate : undefined}>
            {isLong && !date && !isMain ? fitStringInCell(value) : value}
            {onlyLink}
          </div>
        )}
        {date && !isLong && <p className={styles.fullDate}>{'(' + formatTime(date, 'full') + ')'}</p>}
        {copy && !copied && (
          <img className={`${styles.copy}`} src={CopyIcon} onClick={() => handleCopyToClipboard(value)} />
        )}
        {subValue && !isLong && <div className={styles.subValue}>{subValue}</div>}
        {copy && copied && (
          <>
            <img
              data-tip="Copied to Clipboard!"
              className={styles.copy}
              src={CopyIcon}
              onClick={() => handleCopyToClipboard(value)}
            />
            <ReactTooltip />
          </>
        )}
      </div>
    </div>
  );
};
