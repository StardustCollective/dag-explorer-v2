import styles from './MobileCard.module.scss';

export const SkeletonMobileCard = ({ titleElements }: { titleElements: JSX.Element[] }) => {
  const infoSkeletons: JSX.Element[] = titleElements.map((t, index) => (
    <div className={`${styles.skeleton} ${styles.content}`} key={index}></div>
  ));
  return (
    <div className={styles.cardContainer}>
      <div className={styles.titleContainer}>{titleElements}</div>
      <div className={styles.infoContainer}>{infoSkeletons}</div>
    </div>
  );
};
