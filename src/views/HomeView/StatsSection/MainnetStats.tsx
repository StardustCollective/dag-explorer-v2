import { useEffect, useState } from 'react';
import { useGetClusterInfo } from '../../../api/mainnet_1/load-balancer';
import { Card } from '../../../components/Card/Card';
import { Skeleton } from '../../../types';
import { formatDagPrice, formatMarketVol, formatTotalSupply } from '../../../utils/numbers';

const formater = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
export const MainnetStats = ({ skeleton, dagInfo, btcInfo }: { skeleton?: Skeleton; dagInfo: any; btcInfo: any }) => {
  const [clusterData, setClusterData] = useState(null);
  const clusterInfo = useGetClusterInfo();

  useEffect(() => {
    if (!clusterInfo.isFetching) {
      setClusterData(clusterInfo.data);
    }
  }, [clusterInfo.isFetching]);

  return (
    <>
      <Card
        skeleton={{ showSkeleton: skeleton.showSkeleton || !clusterData }}
        badge={dagInfo ? dagInfo.usd_24h_change : ''}
        headerText={'DAG PRICE'}
        value={dagInfo ? '$' + dagInfo.usd : ''}
        info={dagInfo ? formatDagPrice(dagInfo, btcInfo) : ''}
      />
      <Card
        skeleton={{ showSkeleton: skeleton.showSkeleton || !clusterData }}
        headerText={'MARKET CAP'}
        value={dagInfo ? '$' + formater.format(dagInfo.usd_market_cap) : ''}
        info={dagInfo ? formatMarketVol(formater, dagInfo) : ''}
      />
      <Card
        skeleton={{ showSkeleton: skeleton.showSkeleton || !clusterData }}
        headerText={'CIRCULATING SUPPLY'}
        value={'2,575,620,108'}
        info={formatTotalSupply()}
      />
      <Card
        skeleton={{ showSkeleton: skeleton.showSkeleton || !clusterData }}
        headerText={'NODE OPERATORS'}
        value={clusterData ? clusterData.length + ' validators' : ''}
        info={''}
      />
    </>
  );
};
