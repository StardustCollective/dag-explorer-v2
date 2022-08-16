import styles from './Card.module.scss';
import ArrowUp from '../../assets/icons/ArrowUp.svg';
import ArrowDown from '../../assets/icons/ArrowDown.svg';
import { Skeleton } from '../../types';
import { SkeletonCard } from './SkeletonCard';
import { Link } from 'react-router-dom';

export const Card = ({
  headerText,
  value,
  info,
  badge,
  skeleton,
  infoLink,
}: {
  headerText?: string;
  value?: string;
  info?: string;
  badge?: number;
  skeleton?: Skeleton;
  infoLink?: string;
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
      <div className={info ? styles.text : styles.noText}>
        {infoLink ? <Link to={infoLink}>{info}</Link> : <span>{info}</span>}
      </div>
    </div>
  );
};
