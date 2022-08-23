import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ValidatorNode } from '../../types';
import { fitStringInCell } from '../../utils/numbers';
import styles from './ValidatorRow.module.scss';

export const ValidatorRow = ({ node, variant }: { node: ValidatorNode | undefined; variant?: string }) => {
  const classCell = clsx(styles.normalText, 'normalPlexMono');
  return (
    <div className={clsx(styles.validatorRow, variant)}>
      {node ? (
        <>
          <div className={styles.validatorCell}>
            <p className={clsx(classCell, styles.black)}>{node.ip}</p>
          </div>
          <div className={styles.validatorCell}>
            <p className={clsx(classCell, styles.gray)}>{node.upTime}</p>
          </div>
          <div className={styles.validatorCell}>
            <p className={clsx(classCell, styles.gray)}>{node.status}</p>
          </div>
          <div className={styles.validatorCell}>
            <p className={clsx(classCell, styles.gray)}>{node.latency ? node.latency : 'N/A'}</p>
          </div>
          <div className={styles.validatorCell}>
            <Link to={'/address/' + node.address} className={classCell}>
              {fitStringInCell(node.address)}
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
};
