import styles from './Card.module.scss';
export const SkeletonCard = () => {
  return (
    <div className={styles.card}>
      <div className={`${styles.line}`} />
      <div className={`${styles.skeleton} ${styles.line}`} />
      <div className={`${styles.skeleton} ${styles.content}`} />
      <div className={`${styles.skeleton} ${styles.line}`} />
    </div>
  );
};
