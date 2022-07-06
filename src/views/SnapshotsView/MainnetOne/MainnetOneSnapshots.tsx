import { useEffect, useState } from 'react';
import { MainnetOneSnapshot } from '../../../types';
import { Subheader } from '../../../components/Subheader/Subheader';
import { IconType } from '../../../constants';
import styles from '../Snapshots.module.scss';
import { NotFound } from '../../NotFoundView/NotFound';
import { useGetLatestSnapshots } from '../../../api/mainnet_1/block-explorer';
import { MainnetOneSnapshotTable } from '../../../components/MainnetOneTable/MainnetOneTable';
import { SnapshotShape } from '../../../components/Shapes/SnapshotShape';

const LIMIT = 14;

export const MainnetOneSnapshots = () => {
  const [snapshots, setSnapshots] = useState<MainnetOneSnapshot[] | undefined>(undefined);
  const startAt = 0;
  const endAt = LIMIT;
  const query = `?startAt="${startAt.toString()}"&endAt="${endAt.toString()}"&orderBy="$key"`;
  const snapshotsInfo = useGetLatestSnapshots(query);
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

  return (
    <>
      <Subheader text={'Snapshots'} item={IconType.Snapshot} />
      {error ? (
        <NotFound entire={false} errorCode={error} />
      ) : (
        <main className={`${styles.fullWidth3}`}>
          <div className={`${styles.row2}`}>
            <MainnetOneSnapshotTable
              skeleton={{
                showSkeleton: skeleton,
                forSnapshots: true,
              }}
              limit={LIMIT}
              snapshots={snapshots}
              icon={<SnapshotShape />}
            />
          </div>
        </main>
      )}
    </>
  );
};
