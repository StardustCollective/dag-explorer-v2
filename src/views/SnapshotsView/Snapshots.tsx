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
import { FetchedData, Params } from '../../types/requests';
import { handleFetchedData, handlePagination } from '../../utils/pagination';

const LIMIT = 14;

export const Snapshots = () => {
  const [snapshots, setSnapshots] = useState<Snapshot[] | undefined>(undefined);
  const [params, setParams] = useState<Params>({ limit: LIMIT });
  const [fetchedData, setFetchedData] = useState<FetchedData<Snapshot>[] | undefined>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const snapshotsInfo = useGetAllSnapshots(params);
  const [error, setError] = useState<string>(undefined);
  const [skeleton, setSkeleton] = useState(false);

  useEffect(() => {
    setSkeleton(true);
    if (!snapshotsInfo.isFetching && !snapshotsInfo.isError) {
      if (snapshotsInfo.data.data.length > 0) {
        setSnapshots(snapshotsInfo.data.data);
      }
      handleFetchedData(setFetchedData, snapshotsInfo, currentPage);
      setSkeleton(false);
    }
  }, [snapshotsInfo.isFetching]);

  useEffect(() => {
    if (snapshotsInfo.isError) {
      setError(snapshotsInfo.error.message);
    }
  }, [snapshotsInfo.isError]);

  const [handlePrevPage, handleNextPage] = handlePagination<Snapshot[], FetchedData<Snapshot>[]>(
    snapshots,
    setSnapshots,
    fetchedData,
    currentPage,
    setCurrentPage,
    setParams,
    LIMIT
  );

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
                <ArrowButton handleClick={handlePrevPage} disabled={skeleton || currentPage === 0} />
                <ArrowButton
                  forward
                  handleClick={handleNextPage}
                  disabled={skeleton || !snapshotsInfo.data?.meta?.next}
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
                <ArrowButton handleClick={handlePrevPage} disabled={skeleton || currentPage === 0} />
                <ArrowButton
                  forward
                  handleClick={handleNextPage}
                  disabled={skeleton || !snapshotsInfo.data?.meta?.next}
                />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};
