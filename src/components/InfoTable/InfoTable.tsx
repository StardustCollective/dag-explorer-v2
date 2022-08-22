import { InfoHeader } from '../InfoHeader/InfoHeader';
import { SkeletonInfoHeader } from '../InfoHeader/SkeletonInfoHeader';
import { SimpleCard } from '../SimpleCard/SimpleCard';
import { SkeletonSimpleCard } from '../SimpleCard/SkeletonSimpleCard';
import styles from './InfoTable.module.scss';

export const InfoTable = ({
  title,
  loading,
  validatorsAmount,
  totalRewards,
  lastUpdatedAt,
}: {
  title: string;
  loading: boolean;
  validatorsAmount: number;
  totalRewards: number;
  lastUpdatedAt: number;
}) => {
  const transformedDagAmount = (totalRewards / Math.pow(10, 8)).toFixed(8);
  const formattedAmount = Math.round(Number.parseFloat(transformedDagAmount) / 1000000);
  return (
    <div className={styles.tableContainer}>
      {loading ? <SkeletonInfoHeader /> : <InfoHeader title={title} lastUpdatedAt={lastUpdatedAt} />}
      <div className={styles.cardsContainer}>
        {loading ? <SkeletonSimpleCard /> : <SimpleCard title={validatorsAmount.toString()} subTitle={'VALIDATORS'} />}
        <div className={styles.verticalLine} />
        {loading ? <SkeletonSimpleCard /> : <SimpleCard title={formattedAmount + 'M'} subTitle={'TOTAL REWARDS'} />}
      </div>
    </div>
  );
};
