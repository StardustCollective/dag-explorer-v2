import { HeaderRow } from './HeaderRow';
import styles from './TransactionsTable.module.scss';
import styles2 from './TransactionRow.module.scss';

export const SkeletonTransactionsTable = ({ rows }: { rows: number }) => {
  const transactions = Array.from({ length: rows });
  return (
    <div className={styles.container}>
      <HeaderRow />
      {transactions.map((_, index) => (
        <SkeletonTransactionRow key={index} />
      ))}
    </div>
  );
};

const SkeletonTransactionRow = () => {
  return (
    <>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
      <div className={styles2.txnCell}>
        <div className={`${styles.skeleton} ${styles.value}`} />
      </div>
    </>
  );
};
