import clsx from 'clsx';
import styles from './TokenRow.module.scss';

export const SkeletonTokenRows = ({ variant, amountRows }: { variant: string; amountRows: number }) => {
  return (
    <>
      {[...Array(amountRows)].map((_, idx) => (
        <div key={idx} className={clsx(styles.validatorRow, idx % 2 === 0 ? variant : undefined)}>
          <div className={clsx(styles.validatorCell, styles.skeleton, 'skeleton')}></div>
        </div>
      ))}
    </>
  );
};
