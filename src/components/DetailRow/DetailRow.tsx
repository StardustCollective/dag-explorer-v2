import { Link } from 'react-router-dom';
import styles from './DetailRow.module.scss';

export const DetailRow = ({
  borderBottom,
  value,
  title,
  linkTo,
  skeleton,
  icon,
}: {
  borderBottom?: boolean;
  value?: string;
  title: string;
  linkTo?: string;
  skeleton?: boolean;
  icon?: string;
}) => {
  return (
    <div className={`${styles.txFlexRow} ${borderBottom ? styles.borderBottom : styles}`}>
      <div className={styles.title}>
        <p className={'headerSubtitle'}>{title}</p>
      </div>
      {skeleton ? (
        <div className={`${styles.skeleton} ${styles.value}`} />
      ) : (
        <div className={styles.content}>
          {icon && <img src={icon} />}
          <div className={styles.value}>{linkTo ? <Link to={linkTo + '/' + value}>{value}</Link> : <p>{value}</p>}</div>
        </div>
      )}
    </div>
  );
};
