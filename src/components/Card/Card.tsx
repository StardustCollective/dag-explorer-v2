import styles from './Card.module.scss';
export const Card = ({
  headerText,
  value,
  info,
  badge,
}: {
  headerText?: string;
  value?: string;
  info?: string;
  badge?: boolean;
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>{headerText}</div>
      <div className={styles.content}>
        <p className={styles.title}>{value}</p>
        {badge && <div className={styles.badge}>BADGE</div>}
      </div>
      <div className={styles.text}>{info}</div>
    </div>
  );
};
