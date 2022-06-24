import { useEffect, useState } from 'react';
import { useGetPrices } from '../../../api/coingecko';
//import { useGetClusterInfo } from '../../../api/l0-node';
import { Card } from '../../../components/Card/Card';
import { SkeletonCard } from '../../../components/Card/SkeletonCard';
import styles from './StatsSection.module.scss';
const StatsSection = () => {
  const [dagInfo, setDagInfo] = useState(null);
  //const [amountValidators, setAmountValidators] = useState<number>(null);
  const prices = useGetPrices();
  //const l0ClusterInfo = useGetClusterInfo();
  const formater = new Intl.NumberFormat('en-US');

  useEffect(() => {
    if (!prices.isFetching) {
      setDagInfo(prices.data['constellation-labs']);
    }
  }, [prices.isFetching]);

  return (
    <div className={styles.stats}>
      {!dagInfo ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : (
        <>
          <Card badge headerText={'DAG PRICE'} value={'$' + dagInfo.usd} info={'0.09 USD 0.00000285'} />
          <Card
            headerText={'MARKET CAP'}
            value={formater.format(dagInfo.usd_market_cap)}
            info={'0.09 USD 0.00000285'}
          />
          <Card headerText={'CIRCULATING SUPPLY'} value={'0.090479'} info={'0.09 USD 0.00000285'} />
          <Card headerText={'NODE OPERATORS'} value={'0.090479'} info={'0.09 USD 0.00000285'} />
        </>
      )}
    </div>
  );
};

export default StatsSection;
