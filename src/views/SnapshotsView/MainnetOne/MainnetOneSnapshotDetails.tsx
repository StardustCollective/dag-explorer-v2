import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainnetOneSnapshot, MainnetOneTransaction } from '../../../types';
import { ArrowButton } from '../../../components/Buttons/ArrowButton';
import { DetailRow } from '../../../components/DetailRow/DetailRow';
import { Subheader } from '../../../components/Subheader/Subheader';
import { IconType } from '../../../constants';
import styles from '../SnapshotDetails.module.scss';
import { NotFound } from '../../NotFoundView/NotFound';
import { useGetSnapshot, useGetTransactionsBySnapshot } from '../../../api/mainnet_1/block-explorer';
import { MainnetOneTransactionTable } from '../../../components/MainnetOneTable/MainnetOneTransactionTable';
import { SearchBar } from '../../../components/SearchBar/SearchBar';
import { SnapshotShape } from '../../../components/Shapes/SnapshotShape';

const LIMIT = 8;

export const MainnetOneSnapshotDetails = () => {
  const { snapshotHeight } = useParams();
  const [startAt, setStartAt] = useState(0);
  const [endAt, setEndAt] = useState(LIMIT);
  const [snapshotTxs, setSnapshotTxs] = useState<MainnetOneTransaction[] | undefined>(undefined);
  const [snapshot, setSnapshot] = useState<MainnetOneSnapshot | undefined>(undefined);
  const [realHeight, setRealHeight] = useState(null);
  const [realHash, setRealHash] = useState(null);
  const snapshotTransactions = useGetTransactionsBySnapshot(snapshotHeight);
  const snapshotInfo = useGetSnapshot(snapshotHeight);
  const [isPrev, setIsPrev] = useState(false);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [error, setError] = useState<string>(undefined);
  useEffect(() => {
    if (!snapshotTransactions.isLoading && !snapshotTransactions.isFetching && !snapshotTransactions.isError) {
      if (snapshotTransactions.data) {
        const arrTxs: MainnetOneTransaction[] = [];
        let dagAmount = 0;
        let feeAmount = 0;
        Object.values(snapshotTransactions.data).map((t) => {
          dagAmount += t.amount;
          feeAmount += t.fee;
          const transaction: MainnetOneTransaction = {
            amount: t.amount,
            fee: t.fee,
            hash: t.hash,
            receiver: t.receiver,
            sender: t.sender,
            snapshot: t.snapshotHash,
            timestamp: t.timestamp,
          };
          arrTxs.push(transaction);
        });
        setSnapshotTxs(arrTxs);

        setSnapshot({
          dagAmount,
          feeAmount,
          txCount: arrTxs.length,
          height: parseInt(snapshotHeight),
          snapshotHash: arrTxs.length > 0 ? arrTxs[0].snapshot : undefined,
        });
      }
      if (snapshotTransactions.data.length < LIMIT) {
        setLastPage(true);
      }
    }
  }, [snapshotTransactions.isLoading, snapshotTransactions.isFetching]);

  useEffect(() => {
    if (!snapshotInfo.isFetching && !snapshotInfo.isError) {
      setRealHeight(snapshotInfo.data.height);
      setRealHash(snapshotInfo.data.hash);
    }
  }, [snapshotInfo.isFetching]);

  useEffect(() => {
    if (!snapshotTransactions.isFetching && !snapshotTransactions.isError) {
      if (isPrev) {
        setSnapshotTxs(snapshotTransactions.data.reverse());
      }
    }
  }, [snapshotTransactions.isFetching]);

  useEffect(() => {
    if (
      !snapshotTransactions.isFetching &&
      (snapshotTransactions.status === 'error' || snapshotInfo.status === 'error')
    ) {
      setError(snapshotTransactions.error.message);
    }
  }, [snapshotTransactions.status, snapshotInfo.status]);

  const handleNextPage = () => {
    if (snapshotTxs) {
      setStartAt((s) => s + LIMIT);
      setEndAt((e) => e + LIMIT);
      setIsPrev(false);
      setPage((p) => p + 1);

      if ((page + 1) * LIMIT < snapshotTxs.length && (page + 1) * LIMIT + LIMIT >= snapshotTxs.length) {
        setLastPage(true);
      }
    }
  };

  const handlePrevPage = () => {
    if (snapshotTxs) {
      setStartAt((s) => s - LIMIT);
      setEndAt((e) => e - LIMIT);
      setIsPrev(true);
      setPage((p) => p - 1);
      setLastPage(false);
    }
  };

  const skeleton = snapshotTransactions.isLoading || !snapshot || !realHeight;
  return (
    <>
      <section className={`${styles.searchMobile}`}>
        <div className={`${styles.row} ${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <Subheader text={'Snapshot details'} item={IconType.Snapshot} />
      {error === '404' || error === '500' ? (
        <NotFound entire={false} />
      ) : (
        <main className={`${styles.fullWidth3}`}>
          {!error && (
            <>
              <div className={`${styles.row1}`}>
                <div className={`${styles.flexRowBottom}`}>
                  <p className="overviewText">Overview</p>
                </div>
              </div>
              <div className={`${styles.row2}`}>
                <div className={styles.spanContent}>
                  <div className={`${styles.txGroup}`}>
                    {skeleton ? (
                      <>
                        <DetailRow borderBottom title={'SNAPSHOT HEIGHT'} value={''} skeleton={skeleton} />
                        <DetailRow borderBottom title={'SNAPSHOT HASH'} value={''} skeleton={skeleton} />
                        <DetailRow title={'TRANSACTION COUNT'} value={''} skeleton={skeleton} />
                      </>
                    ) : (
                      <>
                        <DetailRow
                          linkTo={'/snapshots'}
                          borderBottom
                          title={'SNAPSHOT HEIGHT'}
                          value={realHeight}
                          skeleton={skeleton}
                          icon={<SnapshotShape size={'1.5rem'} />}
                        />
                        <DetailRow
                          borderBottom
                          copy={!!realHash}
                          title={'SNAPSHOT HASH'}
                          value={realHash}
                          skeleton={skeleton}
                          isLong
                        />
                        <DetailRow title={'TRANSACTION COUNT'} value={snapshot.txCount.toString()} />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={`${styles.row3}`}>
                <div className={`${styles.flexRowBottom}`}>
                  <p className="overviewText">Transactions</p>

                  <div className={styles.arrows}>
                    <ArrowButton
                      handleClick={handlePrevPage}
                      disabled={page === 0 || snapshotTransactions.isFetching || error !== undefined}
                    />
                    <ArrowButton
                      forward
                      handleClick={handleNextPage}
                      disabled={snapshotTransactions.isFetching || lastPage || error !== undefined}
                    />
                  </div>
                </div>
              </div>
              <div className={`${styles.row4}`}>
                {!error && (
                  <MainnetOneTransactionTable
                    skeleton={{ showSkeleton: snapshotTransactions.isFetching || !snapshot }}
                    limit={LIMIT}
                    transactions={snapshotTxs ? snapshotTxs.slice(startAt, endAt) : null}
                    icon={<SnapshotShape />}
                  />
                )}
              </div>
              <div className={`${styles.row5}`}>
                <div className={`${styles.flexRowTop}`}>
                  <span />

                  <div className={styles.arrows}>
                    <ArrowButton
                      handleClick={handlePrevPage}
                      disabled={page === 0 || snapshotTransactions.isFetching || error !== undefined}
                    />
                    <ArrowButton
                      forward
                      handleClick={handleNextPage}
                      disabled={snapshotTransactions.isFetching || lastPage || error !== undefined}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      )}
    </>
  );
};
