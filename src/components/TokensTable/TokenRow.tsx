import clsx from 'clsx';
import { MetagraphInfo } from '../../types';

import { ReactComponent as DefaultTokenIcon } from '../../assets/icons/DefaultTokenIcon.svg';
import { ReactComponent as DAGToken } from '../../assets/icons/DAGToken.svg';

import styles from './TokenRow.module.scss';

export const TokenRow = ({
  metagraphToken,
  variant,
}: {
  metagraphToken: MetagraphInfo | undefined;
  variant?: string;
}) => {
  const classCell = clsx(styles.normalText, 'normalPlexMono');
  return (
    <div className={clsx(styles.tokenRow, variant)}>
      {metagraphToken ? (
        <>
          <div className={styles.tokenCell}>
            <p className={clsx(classCell, styles.black)}>
              {metagraphToken.metagraphIcon ? (
                <img className={styles.tokenIcon} src={metagraphToken.metagraphIcon} />
              ) : metagraphToken.metagraphSymbol === 'DAG' ? (
                <DAGToken className={styles.tokenIcon} />
              ) : (
                <DefaultTokenIcon className={styles.tokenIcon} />
              )}
              {metagraphToken.metagraphName}
            </p>
          </div>
          <div className={styles.tokenCell}>
            <p className={clsx(classCell, styles.gray)}>{metagraphToken.metagraphSymbol}</p>
          </div>
          <div className={styles.tokenCell}>
            <p className={clsx(classCell, styles.gray)}>{10}</p>
          </div>
          <div className={styles.tokenCell}>
            <p className={clsx(classCell, styles.gray)}>
              {10} {metagraphToken.metagraphSymbol}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
};
