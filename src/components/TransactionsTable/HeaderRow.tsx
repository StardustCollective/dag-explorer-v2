import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import styles from './HeaderRow.module.scss';
import clsx from 'clsx';

export const HeaderRow = ({
  forSnapshots,
  headerCols,
  showMetagraphSymbol,
}: {
  forSnapshots?: boolean;
  headerCols?: string[];
  showMetagraphSymbol?: boolean;
}) => {
  const location = useLocation();
  const { network } = useContext(NetworkContext) as NetworkContextType;

  const isHomePage = location.pathname === '/';

  if (headerCols) {
    return (
      <>
        {headerCols.map((text, index) => (
          <div className={styles.headerColumn} key={index}>
            <p className={styles.headerText}>{text}</p>
          </div>
        ))}
      </>
    );
  }
  const columns = isHomePage ? (
    network === 'mainnet1' ? (
      <>
        <div className={styles.headerColumn}>
          <p className={styles.headerText}>{forSnapshots ? 'HEIGHT' : 'TXN HASH'}</p>
        </div>
        <div className={styles.headerColumn}>
          <p className={styles.headerText}>{forSnapshots ? 'TX COUNT' : 'TIMESTAMP'}</p>
        </div>
        <div className={`${styles.headerColumn} ${styles.rightAligned}`}>
          <p className={styles.headerText}>{'AMOUNT'}</p>
        </div>
      </>
    ) : (
      <>
        {forSnapshots && !showMetagraphSymbol && (
          <>
            <div className={styles.headerColumn}>
              <p className={styles.headerText}>ORDINAL</p>
            </div>
            <div className={styles.headerColumn}>
              <p className={styles.headerText}>TIMESTAMP</p>
            </div>
            <div className={styles.headerColumn}>
              <p className={styles.headerText}>BLOCKS</p>
            </div>
          </>
        )}
        {forSnapshots && showMetagraphSymbol && (
          <>
            <div className={styles.headerColumn}>
              <p className={styles.headerText}>METAGRAPH</p>
            </div>
            <div className={styles.headerColumn}>
              <p className={styles.headerText}>ORDINAL</p>
            </div>
            <div className={styles.headerColumn}>
              <p className={styles.headerText}>TIMESTAMP</p>
            </div>
            <div className={styles.headerColumn}>
              <p className={styles.headerText}>SNAPSHOT FEE</p>
            </div>
          </>
        )}
        {!forSnapshots && showMetagraphSymbol && (
          <>
            <div className={styles.headerColumn}>
              <p className={styles.headerText}>TXN HASH</p>
            </div>
            <div className={styles.headerColumn}>
              <p className={styles.headerText}>TIMESTAMP</p>
            </div>
            <div className={styles.headerColumn}>
              <p className={styles.headerText}>AMOUNT</p>
            </div>
          </>
        )}
        {!forSnapshots && !showMetagraphSymbol && (
          <>
            <div className={styles.headerColumn}>
              <p className={styles.headerText}>TXN HASH</p>
            </div>
            <div className={styles.headerColumn}>
              <p className={styles.headerText}>TIMESTAMP</p>
            </div>
            <div className={styles.headerColumn}>
              <p className={styles.headerText}>AMOUNT</p>
            </div>
          </>
        )}
      </>
    )
  ) : network === 'mainnet1' && forSnapshots ? (
    <>
      <div className={`${styles.headerColumn} ${styles.topLeftBorder}`}>
        <p className={styles.headerText}>HEIGHT</p>
      </div>

      <div className={styles.headerColumn}>
        <p className={styles.headerText}>TRANSACTION COUNT</p>
      </div>

      <div className={clsx(styles.headerColumn, styles.rightAligned)}>
        <p className={styles.headerText}>FEE</p>
      </div>
      <div className={clsx(styles.headerColumn, styles.topRightBorder, styles.rightAligned)}>
        <p className={styles.headerText}>AMOUNT</p>
      </div>
    </>
  ) : network === 'mainnet1' && !forSnapshots ? (
    <>
      <div className={`${styles.headerColumn} ${styles.topLeftBorder}`}>
        <p className={styles.headerText}>TXN HASH</p>
      </div>

      <div className={clsx(styles.headerColumn, styles.timestamp)}>
        <p className={styles.headerText}>TIMESTAMP</p>
      </div>

      <div className={`${styles.headerColumn}`}>
        <p className={styles.headerText}>SNAPSHOT</p>
      </div>

      <div className={`${styles.headerColumn} ${styles.stackFromTo}`}>
        <p className={styles.headerText}>FEE</p>
      </div>

      <div className={`${styles.headerColumn} ${styles.stackFromTo}`}>
        <p className={styles.headerText}>FROM / TO</p>
      </div>

      <div className={clsx(styles.headerColumn, styles.topRightBorder, styles.rightAligned)}>
        <p className={styles.headerText}>AMOUNT</p>
      </div>
    </>
  ) : (
    <>
      <div className={`${styles.headerColumn} ${styles.topLeftBorder}`}>
        <p className={styles.headerText}>{forSnapshots ? 'HASH' : 'TXN HASH'}</p>
      </div>

      <div className={clsx(styles.headerColumn, !forSnapshots ? styles.timestamp : undefined)}>
        <p className={styles.headerText}>TIMESTAMP</p>
      </div>

      {!forSnapshots && (
        <div className={`${styles.headerColumn}`}>
          <p className={styles.headerText}>SNAPSHOT</p>
        </div>
      )}

      {forSnapshots && (
        <div className={`${styles.headerColumn}`}>
          <p className={styles.headerText}>ORDINAL</p>
        </div>
      )}

      {!forSnapshots && (
        <div className={`${styles.headerColumn} ${styles.enoughSpace}`}>
          <p className={styles.headerText}>FEE</p>
        </div>
      )}

      {forSnapshots && (
        <div className={`${styles.headerColumn}`}>
          <p className={styles.headerText}>{'BLOCK COUNT'}</p>
        </div>
      )}

      {!forSnapshots && (
        <div className={`${styles.headerColumn} ${styles.stackFromTo}`}>
          <p className={styles.headerText}>FROM</p>
        </div>
      )}

      {!forSnapshots && (
        <div className={`${styles.headerColumn} ${styles.direction}`}>
          <p className={styles.headerText}></p>
        </div>
      )}

      {!forSnapshots && (
        <div className={`${styles.headerColumn} ${styles.stackFromTo}`}>
          <p className={styles.headerText}>TO</p>
        </div>
      )}

      {!forSnapshots && (
        <div className={clsx(styles.headerColumn, styles.topRightBorder, styles.rightAligned)}>
          <p className={styles.headerText}>AMOUNT</p>
        </div>
      )}
    </>
  );

  return columns;
};
