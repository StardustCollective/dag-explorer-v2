import { useEffect, useState } from 'react';
import { Snapshot } from '../../types';
import { ArrowButton } from '../../components/Buttons/ArrowButton';
import { Subheader } from '../../components/Subheader/Subheader';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { IconType } from '../../constants';
import styles from './Snapshots.module.scss';
import { NotFound } from '../NotFoundView/NotFound';
import { useGetAllSnapshots } from '../../api/block-explorer/global-snapshot';
import { SnapshotShape } from '../../components/Shapes/SnapshotShape';

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
  const [lastPage, setLastPage] = useState(false);
  const [isPrev, setIsPrev] = useState(false);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string>(undefined);
  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    setSkeleton(true);
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

  const handleNextPage = () => {
    if (snapshots) {
      setParams({
        limit: LIMIT,
        search_before: snapshots[LIMIT - 1].ordinal.toString(),
      });
      setIsPrev(false);
      setPage((p) => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (snapshots) {
      setParams({
        limit: LIMIT,
        search_after: snapshots[0].ordinal.toString(),
      });
      setIsPrev(true);
      setPage((p) => p - 1);
      setLastPage(false);
    }
  };

  return (
    <>
      <Subheader text={'Snapshots'} item={IconType.Snapshot} />
      {error ? (
        <NotFound entire={false} errorCode={error} />
      ) : (
        <main className={`${styles.fullWidth3}`}>
          <div className={`${styles.row1}`}>
            <div className={`${styles.flexRowBottom}`}>
              <span />
              <div className={styles.arrows}>
                <ArrowButton handleClick={() => handlePrevPage()} disabled={snapshotsInfo.isFetching || page === 0} />
                <ArrowButton
                  forward
                  handleClick={() => handleNextPage()}
                  disabled={snapshotsInfo.isFetching || lastPage}
                />
              </div>
            </div>
          </div>
          <div className={`${styles.row2}`}>
            <TransactionsTable
              skeleton={{ showSkeleton: skeleton, forSnapshots: true }}
              limit={LIMIT}
              snapshots={snapshots}
              icon={<SnapshotShape />}
            />
          </div>
          <div className={`${styles.row3}`}>
            <div className={`${styles.flexRowBottom}`}>
              <span />

              <div className={styles.arrows}>
                <ArrowButton handleClick={() => handlePrevPage()} disabled={snapshotsInfo.isFetching || page === 0} />
                <ArrowButton
                  forward
                  handleClick={() => handleNextPage()}
                  disabled={snapshotsInfo.isFetching || lastPage}
                />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};
