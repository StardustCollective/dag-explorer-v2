import { IconType } from '../../constants';
import styles from './Subheader.module.scss';
import AddressShape from '../../assets/icons/AddressShape.svg';
import BlockShape from '../../assets/icons/BlockShape.svg';
import TransactionShape from '../../assets/icons/TransactionShape.svg';
import SnapshotShape from '../../assets/icons/SnapshotShape.svg';
import { Export } from 'phosphor-react';

export const Subheader = ({
  text,
  item,
  hasExport,
  handleExport,
}: {
  text: string;
  item: IconType;
  hasExport?: boolean;
  handleExport?: () => void;
}) => {
  return (
    <section className={`${styles.fullWidth} ${styles.section}`}>
      <div className={`${styles.row} ${styles.subheader}`}>
        <div className={styles.subheaderItem}>
          {IconType.Address === item && <img className={styles.icon} src={AddressShape} />}
          {IconType.Block === item && <img className={styles.icon} src={BlockShape} height="1rem" />}
          {IconType.Transaction === item && <img className={styles.icon} src={TransactionShape} height="1rem" />}
          {IconType.Snapshot === item && <img className={styles.icon} src={SnapshotShape} height="1rem" />}
          <p className="subheaderText">{text}</p>
        </div>
        {hasExport && (
          <div className={styles.subheaderItem} onClick={handleExport}>
            <div className={styles.buttonExport}>
              <p>Export CSV</p>
              <Export size={20} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
