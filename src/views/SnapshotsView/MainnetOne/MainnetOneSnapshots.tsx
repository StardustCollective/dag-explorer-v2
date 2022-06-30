import { useEffect, useState } from 'react';
import { MainnetOneSnapshot } from '../../../types';
import { ArrowButton } from '../../../components/Buttons/ArrowButton';
import { Subheader } from '../../../components/Subheader/Subheader';
import { IconType } from '../../../constants';
import styles from '../Snapshots.module.scss';
import SnapshotShape from '../../../assets/icons/SnapshotShape.svg';
import { NotFound } from '../../NotFoundView/NotFound';
import { useGetLatestSnapshots } from '../../../api/mainnet_1/block-explorer';
import { MainnetOneSnapshotTable } from '../../../components/MainnetOneTable/MainnetOneTable';

const LIMIT = 14;

export const MainnetOneSnapshots = () => {
  const [snapshots, setSnapshots] = useState<MainnetOneSnapshot[] | undefined>(undefined);
  const [startAt, setStartAt] = useState(0);
  const [endAt, setEndAt] = useState(LIMIT);
  const query = `?startAt="${startAt.toString()}"&endAt="${endAt.toString()}"&orderBy="$key"`;
  const snapshotsInfo = useGetLatestSnapshots(query);
  const [isPrev, setIsPrev] = useState(false);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string>(undefined);
  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    if (!snapshotsInfo.isFetching && !snapshotsInfo.isError) {
      if (snapshotsInfo.data) {
        const arrSnaps: MainnetOneSnapshot[] = [];
        Object.values(snapshotsInfo.data).map((e) => arrSnaps.push(e));
        setSnapshots(arrSnaps);
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
      setStartAt((s) => s + LIMIT);
      setEndAt((e) => e + LIMIT);
      setIsPrev(false);
      setPage((p) => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (snapshots) {
      setStartAt((s) => s - LIMIT);
      setEndAt((e) => e - LIMIT);
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
            <MainnetOneSnapshotTable
              skeleton={{
                showSkeleton: skeleton,
                forSnapshots: true,
              }}
              limit={LIMIT}
              snapshots={snapshots}
              icon={SnapshotShape}
            />
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
