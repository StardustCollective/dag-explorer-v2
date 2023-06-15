import clsx from 'clsx';
import styles from './TokenRow.module.scss';

export const SkeletonTokenRows = ({ variant, amountRows }: { variant: string; amountRows: number }) => {
  return (
    <>
      {[...Array(amountRows)].map((_, idx) => (
        <>
        <div key={idx} className={clsx(styles.tokenRow, idx % 2 === 0 ? variant : undefined)}>
          <div className={clsx(styles.tokenCell, styles.skeleton, 'skeleton')}></div>
        </div>
        </>
      ))}
    </>
  );
};
