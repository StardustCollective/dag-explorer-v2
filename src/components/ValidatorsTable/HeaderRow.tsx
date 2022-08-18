import clsx from 'clsx';
import styles from './HeaderRow.module.scss';

export const HeaderRow = ({ headers }: { headers: string[] }) => {
  const cellClass = clsx(styles.headerText, 'normalLausanne');
  return (
    <div className={styles.headerRow}>
      {headers.map((header, idx) => (
        <div className={styles.headerCell} key={idx}>
          <p className={cellClass}>{header}</p>
        </div>
      ))}
    </div>
  );
};
