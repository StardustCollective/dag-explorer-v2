import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetBlock } from '../../api/block-explorer';
import { Block } from '../../api/types';
import { DetailRow } from '../../components/DetailRow/DetailRow';
import { Subheader } from '../../components/Subheader/Subheader';
import { IconType } from '../../constants';
import styles from './BlockDetails.module.scss';
import { BlockDetailsTableWrapper } from './BlockDetailsTableWrapper';

export const BlockDetails = () => {
  const { blockHash } = useParams();
  const [blockData, setBlockData] = useState<Block | undefined>(undefined);
  const blockInfo = useGetBlock(blockHash);
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (!blockInfo.isLoading && !blockInfo.isFetching) {
      if (blockInfo.data) {
        setBlockData(blockInfo.data);
        const timestamp = new Date(blockInfo.data.timestamp);
        setDate(timestamp);
      }
    }
  }, [blockInfo.isLoading, blockInfo.isFetching]);

  const skeleton = blockInfo.isLoading || !blockData;
  return (
    <>
      <Subheader text={'Block details'} item={IconType.Block} />

      <main className={`${styles.fullWidth3}`}>
        <div className={`${styles.row1}`}>
          <div className={`${styles.flexRowBottom}`}>
            <p className="overviewText">Overview</p>
          </div>
        </div>
        <div className={`${styles.row2}`}>
          <div className={styles.spanContent}>
            <div className={`${styles.txGroup}`}>
              <DetailRow borderBottom title={'BLOCK HASH'} value={!skeleton ? blockHash : ''} skeleton={skeleton} />
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
                value={!skeleton ? date.toLocaleString() : ''}
                skeleton={skeleton}
              />
            </div>
          </div>
        </div>
        <div className={`${styles.row3}`}>
          <div className={`${styles.flexRowBottom}`}>
            <p className="overviewText">Transactions</p>
            <div className={styles.arrows}>
              <p className="overviewText"></p>
              <p className="overviewText"></p>
            </div>
          </div>
        </div>
        <div className={`${styles.row4}`}>
          {blockInfo.isFetching || !blockData ? (
            'loading'
          ) : (
            <BlockDetailsTableWrapper snapshotOrdinal={blockData.snapshotOrdinal} blockHash={blockData.hash} />
          )}
        </div>
        <div className={`${styles.row5}`}>
          <div className={`${styles.flexRowTop}`}>
            <span />
          </div>
        </div>
      </main>
    </>
  );
};
