import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSnapshot, useGetSnapshotTransactions } from '../../api/block-explorer';
import { Snapshot, Transaction } from '../../types';
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

const LIMIT = 8;

export const SnapshotDetails = () => {
  const { snapshotHeight } = useParams();
  const [snapshotTxs, setSnapshotTxs] = useState<Transaction[] | undefined>(undefined);
  const [snapshot, setSnapshot] = useState<Snapshot | undefined>(undefined);
  const [params, setParams] = useState<Params>({ limit: LIMIT });
  const [fetchedData, setFetchedData] = useState<FetchedData<Transaction>[] | undefined>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const snapshotTransactions = useGetSnapshotTransactions(snapshotHeight, params);
  //const snapshotRewards = useGetSnapshotRewards(snapshotHeight);
  const snapshotInfo = useGetSnapshot(snapshotHeight);
  const [error, setError] = useState<string>(undefined);
  const [txsSkeleton, setTxsSkeleton] = useState(false);

  useEffect(() => {
    setTxsSkeleton(true);
    if (!snapshotTransactions.isFetching && !snapshotTransactions.isError) {
      if (snapshotTransactions.data?.data.length > 0) {
        setSnapshotTxs(snapshotTransactions.data.data);
      }
      handleFetchedData(setFetchedData, snapshotTransactions, currentPage);
      setTxsSkeleton(false);
    }
  }, [snapshotTransactions.isFetching]);

  useEffect(() => {
    if (!snapshotInfo.isLoading && !snapshotInfo.isFetching && !snapshotInfo.isError) {
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
                      linkTo={'/snapshots'}
                      borderBottom
                      title={'SNAPSHOT ORDINAL'}
                      value={snapshot && snapshot.ordinal.toString()}
                      skeleton={skeleton}
                      icon={<SnapshotShape size={'1.5rem'} />}
                    />
                    <DetailRow
                      borderBottom
                      title={'BLOCKS'}
                      value={!skeleton && snapshot ? snapshot.blocks.length.toString() : ''}
                      skeleton={skeleton}
                      icon={<SnapshotShape size={'1.5rem'} />}
                    />
                    <DetailRow
                      borderBottom
                      title={'TIMESTAMP'}
                      value={!skeleton ? formatTime(snapshotInfo.data.timestamp, 'relative') : ''}
                      date={!skeleton ? snapshotInfo.data.timestamp : ''}
                      skeleton={skeleton}
                    />
                  </div>
                </div>
              </div>
              <div className={`${styles.row3}`}>
                <div className={`${styles.flexRowBottom}`}>
                  <p className="overviewText">Transactions</p>
                  <div className={styles.arrows}>
                    <ArrowButton
                      handleClick={handlePrevPage}
                      disabled={currentPage === 0 || txsSkeleton || error !== undefined}
                    />
                    <ArrowButton
                      forward
                      handleClick={handleNextPage}
                      disabled={txsSkeleton || !snapshotTransactions.data?.meta?.next || error !== undefined}
                    />
                  </div>
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
                      disabled={txsSkeleton || !snapshotTransactions.data?.meta?.next || error !== undefined}
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
