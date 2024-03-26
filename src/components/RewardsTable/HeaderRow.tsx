import styles from './HeaderRow.module.scss';
import clsx from 'clsx';

export const HeaderRow = ({ headerCols }: { headerCols?: string[] }) => {
  if (headerCols) {
    return (
      <>
        {headerCols.map((text, index) => (
          <div className={styles.headerColumn} key={index}>
            <p className={styles.headerText}>{text}</p>
          </div>
        ))}
      </>
    );
  }
  const columns = (
    <>
      <div className={`${styles.headerColumn} ${styles.stackFromTo}`}>
        <p className={styles.headerText}>SENT TO</p>
      </div>

      <div className={`${styles.headerColumn}`}>
        <p className={styles.headerText}>REWARDS TXNS</p>
      </div>

      <div className={clsx(styles.headerColumn, styles.topRightBorder)}>
        <p className={styles.headerText}>DAILY TOTAL</p>
      </div>

      <div className={clsx(styles.headerColumn, styles.timestamp)}>
        <p className={styles.headerText}>DATE</p>
      </div>
    </>
  );

  return columns;
};
