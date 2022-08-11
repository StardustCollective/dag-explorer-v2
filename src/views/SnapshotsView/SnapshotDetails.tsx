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

const LIMIT = 8;
type Params = {
  limit: number;
  search_after?: string;
  search_before?: string;
};

export const SnapshotDetails = () => {
  const { snapshotHeight } = useParams();
  const [snapshotTxs, setSnapshotTxs] = useState<Transaction[] | undefined>(undefined);
  const [snapshot, setSnapshot] = useState<Snapshot | undefined>(undefined);
  const [params, setParams] = useState<Params>({ limit: LIMIT });
  const snapshotTransactions = useGetSnapshotTransactions(snapshotHeight, params);
  //const snapshotRewards = useGetSnapshotRewards(snapshotHeight);
  const snapshotInfo = useGetSnapshot(snapshotHeight);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [error, setError] = useState<string>(undefined);

  useEffect(() => {
    if (!snapshotTransactions.isFetching && !snapshotTransactions.isError) {
      if (snapshotTransactions.data && snapshotTransactions.data.length) {
        setSnapshotTxs(snapshotTransactions.data);
      } else {
        setPage((p) => p - 1);
      }
      if (!snapshotTransactions.data.length || snapshotTransactions.data.length < LIMIT) {
        setLastPage(true);
      } else {
        setLastPage(false);
      }
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

  const handleNextPage = () => {
    if (snapshotTxs) {
      setParams({
        limit: LIMIT,
        search_before: snapshotTxs[LIMIT - 1].hash,
      });
      setPage((p) => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (snapshotTxs) {
      setParams({
        limit: LIMIT,
        search_after: snapshotTxs[0].hash,
      });
      setPage((p) => p - 1);
      setLastPage(false);
    }
  };

  const skeleton = snapshotInfo.isLoading || !snapshotInfo.data;
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
                  {!snapshotTransactions.isFetching && snapshotTxs && (
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
                  )}
                </div>
              </div>
              <div className={`${styles.row4}`}>
                {!error && (
                  <TransactionsTable
                    skeleton={{ showSkeleton: skeleton }}
                    limit={LIMIT}
                    transactions={snapshotTxs}
                    icon={<SnapshotShape />}
                  />
                )}
              </div>
              <div className={`${styles.row5}`}>
                {!snapshotTransactions.isFetching && snapshotTxs && snapshotTxs.length > 0 && (
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
                )}
              </div>
            </>
          )}
        </main>
      )}
    </>
  );
};
