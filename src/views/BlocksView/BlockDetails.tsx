import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetBlock } from '../../api/block-explorer';
import { Block } from '../../types';
import { ArrowButton } from '../../components/Buttons/ArrowButton';
import { DetailRow } from '../../components/DetailRow/DetailRow';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { Subheader } from '../../components/Subheader/Subheader';
import { IconType } from '../../constants';
import { NotFound } from '../NotFoundView/NotFound';
import styles from './BlockDetails.module.scss';
import { BlockDetailsTableWrapper } from './BlockDetailsTableWrapper';
import { formatTime } from '../../utils/numbers';

const LIMIT = 10;
export const BlockDetails = () => {
  const { blockHash } = useParams();
  const [blockData, setBlockData] = useState<Block | undefined>(undefined);
  const blockInfo = useGetBlock(blockHash);
  const [page, setPage] = useState<number>(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [hasTx, setHasTx] = useState(false);
  const [error, setError] = useState<string>(undefined);

  useEffect(() => {
    if (!blockInfo.isLoading && !blockInfo.isFetching) {
      if (blockInfo.data) {
        setBlockData(blockInfo.data);
      }
    }
  }, [blockInfo.isLoading, blockInfo.isFetching]);

  useEffect(() => {
    if (blockInfo.status === 'error') {
      setError(blockInfo.error && blockInfo.error.message);
    }
  }, [blockInfo.status]);

  const handleLastPage = () => {
    setIsLastPage(true);
  };

  const handleHasTx = () => {
    setHasTx(true);
  };

  const handlePrevPage = () => {
    setPage((p) => p - 1);
    setIsLastPage(false);
  };

  const handleNextPage = () => {
    setPage((p) => p + 1);
  };

  const skeleton = blockInfo.isLoading || !blockData;
  return (
    <>
      <section className={`${styles.searchMobile}`}>
        <div className={`${styles.row} ${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <Subheader text={'Block details'} item={IconType.Block} />
      {error === '404' || error === '500' ? (
        <NotFound entire={false} />
      ) : (
        <main className={`${styles.fullWidth3}`}>
          <div className={`${styles.row1}`}>
            <div className={`${styles.flexRowBottom}`}>
              <p className="overviewText">Overview</p>
            </div>
          </div>
          <div className={`${styles.row2}`}>
            <div className={styles.spanContent}>
              <div className={`${styles.txGroup}`}>
                <DetailRow
                  borderBottom
                  copy
                  title={'BLOCK HASH'}
                  value={!skeleton ? blockHash : ''}
                  skeleton={skeleton}
                  isLong
                  isMain
                />
                <DetailRow
                  linkTo={'/snapshots'}
                  borderBottom
                  title={'SNAPSHOT HEIGHT'}
                  value={!skeleton ? blockData.snapshotOrdinal.toString() : ''}
                  skeleton={skeleton}
                />
                <DetailRow
                  borderBottom
                  title={'TIMESTAMP'}
                  value={!skeleton ? formatTime(blockInfo.data.timestamp, 'relative') : ''}
                  skeleton={skeleton}
                  date={!skeleton ? formatTime(blockInfo.data.timestamp, 'full') : ''}
                  isLong
                />
              </div>
            </div>
          </div>
          <div className={`${styles.row3}`}>
            <div className={`${styles.flexRowBottom}`}>
              <p className="overviewText">Transactions</p>
              {hasTx && (
                <div className={styles.arrows}>
                  <ArrowButton handleClick={handlePrevPage} disabled={page === 1 || blockInfo.isFetching} />
                  <ArrowButton forward handleClick={handleNextPage} disabled={blockInfo.isFetching || isLastPage} />
                </div>
              )}
            </div>
          </div>
          <div className={`${styles.row4}`}>
            {!blockInfo.isFetching && blockData && (
              <BlockDetailsTableWrapper
                page={page}
                limit={LIMIT}
                snapshotOrdinal={blockData.snapshotOrdinal}
                blockHash={blockData.hash}
                setLastPage={handleLastPage}
                setHasTx={handleHasTx}
              />
            )}
          </div>
          <div className={`${styles.row5}`}>
            {hasTx && (
              <div className={`${styles.flexRowTop}`}>
                <span />
                <div className={styles.arrows}>
                  <ArrowButton handleClick={() => handlePrevPage()} disabled={page === 1 || blockInfo.isFetching} />
                  <ArrowButton
                    forward
                    handleClick={() => handleNextPage()}
                    disabled={blockInfo.isFetching || isLastPage}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </>
  );
};
