import { SkeletonSpan } from '../SkeletonSpan/component';
import styles from './component.module.scss';
import clsx from 'clsx';

export type IStatCardProps = {
  title: string;
  content: string;
  changeLabel?: string;
  changeLabelDirection?: 'up' | 'down';
  showSkeleton?: boolean;
};

export const StatCard = ({ title, content, changeLabel, changeLabelDirection, showSkeleton }: IStatCardProps) => {
  return (
    <div className={styles.main}>
      <span className={styles.title}>{title}</span>
      <span className={styles.content}>
        {showSkeleton ? <SkeletonSpan /> : content}
        {changeLabel && (
          <span className={clsx(styles.change, styles[changeLabelDirection ?? 'up'])}>
            {changeLabelDirection === 'up' ? '+' : '-'}
            {changeLabel}%
          </span>
        )}
      </span>
    </div>
  );
};
