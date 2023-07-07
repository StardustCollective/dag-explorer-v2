import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSnapshot, useGetSnapshotTransactions } from '../../api/block-explorer';
import { MetagraphInfo, Snapshot, Transaction } from '../../types';
import { ArrowButton } from '../../components/Buttons/ArrowButton';
import { DetailRow } from '../../components/DetailRow/DetailRow';
import { Subheader } from '../../components/Subheader/Subheader';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { IconType } from '../../constants';
import styles from './SnapshotDetails.module.scss';
import { NotFound } from '../NotFoundView/NotFound';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { formatTime } from '../../utils/numbers';
import { SnapshotShape } from '../../components/Shapes/SnapshotShape';
import { handleFetchedData, handlePagination } from '../../utils/pagination';
import { FetchedData, Params } from '../../types/requests';
import { useGetMetagraph } from '../../api/block-explorer/metagraphs';
import { fillTransactionsWithMetagraphInfo } from '../../utils/metagraph';

const LIMIT = 8;

export const SnapshotDetails = () => {
  const { snapshotHeight, metagraphId } = useParams();
  const [snapshotTxs, setSnapshotTxs] = useState<Transaction[] | undefined>(undefined);
  const [snapshot, setSnapshot] = useState<Snapshot | undefined>(undefined);
  const [params, setParams] = useState<Params>({ limit: LIMIT });
  const [fetchedData, setFetchedData] = useState<FetchedData<Transaction>[] | undefined>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const snapshotTransactions = useGetSnapshotTransactions(snapshotHeight, params, metagraphId);
  //const snapshotRewards = useGetSnapshotRewards(snapshotHeight);
  const snapshotInfo = useGetSnapshot(snapshotHeight, metagraphId);
  const [error, setError] = useState<string>(undefined);
  const [txsSkeleton, setTxsSkeleton] = useState(false);
  const [lastPage, setLastPage] = useState(false);

  const metagraphInfo = useGetMetagraph(metagraphId);
  const [metagraph, setMetagraph] = useState<MetagraphInfo>(undefined);

  useEffect(() => {
    if (
      metagraphId &&
      !snapshotTransactions.isFetching &&
      !snapshotTransactions.isError &&
      !metagraphInfo.isFetching &&
      !metagraphInfo.isError
    ) {
      if (snapshotTransactions.data?.data.length > 0) {
        const txns = fillTransactionsWithMetagraphInfo(metagraphId, snapshotTransactions.data.data, metagraphInfo.data);
        setSnapshotTxs(txns);
      }

      setLastPage(!snapshotTransactions.data?.meta?.next);
      handleFetchedData(setFetchedData, snapshotTransactions, currentPage, setLastPage);
      setMetagraph(metagraphInfo.data);
      setTxsSkeleton(false);
      return;
    }

    if (!snapshotTransactions.isFetching && !snapshotTransactions.isError) {
      if (snapshotTransactions.data?.data.length > 0) {
        setSnapshotTxs(snapshotTransactions.data.data);
      }
      setLastPage(!snapshotTransactions.data?.meta?.next);
      handleFetchedData(setFetchedData, snapshotTransactions, currentPage, setLastPage);
      setTxsSkeleton(false);
    }
  }, [snapshotTransactions.isFetching, metagraphInfo.isFetching]);

  useEffect(() => {
    if (!snapshotInfo.isLoading && !snapshotInfo.isFetching && !snapshotInfo.isError) {
      if (metagraphId) {
        snapshotInfo.data.metagraphId = metagraphId;
      }
      setSnapshot(snapshotInfo.data);
    }
  }, [snapshotInfo.isLoading, snapshotInfo.isFetching]);

  useEffect(() => {
    if (snapshotInfo.status === 'error' || snapshotTransactions.status === 'error') {
      setError(snapshotInfo.error && snapshotInfo.error.message);
    }
  }, [snapshotTransactions.status, snapshotInfo.status]);

  const [handlePrevPage, handleNextPage] = handlePagination<Transaction[], FetchedData<Transaction>[]>(
    snapshotTxs,
    setSnapshotTxs,
    fetchedData,
    currentPage,
    setCurrentPage,
    setParams,
    setLastPage,
    setTxsSkeleton,
    LIMIT
  );

  const skeleton = snapshotInfo.isFetching || !snapshotInfo.data;
  return (
    <>
      <section className={`${styles.searchMobile}`}>
        <div className={`${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <Subheader text={'Snapshot details'} item={IconType.Snapshot} />
      {error ? (
        <NotFound entire={false} errorCode={error} />
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
                    <DetailRow
                      linkTo={
                        !skeleton && snapshot && snapshot.metagraphId
                          ? `/metagraphs/${snapshot.metagraphId}/snapshots`
                          : '/snapshots'
                      }
                      borderBottom
                      title={'Snapshot Height'}
                      value={snapshot && snapshot.height.toString()}
                      skeleton={skeleton}
                      icon={<SnapshotShape size={'1.5rem'} />}
                    />
                    <DetailRow
                      borderBottom
                      title={'Timestamp'}
                      value={!skeleton ? formatTime(snapshotInfo.data.timestamp, 'relative') : ''}
                      date={!skeleton ? snapshotInfo.data.timestamp : ''}
                      skeleton={skeleton}
                    />
                    <DetailRow
                      borderBottom={!!metagraphId}
                      title={'Blocks'}
                      value={
                        !skeleton && snapshot
                          ? snapshot.blocks.length > 1
                            ? `${snapshot.blocks.length.toString()} blocks confirmed`
                            : `${snapshot.blocks.length.toString()} block confirmed`
                          : ''
                      }
                      skeleton={skeleton}
                      icon={<SnapshotShape size={'1.5rem'} />}
                    />
                    {metagraphId && (
                      <>
                        <DetailRow
                          borderBottom
                          title={'Metagraph Name'}
                          value={!skeleton && metagraph && metagraph.metagraphName}
                          skeleton={skeleton && !metagraph}
                        />
                        <DetailRow
                          title={'MetagraphId'}
                          value={!skeleton && metagraph && metagraph.metagraphId}
                          skeleton={skeleton && !metagraph}
                          copy
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={`${styles.row3}`}>
                <div className={`${styles.flexRowBottom}`}>
                  <p className="overviewText">Transactions</p>
                </div>
              </div>
              <div className={`${styles.row4}`}>
                {!error && (
                  <TransactionsTable
                    skeleton={{ showSkeleton: txsSkeleton }}
                    limit={LIMIT}
                    transactions={snapshotTxs}
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
                      disabled={currentPage === 0 || txsSkeleton || error !== undefined}
                    />
                    <ArrowButton
                      forward
                      handleClick={handleNextPage}
                      disabled={txsSkeleton || lastPage || error !== undefined}
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
