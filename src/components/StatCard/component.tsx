import styles from './component.module.scss';
import clsx from 'clsx';

export type IStatCardProps = {
  title: string;
  content: string;
  changeLabel?: string;
  changeLabelDirection?: 'up' | 'down';
  showSkeleton?: boolean;
};

export const StatCard = ({ title, content, changeLabel, changeLabelDirection }: IStatCardProps) => {
  return (
    <div className={styles.main}>
      <span className={styles.title}>{title}</span>
      <span className={styles.content}>
        {content}
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
