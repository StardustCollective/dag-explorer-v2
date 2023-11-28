import clsx from 'clsx';
import { HeaderRow } from './HeaderRow';
import styles from './RewardsTable.module.scss';
import styles2 from './RewardRow.module.scss';
import styles3 from '../MainnetOneTable/MainnetOneTable.module.scss';
import { cloneElement, useContext } from 'react';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';

export const SkeletonTransactionsTable = ({
  rows,
  headerText,
  icon,
  headerCols,
  showMetagraphSymbol,
}: {
  rows: number;
  headerText?: string;
  icon?: JSX.Element;
  headerCols?: string[];
  showMetagraphSymbol?: boolean;
}) => {
  const { networkVersion } = useContext(NetworkContext) as NetworkContextType;
  const transactions = Array.from({ length: rows });
  return (
    <div className={networkVersion === '2.0' ? styles.container : styles3.container}>
      {headerText && <div className={styles.headerText}>{headerText}</div>}
      {headerText && <span />}
      {showMetagraphSymbol && headerText && <span />}
      {headerText && cloneElement(icon, { classname: styles3.icon, size: '20px' })}
      <HeaderRow headerCols={headerCols} />
      {transactions.map((_, index) => (
        <SkeletonRewardRow key={index} isLastRow={index + 1 === transactions.length} />
      ))}
    </div>
  );
};

const SkeletonRewardRow = ({ isLastRow }: { isLastRow?: boolean }) => {
  return (
    <>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
      <div className={clsx(isLastRow ? styles2.txnCellLastRow : styles2.txnCell)}>
        <div className={clsx(styles.skeleton, styles.value)} />
      </div>
    </>
  );
};
