import clsx from 'clsx';
import styles from './HeaderRow.module.scss';

export const HeaderRow = () => {
  const cellClass = clsx(styles.headerText, 'normalLausanne');
  return (
    <div className={styles.headerRow}>
      <div className={styles.headerCell}>
        <p className={cellClass}>NODE</p>
      </div>
      <div className={styles.headerCell}>
        <p className={cellClass}>UP TIME</p>
      </div>
      <div className={styles.headerCell}>
        <p className={cellClass}>STATUS</p>
      </div>
      <div className={styles.headerCell}>
        <p className={cellClass}>LATENCY</p>
      </div>
      <div className={styles.headerCell}>
        <p className={cellClass}>ADDRESS</p>
      </div>
    </div>
  );
};
