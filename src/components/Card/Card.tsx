import styles from './Card.module.scss';
import ArrowUp from '../../assets/icons/ArrowUp.svg';
import ArrowDown from '../../assets/icons/ArrowDown.svg';
import { Skeleton } from '../../types';
import { SkeletonCard } from './SkeletonCard';

export const Card = ({
  headerText,
  value,
  info,
  badge,
  skeleton,
}: {
  headerText?: string;
  value?: string;
  info?: string;
  badge?: number;
  skeleton?: Skeleton;
}) => {
  return skeleton && skeleton.showSkeleton ? (
    <SkeletonCard />
  ) : (
    <div className={styles.card}>
      <div className={styles.header}>{headerText}</div>
      <div className={styles.content}>
        {value && <p className={styles.title}>{value}</p>}
        {badge && badge > 0 && (
          <div className={`${styles.badge} ${styles.positive}`}>
            <img src={ArrowUp} />
            <div className={styles.value}>{(Math.round(badge * 10) / 10).toFixed(1) + '%'}</div>
          </div>
        )}
        {badge && badge < 0 && (
          <div className={`${styles.badge} ${styles.negative}`}>
            <img src={ArrowDown} />
            <div className={styles.value}>{(Math.round(badge * 10) / 10).toFixed(1) + '%'}</div>
          </div>
        )}
      </div>
      <div className={info ? styles.text : styles.noText}>{info}</div>
    </div>
  );
};
