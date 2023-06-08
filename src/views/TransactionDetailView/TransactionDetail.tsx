import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetTransaction } from '../../api/block-explorer';
import { Card } from '../../components/Card/Card';
import { DetailRow } from '../../components/DetailRow/DetailRow';
import { MetagraphInfo, Transaction } from '../../types';
import { Subheader } from '../../components/Subheader/Subheader';
import { useGetPrices } from '../../api/coingecko';
import { SkeletonCard } from '../../components/Card/SkeletonCard';
import { IconType } from '../../constants';
import { NotFound } from '../NotFoundView/NotFound';
import { formatAmount, formatDagPrice, formatPriceWithSymbol, formatTime } from '../../utils/numbers';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { useGetClusterInfo } from '../../api/l0-node';
import { AddressShape } from '../../components/Shapes/AddressShape';
import { TransactionShape } from '../../components/Shapes/TransactionShape';
import { SnapshotShape } from '../../components/Shapes/SnapshotShape';
import { CheckCircleShape } from '../../components/Shapes/CheckCircle';
import DAGToken from '../../assets/icons/DAGToken.svg';

import styles from './TransactionDetail.module.scss';
import { useGetMetagraphTransaction } from '../../api/block-explorer/metagraph-transaction';

export const TransactionDetail = () => {
  const { transactionHash } = useParams();

  const rawTransaction = useGetTransaction(transactionHash);
  const metagraphTransaction = useGetMetagraphTransaction(transactionHash);

  const [metagraphInfo, setMetagraphInfo] = useState<MetagraphInfo>(undefined);
  const [transaction, setTransaction] = useState<Transaction>(undefined);

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
    if (
      !rawTransaction.isFetching &&
      !metagraphTransaction.isFetching &&
      !rawTransaction.isError &&
      !metagraphTransaction.isError
    ) {
      if (metagraphTransaction.data.metagraph.metagraphName) {
        setMetagraphInfo(metagraphTransaction.data.metagraph);
      } else {
        setMetagraphInfo({
          metagraphName: 'DAG',
          metagraphSymbol: 'DAG',
          metagraphIcon: DAGToken,
        });
      }
      setTransaction(metagraphTransaction.data.transaction || rawTransaction.data);
    }
  }, [rawTransaction.isFetching, metagraphTransaction.isFetching]);

  useEffect(() => {
    if (rawTransaction.isError || prices.isError || metagraphTransaction.isError) {
      setError(rawTransaction.error.message || prices.error.message || metagraphTransaction.error.message);
    } else {
      setError(undefined);
    }
  }, [rawTransaction.status, prices.status, metagraphTransaction.status]);

  const skeleton = (rawTransaction.isFetching && metagraphTransaction.isFetching) || (!transaction && !metagraphInfo);

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
                        value={!skeleton ? metagraphInfo.metagraphSymbol : ''}
                        skeleton={skeleton}
                        icon={
                          !skeleton ? (
                            <img
                              src={metagraphInfo.metagraphIcon}
                              alt="token_image"
                              className={`${styles.tokenImage}`}
                            />
                          ) : (
                            <></>
                          )
                        }
                      />
                      <DetailRow
                        borderBottom
                        title={'Amount'}
                        value={
                          !skeleton
                            ? formatAmount(transaction.amount, 8, false, metagraphInfo.metagraphSymbol || 'DAG')
                            : ''
                        }
                        subValue={
                          !skeleton &&
                          metagraphInfo &&
                          transaction &&
                          dagInfo &&
                          `(${formatPriceWithSymbol(transaction.amount || 0, dagInfo, 2, '$', 'USD')})`
                        }
                        skeleton={skeleton}
                      />
                      <DetailRow
                        title={'Transaction Fee'}
                        value={
                          !skeleton
                            ? formatAmount(transaction.fee, 8, false, metagraphInfo.metagraphSymbol || 'DAG')
                            : ''
                        }
                        subValue={
                          !skeleton &&
                          metagraphInfo &&
                          transaction &&
                          dagInfo &&
                          `(${formatPriceWithSymbol(transaction.fee || 0, dagInfo, 2, '$', 'USD')})`
                        }
                        skeleton={skeleton}
                      />
                    </div>
                    <div className={`${styles.txGroup}`}>
                      <DetailRow
                        title={'From'}
                        linkTo={'/address'}
                        borderBottom
                        value={!skeleton ? transaction.source : ''}
                        skeleton={skeleton}
                        icon={<AddressShape />}
                        copy
                        isLong
                        isMain
                      />
                      <DetailRow
                        title={'To'}
                        linkTo={'/address'}
                        value={!skeleton ? transaction.destination : ''}
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
                        value={!skeleton ? transaction.hash : ''}
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
                        value={!skeleton ? transaction.blockHash : ''}
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
                        value={!skeleton ? transaction.snapshotOrdinal.toString() : ''}
                        skeleton={skeleton}
                        icon={<SnapshotShape size={'1.8rem'} />}
                      />
                      <DetailRow
                        title={'Timestamp'}
                        borderBottom
                        value={!skeleton ? formatTime(transaction.timestamp, 'relative') : ''}
                        skeleton={skeleton}
                        isLong
                        date={!skeleton ? transaction.timestamp : ''}
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
