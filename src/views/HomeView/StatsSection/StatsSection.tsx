import { useEffect, useState } from 'react';
import { useGetPrices } from '../../../api/coingecko';
//import { useGetClusterInfo } from '../../../api/l0-node';
import { Card } from '../../../components/Card/Card';
import { SkeletonCard } from '../../../components/Card/SkeletonCard';
import { formatDagPrice, formatMarketVol } from '../../../utils/numbers';
import styles from './StatsSection.module.scss';
const StatsSection = () => {
  const [dagInfo, setDagInfo] = useState(null);
  const [btcInfo, setBtcInfo] = useState(null);
  //const [amountValidators, setAmountValidators] = useState<number>(null);
  const prices = useGetPrices();
  //const l0ClusterInfo = useGetClusterInfo();
  const formater = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

  useEffect(() => {
    if (!prices.isFetching) {
      setDagInfo(prices.data['constellation-labs']);
      setBtcInfo(prices.data['bitcoin']);
    }
  }, [prices.isFetching]);

  const formatTotalSupply = () => 'Total Supply: 3,550,000,000';

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
          <Card
            badge={dagInfo.usd_24h_change}
            headerText={'DAG PRICE'}
            value={'$' + dagInfo.usd}
            info={formatDagPrice(dagInfo, btcInfo)}
          />
          <Card
            headerText={'MARKET CAP'}
            value={'$' + formater.format(dagInfo.usd_market_cap)}
            info={formatMarketVol(formater, dagInfo)}
          />
          <Card headerText={'CIRCULATING SUPPLY'} value={'2,575,620,108'} info={formatTotalSupply()} />
          <Card headerText={'NODE OPERATORS'} value={'0.090479'} info={''} />
        </>
      )}
    </div>
  );
};

export default StatsSection;
