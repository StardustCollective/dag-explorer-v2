import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainnetOneTransaction } from '../../../types';
import { DetailRow } from '../../../components/DetailRow/DetailRow';
import { Subheader } from '../../../components/Subheader/Subheader';
import { IconType } from '../../../constants';
import styles from '../../TransactionDetailView/TransactionDetail.module.scss';
import AddressShape from '../../../assets/icons/AddressShape.svg';
import SnapshotShape from '../../../assets/icons/SnapshotShape.svg';
import TransactionShape from '../../../assets/icons/TransactionShape.svg';
import Success from '../../../assets/icons/Success.svg';
import { NotFound } from '../../NotFoundView/NotFound';
import { useGetTransaction } from '../../../api/mainnet_1/block-explorer';
import { useGetPrices } from '../../../api/coingecko';
import { SkeletonCard } from '../../../components/Card/SkeletonCard';
import { Card } from '../../../components/Card/Card';
import { formatAmount, formatDagPrice, formatPrice, formatTime } from '../../../utils/numbers';
import { SearchBar } from '../../../components/SearchBar/SearchBar';

const formater = new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 });

export const MainnetOneTransactionDetails = () => {
  const { transactionHash } = useParams();
  const [transaction, setTransaction] = useState<MainnetOneTransaction | undefined>(undefined);
  const transactionInfo = useGetTransaction(transactionHash);
  const [error, setError] = useState<string>(undefined);

  const [dagInfo, setDagInfo] = useState(null);
  const [btcInfo, setBtcInfo] = useState(null);
  const prices = useGetPrices();

  useEffect(() => {
    if (!prices.isFetching && !prices.isError) {
      setDagInfo(prices.data['constellation-labs']);
      setBtcInfo(prices.data['bitcoin']);
    }
  }, [prices.isFetching]);

  useEffect(() => {
    if (!transactionInfo.isLoading && !transactionInfo.isFetching && !transactionInfo.isError) {
      if (transactionInfo.data) {
        setTransaction(transactionInfo.data);
      }
    }
  }, [transactionInfo.isLoading, transactionInfo.isFetching]);

  useEffect(() => {
    if (transactionInfo.status === 'error') {
      setError(transactionInfo.error.message);
    }
  }, [transactionInfo.status]);

  const skeleton = transactionInfo.isLoading || !transaction;
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
                        value={!skeleton ? formatAmount(transaction.amount, 8) : ''}
                        subValue={
                          !skeleton
                            ? '($' +
                              formater.format(
                                parseFloat(formatPrice(formatAmount(transaction.amount, 8), dagInfo, 2))
                              ) +
                              ' USD)'
                            : ''
                        }
                        skeleton={skeleton}
                      />
                      <DetailRow
                        title={'TRANSACTION FEE'}
                        value={!skeleton ? formatAmount(transaction.fee, 8) : ''}
                        skeleton={skeleton}
                      />
                    </div>
                    <div className={`${styles.txGroup}`}>
                      <DetailRow
                        title={'FROM'}
                        linkTo={'/address'}
                        borderBottom
                        value={!skeleton ? transaction.sender : ''}
                        skeleton={skeleton}
                        icon={AddressShape}
                        copy
                        isLong
                      />
                      <DetailRow
                        title={'TO'}
                        linkTo={'/address'}
                        value={!skeleton ? transaction.receiver : ''}
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
                        value={!skeleton ? transaction.hash : ''}
                        skeleton={skeleton}
                        icon={TransactionShape}
                        copy
                        isLong
                      />
                      <DetailRow
                        title={'SNAPSHOT HASH'}
                        linkTo={'/snapshots'}
                        borderBottom
                        value={!skeleton ? transaction.snapshotHash : ''}
                        skeleton={skeleton}
                        icon={SnapshotShape}
                        copy
                        isLong
                      />
                      <DetailRow
                        title={'TIMESTAMP'}
                        borderBottom
                        value={!skeleton ? formatTime(transactionInfo.data.timestamp, 'relative') : ''}
                        skeleton={skeleton}
                        isLong
                        date={!skeleton ? formatTime(transactionInfo.data.timestamp, 'full') : ''}
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
