import { useContext, useEffect, useState } from 'react';
import { useGetPrices } from '../../../api/coingecko';
import { useGetClusterInfo, useGetLatestSnapshotTotalDagSupply } from '../../../api/l0-node';

import { NetworkContext, NetworkContextType } from '../../../context/NetworkContext';
import { formatAmount } from '../../../utils/numbers';
import { MainnetStats } from './MainnetStats';
import styles from './StatsSection.module.scss';
import { StatCard } from '../../../components/StatCard/component';

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
      <StatCard
        title="DAG PRICE"
        content={dagInfo ? '$' + dagInfo.usd : ''}
        showSkeleton={!dagInfo || !clusterData || !dagTotalSupply}
        changeLabel={
          dagInfo
            ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(Math.abs(dagInfo.usd_24h_change))
            : undefined
        }
        changeLabelDirection={(dagInfo?.usd_24h_change ?? 0) >= 0 ? 'up' : 'down'}
      />
      <StatCard
        title="MARKET CAP"
        content={
          dagInfo
            ? '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(dagInfo.usd_market_cap)
            : ''
        }
        showSkeleton={!dagInfo || !clusterData || !dagTotalSupply}
      />
      <StatCard
        title="CIRCULATING SUPPLY"
        content={formatAmount(dagTotalSupply, 0).replace('DAG', '')}
        showSkeleton={!dagInfo || !clusterData || !dagTotalSupply}
      />
      <StatCard
        title="NODE OPERATORS"
        content={clusterData ? clusterData.length + ' validators' : ''}
        showSkeleton={!dagInfo || !clusterData || !dagTotalSupply}
      />
    </div>
  );
};

export default StatsSection;
