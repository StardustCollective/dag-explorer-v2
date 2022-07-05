import styles from './DetailRow.module.scss';
import { Content } from './Content';

export const DetailRow = ({
  ...props
}: {
  borderBottom?: boolean;
  value?: string;
  title: string;
  linkTo?: string;
  skeleton?: boolean;
  copy?: boolean;
  date?: string;
  subValue?: string;
  isLong?: boolean;
  isMain?: boolean;
  isStatus?: boolean;
  icon?: JSX.Element;
}) => {
  return (
    <div className={`${styles.txFlexRow} ${props.borderBottom ? styles.borderBottom : styles}`}>
      <div className={styles.title}>
        <p className={'headerSubtitle'}>{props.title}</p>
      </div>
      <div className={styles.mobile}>
        <Content {...props} />
      </div>
      <div className={styles.desktop}>
        <Content {...props} isLong={false} />
      </div>
    </div>
  );
};
