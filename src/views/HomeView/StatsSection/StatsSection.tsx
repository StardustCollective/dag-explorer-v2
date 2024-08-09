import { useContext, useEffect, useState } from 'react';
import { useGetPrices } from '../../../api/coingecko';
import { useGetClusterInfo, useGetLatestSnapshotTotalDagSupply } from '../../../api/l0-node';
import { Card } from '../../../components/Card/Card';
import { NetworkContext, NetworkContextType } from '../../../context/NetworkContext';
import { formatAmount, formatDagPrice, formatMarketVol, formatTotalSupply } from '../../../utils/numbers';
import { MainnetStats } from './MainnetStats';
import styles from './StatsSection.module.scss';

const StatsSection = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;

  const [dagInfo, setDagInfo] = useState(null);
  const [btcInfo, setBtcInfo] = useState(null);
  const [dagTotalSupply, setDagTotalSupply] = useState(null);

  const [clusterData, setClusterData] = useState(null);
  const clusterInfo = useGetClusterInfo();
  const totalSupplyInfo = useGetLatestSnapshotTotalDagSupply();

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

  useEffect(() => {
    if (!totalSupplyInfo.isFetching) {
      setDagTotalSupply(totalSupplyInfo.data.total);
    }
  }, [totalSupplyInfo.isFetching]);

  if (network === 'mainnet1') {
    return (
      <div className={styles.mainnetStats}>
        <MainnetStats
          skeleton={{ showSkeleton: !dagInfo || !dagTotalSupply }}
          dagInfo={dagInfo}
          btcInfo={btcInfo}
          dagSupply={dagTotalSupply}
        />
      </div>
    );
  }

  return (
    <div className={styles.stats}>
      <Card
        skeleton={{ showSkeleton: !dagInfo || !clusterData || !dagTotalSupply }}
        badge={dagInfo ? dagInfo.usd_24h_change : ''}
        headerText={'DAG PRICE'}
        value={dagInfo ? '$' + dagInfo.usd : ''}
      />
      <Card
        skeleton={{ showSkeleton: !dagInfo || !clusterData || !dagTotalSupply }}
        headerText={'MARKET CAP'}
        value={dagInfo ? '$' + formater.format(dagInfo.usd_market_cap) : ''}
      />
      <Card
        skeleton={{ showSkeleton: !dagInfo || !clusterData || !dagTotalSupply }}
        headerText={'CIRCULATING SUPPLY'}
        value={formatAmount(dagTotalSupply, 0).replace('DAG', '')}
      />
      <Card
        skeleton={{ showSkeleton: !dagInfo || !clusterData || !dagTotalSupply }}
        headerText={'NODE OPERATORS'}
        info={'View Node Explorer'}
        value={clusterData ? clusterData.length + ' validators' : ''}
        infoLink={'/node-explorer/'}
      />
    </div>
  );
};

export default StatsSection;
