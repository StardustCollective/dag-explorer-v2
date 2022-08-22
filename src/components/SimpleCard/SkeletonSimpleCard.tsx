import clsx from 'clsx';
import styles from './SimpleCard.module.scss';

export const SkeletonSimpleCard = () => {
  return (
    <div className={clsx(styles.cardContainer)}>
      <div className={clsx(styles.cardTitle, styles.skeleton, 'skeleton')} />
      <div className={clsx(styles.cardSubTitle, styles.skeleton, 'skeleton')} />
    </div>
  );
};
