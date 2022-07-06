import { useContext, useEffect, useState } from 'react';
import { useGetPrices } from '../../../api/coingecko';
import { useGetProxyClusterInfo } from '../../../api/l0-node';
import { Card } from '../../../components/Card/Card';
import { NetworkContext, NetworkContextType } from '../../../context/NetworkContext';
import { formatDagPrice, formatMarketVol, formatTotalSupply } from '../../../utils/numbers';
import { MainnetStats } from './MainnetStats';
import styles from './StatsSection.module.scss';

const StatsSection = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;

  const [dagInfo, setDagInfo] = useState(null);
  const [btcInfo, setBtcInfo] = useState(null);

  const [clusterData, setClusterData] = useState(null);
  const clusterInfo = useGetProxyClusterInfo();

  useEffect(() => {
    if (!clusterInfo.isFetching) {
      setClusterData(clusterInfo.data);
    }
  }, [clusterInfo.isFetching]);

  const prices = useGetPrices();

  const formater = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

  useEffect(() => {
    if (!prices.isFetching) {
      setDagInfo(prices.data['constellation-labs']);
      setBtcInfo(prices.data['bitcoin']);
    }
  }, [prices.isFetching]);

  if (network === 'mainnet1') {
    return (
      <div className={styles.stats}>
        <MainnetStats skeleton={{ showSkeleton: !dagInfo }} dagInfo={dagInfo} btcInfo={btcInfo} />
      </div>
    );
  }

  return (
    <div className={styles.stats}>
      <Card
        skeleton={{ showSkeleton: !dagInfo || !clusterData }}
        badge={dagInfo ? dagInfo.usd_24h_change : ''}
        headerText={'DAG PRICE'}
        value={dagInfo ? '$' + dagInfo.usd : ''}
        info={dagInfo ? formatDagPrice(dagInfo, btcInfo) : ''}
      />
      <Card
        skeleton={{ showSkeleton: !dagInfo || !clusterData }}
        headerText={'MARKET CAP'}
        value={dagInfo ? '$' + formater.format(dagInfo.usd_market_cap) : ''}
        info={dagInfo ? formatMarketVol(formater, dagInfo) : ''}
      />
      <Card
        skeleton={{ showSkeleton: !dagInfo || !clusterData }}
        headerText={'CIRCULATING SUPPLY'}
        value={'2,575,620,108'}
        info={formatTotalSupply()}
      />
      <Card
        skeleton={{ showSkeleton: !dagInfo || !clusterData }}
        headerText={'NODE OPERATORS'}
        info={''}
        value={clusterData ? clusterData.length + ' validators' : ''}
      />
    </div>
  );
};

export default StatsSection;
