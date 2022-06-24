import styles from './Transactions.module.scss';

export const Transactions = () => {
  return (
    <>
      <div className={'subHeader'}>
        <div className={styles.title}>All transactions</div>
      </div>
      <div className={`${styles.container}`}>
        <div className={styles.transactions}>Transactions</div>
      </div>
    </>
  );
};
