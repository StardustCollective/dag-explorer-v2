import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetTransaction } from '../../api/block-explorer';
import { Card } from '../../components/Card/Card';
import { DetailRow } from '../../components/DetailRow/DetailRow';
import styles from './TransactionDetail.module.scss';
import { Transaction } from '../../types';
import { Subheader } from '../../components/Subheader/Subheader';
import { useGetPrices } from '../../api/coingecko';
import { SkeletonCard } from '../../components/Card/SkeletonCard';
import { IconType } from '../../constants';
import { NotFound } from '../NotFoundView/NotFound';
import { formatAmount, formatDagPrice, formatPrice, formatPriceWithSymbol, formatTime } from '../../utils/numbers';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { useGetClusterInfo } from '../../api/l0-node';
import { AddressShape } from '../../components/Shapes/AddressShape';
import { TransactionShape } from '../../components/Shapes/TransactionShape';
import { SnapshotShape } from '../../components/Shapes/SnapshotShape';
import { CheckCircleShape } from '../../components/Shapes/CheckCircle';

export const TransactionDetail = () => {
  const { transactionHash } = useParams();
  const transaction = useGetTransaction(transactionHash);
  const [data, setData] = useState<Transaction | undefined>(undefined);

  const [dagInfo, setDagInfo] = useState(null);
  const [btcInfo, setBtcInfo] = useState(null);
  const prices = useGetPrices();
  const [error, setError] = useState<string>(undefined);

  const [clusterData, setClusterData] = useState(null);
  const clusterInfo = useGetClusterInfo();

  useEffect(() => {
    if (!clusterInfo.isFetching) {
      setClusterData(clusterInfo.data);
    }
  }, [clusterInfo.isFetching]);

  useEffect(() => {
    if (!prices.isFetching && !prices.isError) {
      setDagInfo(prices.data['constellation-labs']);
      setBtcInfo(prices.data['bitcoin']);
    }
  }, [prices.isFetching]);

  useEffect(() => {
    if (!transaction.isFetching && !transaction.isError) {
      setData(transaction.data);
    }
  }, [transaction.isFetching]);

  useEffect(() => {
    if (transaction.isError || prices.isError) {
      setError(transaction.error.message || prices.error.message);
    } else {
      setError(undefined);
    }
  }, [transaction.status, prices.status]);
  const skeleton = transaction.isFetching || !data;

  const tokenInfos = {
    tokenName: 'DAG',
    tokenImage: 'https://pbs.twimg.com/profile_images/1590732001992114178/sIGtbT44_400x400.jpg',
  };

  return (
    <>
      <section className={`${styles.searchMobile}`}>
        <div className={`${styles.row} ${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <Subheader text={'Transaction details'} item={IconType.Transaction} />
      {error ? (
        <NotFound entire={false} errorCode={error} />
      ) : (
        <main className={`${styles.fullWidth3}`}>
          {!error && (
            <>
              <div className={`${styles.row1}`}>
                <div className={`${styles.flexRow1}`}>
                  <div className={styles.overView}>
                    <p className="overviewText">Overview</p>
                  </div>
                </div>
              </div>
              <div className={`${styles.row2}`}>
                <div className={`${styles.column1}`}>
                  <div className={`${styles.flexTxContainer}`}>
                    <div className={`${styles.txGroup}`}>
                      <DetailRow
                        borderBottom
                        title={'Token'}
                        value={!skeleton ? tokenInfos.tokenName : ''}
                        skeleton={skeleton}
                        icon={<img src={tokenInfos.tokenImage} alt="token_image" className={`${styles.tokenImage}`} />}
                      />
                      <DetailRow
                        borderBottom
                        title={'Amount'}
                        value={!skeleton ? formatAmount(data.amount, 8) : ''}
                        subValue={
                          !skeleton && data && `(${formatPriceWithSymbol(data.amount || 0, dagInfo, 2, '$', 'USD')})`
                        }
                        skeleton={skeleton}
                      />
                      <DetailRow
                        title={'Transaction Fee'}
                        value={!skeleton ? formatAmount(data.fee, 8) : ''}
                        subValue={
                          !skeleton && data && `(${formatPriceWithSymbol(data.fee || 0, dagInfo, 2, '$', 'USD')})`
                        }
                        skeleton={skeleton}
                      />
                    </div>
                    <div className={`${styles.txGroup}`}>
                      <DetailRow
                        title={'From'}
                        linkTo={'/address'}
                        borderBottom
                        value={!skeleton ? data.source : ''}
                        skeleton={skeleton}
                        icon={<AddressShape />}
                        copy
                        isLong
                        isMain
                      />
                      <DetailRow
                        title={'To'}
                        linkTo={'/address'}
                        value={!skeleton ? data.destination : ''}
                        skeleton={skeleton}
                        icon={<AddressShape />}
                        copy
                        isLong
                        isMain
                      />
                    </div>
                    <div className={`${styles.txGroup}`}>
                      <DetailRow
                        title={'Transaction Hash'}
                        borderBottom
                        value={!skeleton ? data.hash : ''}
                        skeleton={skeleton}
                        icon={<TransactionShape />}
                        copy
                        isLong
                        isMain
                      />
                      <DetailRow
                        title={'Block'}
                        linkTo={'/blocks'}
                        borderBottom
                        value={!skeleton ? data.blockHash : ''}
                        skeleton={skeleton}
                        icon={<SnapshotShape />}
                        copy
                        isLong
                        isMain
                      />
                      <DetailRow
                        title={'Snapshot Ordinal'}
                        linkTo={'/snapshots'}
                        borderBottom
                        value={!skeleton ? data.snapshotOrdinal.toString() : ''}
                        skeleton={skeleton}
                        icon={<SnapshotShape size={'1.8rem'} />}
                      />
                      <DetailRow
                        title={'Timestamp'}
                        borderBottom
                        value={!skeleton ? formatTime(transaction.data.timestamp, 'relative') : ''}
                        skeleton={skeleton}
                        isLong
                        date={!skeleton ? transaction.data.timestamp : ''}
                      />
                      <DetailRow
                        title={'Status'}
                        value={'Success'}
                        skeleton={skeleton}
                        icon={<CheckCircleShape size={'2rem'} />}
                        isStatus
                      />
                    </div>
                  </div>
                </div>
                <div className={`${styles.column2}`}>
                  {!dagInfo || !clusterData ? (
                    <>
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
                        headerText={'NODE OPERATORS'}
                        value={clusterData ? clusterData.length + ' validators' : ''}
                      />
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      )}
    </>
  );
};
