import clsx from 'clsx';
import styles from './SimpleCard.module.scss';

export const SimpleCard = ({ title, subTitle }: { title: string; subTitle: string }) => {
  return (
    <div className={styles.cardContainer}>
      <div className={clsx(styles.cardTitle, 'normalLausanne')}>{title}</div>
      <div className={clsx(styles.cardSubTitle, 'normalLausanne')}>{subTitle}</div>
    </div>
  );
};
