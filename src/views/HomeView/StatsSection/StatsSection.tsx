import { useContext, useEffect, useState } from 'react';
import { useGetPrices } from '../../../api/coingecko';
import { useGetLatestSnapshotTotalDagSupply } from '../../../api/l0-node';
import { NetworkContext, NetworkContextType } from '../../../context/NetworkContext';
import { MainnetStats } from './MainnetStats';
import styles from './StatsSection.module.scss';
import { StatCard } from '../../../components/StatCard/component';
import { useGetNetworkStats } from '../../../api/block-explorer';

const StatsSection = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;

  const [dagInfo, setDagInfo] = useState(null);
  const [btcInfo, setBtcInfo] = useState(null);
  const [dagTotalSupply, setDagTotalSupply] = useState(null);

  const totalSupplyInfo = useGetLatestSnapshotTotalDagSupply();
  const networkStats = useGetNetworkStats({}, 2 * 60 * 1000);

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

  const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

  return (
    <div className={styles.stats}>
      <StatCard
        title="TOTAL SNAPSHOTS"
        content={numberFormat.format(networkStats.data?.data.snapshotsTotal ?? 0)}
        showSkeleton={networkStats.isPending}
      />
      <StatCard
        title="TOTAL DAG LOCKED"
        content={numberFormat.format((networkStats.data?.data.totalLockedInDatum ?? 0) / 1e8) + ' DAG'}
        showSkeleton={networkStats.isPending}
      />
      <StatCard
        title="TOTAL SNAPSHOTS FEES (90D)"
        content={numberFormat.format((networkStats.data?.data.fees90d ?? 0) / 1e8) + ' DAG'}
        showSkeleton={networkStats.isPending}
      />
      <StatCard
        title="TOTAL SNAPSHOTS FEES"
        content={numberFormat.format((networkStats.data?.data.feesTotal ?? 0) / 1e8) + ' DAG'}
        showSkeleton={networkStats.isPending}
      />
    </div>
  );
};

export default StatsSection;
