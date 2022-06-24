import { IconType } from '../../constants';
import styles from './Subheader.module.scss';
import AddressShape from '../../assets/icons/AddressShape.svg';
import BlockShape from '../../assets/icons/BlockShape.svg';
import TransactionShape from '../../assets/icons/TransactionShape.svg';
import SnapshotShape from '../../assets/icons/SnapshotShape.svg';

export const Subheader = ({ text, item }: { text: string; item: IconType }) => {
  return (
    <section className={`${styles.fullWidth} ${styles.section}`}>
      <div className={`${styles.row} ${styles.subheader}`}>
        {IconType.Address === item && <img className={styles.icon} src={AddressShape} />}
        {IconType.Block === item && <img className={styles.icon} src={BlockShape} height="1rem" />}
        {IconType.Transaction === item && <img className={styles.icon} src={TransactionShape} height="1rem" />}
        {IconType.Snapshot === item && <img className={styles.icon} src={SnapshotShape} height="1rem" />}
        <p className="subheaderText">{text}</p>
      </div>
    </section>
  );
};
