import clsx from 'clsx';
import styles from './InfoHeader.module.scss';

export const SkeletonInfoHeader = () => {
  return (
    <div className={clsx(styles.infoHeader)}>
      <div className={clsx(styles.infoHeaderSubTitle, styles.skeleton, 'skeleton')} />
    </div>
  );
};
