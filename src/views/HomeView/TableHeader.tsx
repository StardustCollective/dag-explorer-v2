import styles from './HomeView.module.scss';

export const TableHeader = ({ text, icon }: { text: string; icon: string }) => {
  return (
    <div className={styles.tableHeader}>
      <div>{text}</div>
      <img src={icon} />
    </div>
  );
};
