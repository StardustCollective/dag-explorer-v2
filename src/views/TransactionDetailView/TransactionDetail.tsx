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
import AddressShape from '../../assets/icons/AddressShape.svg';
import BlockShape from '../../assets/icons/BlockShape.svg';
import TransactionShape from '../../assets/icons/TransactionShape.svg';
import SnapshotShape from '../../assets/icons/SnapshotShape.svg';
import Success from '../../assets/icons/Success.svg';
import { NotFound } from '../NotFoundView/NotFound';
import { formatAmount, formatDagPrice, formatTime } from '../../utils/numbers';
import { SearchBar } from '../../components/SearchBar/SearchBar';

export const TransactionDetail = () => {
  const { transactionHash } = useParams();
  const transaction = useGetTransaction(transactionHash);
  const [data, setData] = useState<Transaction | undefined>(undefined);

  const [dagInfo, setDagInfo] = useState(null);
  const [btcInfo, setBtcInfo] = useState(null);
  const prices = useGetPrices();
  const [error, setError] = useState<string>(undefined);
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
      setError(transaction.error.message);
    } else {
      setError(undefined);
    }
  }, [transaction.status, prices.status]);
  const skeleton = transaction.isFetching || !data;
  return (
    <>
      <section className={`${styles.searchMobile}`}>
        <div className={`${styles.row} ${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <Subheader text={'Transaction details'} item={IconType.Transaction} />
      {error === '404' ? (
        <NotFound entire={false} />
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
                        title={'AMOUNT'}
                        value={!skeleton ? formatAmount(data.amount, 8) : ''}
                        skeleton={skeleton}
                      />
                      <DetailRow
                        title={'TRANSACTION FEE'}
                        value={!skeleton ? formatAmount(data.fee, 8) : ''}
                        skeleton={skeleton}
                      />
                    </div>
                    <div className={`${styles.txGroup}`}>
                      <DetailRow
                        title={'FROM'}
                        linkTo={'/address'}
                        borderBottom
                        value={!skeleton ? data.source : ''}
                        skeleton={skeleton}
                        icon={AddressShape}
                        copy
                        isLong
                      />
                      <DetailRow
                        title={'TO'}
                        linkTo={'/address'}
                        value={!skeleton ? data.destination : ''}
                        skeleton={skeleton}
                        icon={AddressShape}
                        copy
                        isLong
                      />
                    </div>
                    <div className={`${styles.txGroup}`}>
                      <DetailRow
                        title={'TRANSACTION HASH'}
                        borderBottom
                        value={!skeleton ? data.hash : ''}
                        skeleton={skeleton}
                        icon={TransactionShape}
                        copy
                        isLong
                      />
                      <DetailRow
                        title={'BLOCK'}
                        linkTo={'/blocks'}
                        borderBottom
                        value={!skeleton ? data.blockHash : ''}
                        skeleton={skeleton}
                        icon={BlockShape}
                        copy
                        isLong
                      />
                      <DetailRow
                        title={'SNAPSHOT HEIGHT'}
                        linkTo={'/snapshots'}
                        borderBottom
                        value={!skeleton ? data.snapshotOrdinal.toString() : ''}
                        skeleton={skeleton}
                        icon={SnapshotShape}
                      />
                      <DetailRow
                        title={'TIMESTAMP'}
                        borderBottom
                        value={!skeleton ? formatTime(transaction.data.timestamp, 'relative') : ''}
                        skeleton={skeleton}
                        isLong
                        date={!skeleton ? transaction.data.timestamp : ''}
                      />
                      <DetailRow title={'STATUS'} value={'Success'} skeleton={skeleton} icon={Success} />
                    </div>
                  </div>
                </div>
                <div className={`${styles.column2}`}>
                  {!dagInfo ? (
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
                      <Card headerText={'NODE OPERATORS'} value={'100 validators'} />
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
