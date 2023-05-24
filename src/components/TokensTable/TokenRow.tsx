import clsx from 'clsx';
import { MetagraphToken } from '../../types';
import styles from './TokenRow.module.scss';

export const TokenRow = ({
  metagraphToken,
  variant,
}: {
  metagraphToken: MetagraphToken | undefined;
  variant?: string;
}) => {
  const classCell = clsx(styles.normalText, 'normalPlexMono');
  return (
    <div className={clsx(styles.tokenRow, variant)}>
      {metagraphToken ? (
        <>
          <div className={styles.tokenCell}>
            <p className={clsx(classCell, styles.black)}>
              {metagraphToken.icon && (
                <img className={styles.tokenIcon} src={metagraphToken.icon} alt={metagraphToken.name} />
              )}
              {metagraphToken.name}
            </p>
          </div>
          <div className={styles.tokenCell}>
            <p className={clsx(classCell, styles.gray)}>{metagraphToken.symbol}</p>
          </div>
          <div className={styles.tokenCell}>
            <p className={clsx(classCell, styles.gray)}>{metagraphToken.price}</p>
          </div>
          <div className={styles.tokenCell}>
            <p className={clsx(classCell, styles.gray)}>{metagraphToken.balance} {metagraphToken.symbol}</p>
          </div>
        </>
      ) : null}
    </div>
  );
};
