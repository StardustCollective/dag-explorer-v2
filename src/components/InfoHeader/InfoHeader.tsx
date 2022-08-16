import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styles from './InfoHeader.module.scss';
import { formatTime } from '../../utils/numbers';

export const InfoHeader = ({ title, lastUpdatedAt }: { title: string; lastUpdatedAt?: number }) => {
  const [info, setInfo] = useState(formatTime(lastUpdatedAt, 'relative'));

  useEffect(() => {
    const intervalId = setInterval(() => setInfo(formatTime(lastUpdatedAt, 'relative')), 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [lastUpdatedAt]);

  return (
    <div className={styles.infoHeader}>
      <p className={clsx(styles.infoHeaderTitle, 'normalLausanne')}>{title}</p>
      <div className={clsx(styles.infoHeaderSubTitle, 'normalLausanne')}>{lastUpdatedAt ? info : ''}</div>
    </div>
  );
};
