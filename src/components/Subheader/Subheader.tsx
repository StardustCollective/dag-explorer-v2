import { IconType } from '../../constants';
import styles from './Subheader.module.scss';
import { Export } from 'phosphor-react';
import { SnapshotShape } from '../Shapes/SnapshotShape';
import { TransactionShape } from '../Shapes/TransactionShape';
import { AddressShape } from '../Shapes/AddressShape';

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
          {IconType.Address === item && <AddressShape size={'1.5rem'} />}
          {IconType.Block === item && <SnapshotShape size={'1.5rem'} />}
          {IconType.Transaction === item && <TransactionShape size={'1.5rem'} />}
          {IconType.Snapshot === item && <SnapshotShape size={'1.5rem'} />}
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
