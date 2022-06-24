import styles from './Snapshots.module.scss';

export const Snapshots = () => {
  return (
    <>
      <div className={'subHeader'}>
        <div className={styles.title}>All Snapshots</div>
      </div>

      <div className={`${styles.container}`}>
        <div className={styles.snapshots}>Snapshots</div>
      </div>
    </>
  );
};
