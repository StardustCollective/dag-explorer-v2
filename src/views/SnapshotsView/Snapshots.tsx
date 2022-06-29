import { useEffect, useState } from 'react';
import { Snapshot } from '../../types';
import { ArrowButton } from '../../components/Buttons/ArrowButton';
import { Subheader } from '../../components/Subheader/Subheader';
import { SkeletonTransactionsTable } from '../../components/TransactionsTable/SkeletonTransactionsTable';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { IconType } from '../../constants';
import styles from './Snapshots.module.scss';
import SnapshotShape from '../../assets/icons/SnapshotShape.svg';
import { NotFound } from '../NotFoundView/NotFound';
import { useGetAllSnapshots } from '../../api/block-explorer/global-snapshot';

const LIMIT = 14;

type Params = {
  limit: number;
  search_after?: string;
  search_before?: string;
};

export const Snapshots = () => {
  const [snapshots, setSnapshots] = useState<Snapshot[] | undefined>(undefined);
  const [params, setParams] = useState<Params>({ limit: LIMIT });
  const snapshotsInfo = useGetAllSnapshots(params);
  const [isPrev, setIsPrev] = useState(false);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string>(undefined);
  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    if (!snapshotsInfo.isFetching && !snapshotsInfo.isError) {
      if (snapshotsInfo.data.length > 0) {
        setSnapshots(snapshotsInfo.data);
      }

      setSkeleton(false);
    }
  }, [snapshotsInfo.isFetching]);

  useEffect(() => {
    if (snapshotsInfo.isError) {
      setError(snapshotsInfo.error.message);
    }
  }, [snapshotsInfo.isError]);

  useEffect(() => {
    if (!snapshotsInfo.isFetching) {
      if (isPrev) {
        setSnapshots(snapshotsInfo.data.reverse());
      }
    }
  }, [snapshotsInfo.isFetching]);

  const handleNextPage = () => {
    if (snapshots) {
      setParams({
        limit: LIMIT,
        search_before: snapshots[LIMIT - 1].hash,
      });
      setIsPrev(false);
      setPage((p) => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (snapshots) {
      setParams({
        limit: LIMIT,
        search_after: snapshots[0].hash,
      });
      setIsPrev(true);
      setPage((p) => p - 1);
    }
  };

  return (
    <>
      <Subheader text={'Snapshots'} item={IconType.Snapshot} />
      {error === '404' ? (
        <NotFound entire={false} />
      ) : (
        <main className={`${styles.fullWidth3}`}>
          <div className={`${styles.row1}`}>
            <div className={`${styles.flexRowBottom}`}>
              <span />
              <div className={styles.arrows}>
                <ArrowButton handleClick={handlePrevPage} disabled />
                <ArrowButton forward handleClick={handleNextPage} disabled />
              </div>
            </div>
          </div>
          <div className={`${styles.row2}`}>
            {skeleton ? (
              <SkeletonTransactionsTable rows={LIMIT} />
            ) : (
              <TransactionsTable snapshots={snapshots} icon={SnapshotShape} />
            )}
          </div>
          <div className={`${styles.row3}`}>
            <div className={`${styles.flexRowBottom}`}>
              <span />

              <div className={styles.arrows}>
                {/*handlePagination*/}
                <ArrowButton handleClick={() => handlePrevPage()} disabled={page < 0 || !isPrev} />
                <ArrowButton forward handleClick={() => handleNextPage()} disabled={page < 0 || !isPrev} />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};
