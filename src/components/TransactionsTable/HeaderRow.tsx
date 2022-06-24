import { useLocation } from 'react-router-dom';
import styles from './HeaderRow.module.scss';

export const HeaderRow = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const columns = isHomePage ? (
    <>
      <div className={`${styles.headerColumn} ${styles.topLeftBorder}`}>
        <p className={styles.headerText}>TXN HASH</p>
      </div>
      <div className={styles.headerColumn}>
        <p className={styles.headerText}>TIMESTAMP</p>
      </div>
      <div className={`${styles.headerColumn} ${styles.topRightBorder}`}>
        <p className={styles.headerText}>AMOUNT</p>
      </div>
    </>
  ) : (
    <>
      <div className={`${styles.headerColumn} ${styles.topLeftBorder}`}>
        <p className={styles.headerText}>TXN HASH</p>
      </div>

      <div className={styles.headerColumn}>
        <p className={styles.headerText}>TIMESTAMP</p>
      </div>

      <div className={styles.headerColumn}>
        <p className={styles.headerText}>SNAPSHOT</p>
      </div>

      <div className={styles.headerColumn}>
        <p className={styles.headerText}>FEE</p>
      </div>

      <div className={styles.headerColumn}>
        <p className={styles.headerText}>FROM</p>
      </div>

      <div className={styles.headerColumn}>
        <p className={styles.headerText}>TO</p>
      </div>

      <div className={`${styles.headerColumn} ${styles.topRightBorder}`}>
        <p className={styles.headerText}>AMOUNT</p>
      </div>
    </>
  );

  return columns;
};
