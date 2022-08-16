import clsx from 'clsx';
import styles from './ValidatorRow.module.scss';

export const SkeletonValidatorRows = ({ variant }: { variant: string }) => {
  const amountRows = 10;

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
