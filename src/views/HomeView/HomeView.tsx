import { useState } from 'react';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import StatsSection from './StatsSection/StatsSection';
import { Link, useNavigate } from 'react-router-dom';
import { useNetwork } from '../../context/NetworkContext';
import MainnetOneHomeTables from './MainnetOneHomeTables';
import HomeTables from './HomeTables';

import styles from './HomeView.module.scss';

import { useGetAllMetagraphProjects } from '../../api/block-explorer';
import { ReactComponent as ConstellationGrayIcon } from '../../assets/icons/constellation-gray.svg';
import clsx from 'clsx';
import { Table } from '../../components/Table';

const REFETCH_EVERY = 15000;

export const HomeView = () => {
  const navigate = useNavigate();
  const { networkVersion, network } = useNetwork();

  const [error, setError] = useState(false);

  const metagraphs = useGetAllMetagraphProjects({
    limit: 5,
    offset: 0,
  });

  const handleError = () => {
    setError(true);
  };
  const LIMIT = ['mainnet', 'mainnet1'].includes(network) ? 10 : 5;
  const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

  return (
    <>
      <section className={`${styles.fullWidth} ${styles.section}`}>
        <div className={`${styles.row} ${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <main className={`${styles.fullWidth2} background`}>
        <div className={`${styles.row} ${styles.fila1}`}>
          <StatsSection />
        </div>
        {networkVersion === '2.0' && (
          <div className={clsx(styles.row, styles.metagraphs)}>
            <Table
              header="Top Projects"
              primaryKey="id"
              titles={{
                name: { content: 'Project' },
                type: { content: 'Type' },
                snapshots90d: { content: 'Snapshots (90D)' },
                fees90d: { content: 'Fees (90D)' },
                feesTotal: { content: 'Total Fees' },
              }}
              showSkeleton={!metagraphs.isFetched ? { size: 5 } : null}
              emptyStateLabel="No metagraphs detected"
              data={metagraphs.data?.data ?? []}
              formatData={{
                name: (value, record) =>
                  record.metagraphId ? (
                    <Link to={`/metagraphs/${record.metagraphId}`} className={styles.metagraphLink}>
                      {record.icon_url ? <img src={record.icon_url} /> : <ConstellationGrayIcon />}
                      {value}
                    </Link>
                  ) : (
                    <span className={styles.metagraphLink}>
                      {record.icon_url ? <img src={record.icon_url} /> : <ConstellationGrayIcon />}
                      {value}
                    </span>
                  ),
                type: (value) => <span className={clsx(styles.metagraphType, styles[value])}>{value}</span>,
                snapshots90d: (value) => (
                  <span className={styles.metagraphNumber}>
                    {value === null ? 'Hidden' : numberFormat.format(value)}
                  </span>
                ),
                fees90d: (value) => (
                  <span className={styles.metagraphNumber}>
                    {value === null ? 'Hidden' : numberFormat.format(value / 1e8) + ' DAG'}
                  </span>
                ),
                feesTotal: (value) => (
                  <span className={styles.metagraphNumber}>
                    {value === null ? 'Hidden' : numberFormat.format(value / 1e8) + ' DAG'}
                  </span>
                ),
              }}
            />
          </div>
        )}
        <div className={`${styles.row} ${styles.fila2}`}>
          {networkVersion === '1.0' && (
            <MainnetOneHomeTables limit={LIMIT} refetchEvery={REFETCH_EVERY} handleError={handleError} />
          )}
          {networkVersion === '1.0' && !error && (
            <div className={styles.viewAllContainer}>
              <div className={styles.viewAll} onClick={() => navigate('/snapshots')}>
                View all Snapshots
              </div>
              <div className={styles.viewAll} onClick={() => navigate('/transactions')}>
                View all Transactions
              </div>
            </div>
          )}
          {networkVersion === '2.0' && <HomeTables limit={LIMIT} refetchEvery={REFETCH_EVERY} network={network} />}
        </div>
      </main>
    </>
  );
};
