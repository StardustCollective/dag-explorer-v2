import { useGetAllMetagraphProjects } from '../../api/block-explorer/metagraphs';
import { Subheader } from '../../components/Subheader/Subheader';

import styles from './view.module.scss';
import { TablePagination } from '../../components/TablePagination/component';
import { Table } from '../../components/Table';

import { Link, Navigate } from 'react-router-dom';
import { usePagination } from '../../utils/pagination';
import { useContext, useEffect } from 'react';
import { ViewLayout } from '../../components/ViewLayout/component';
import { NetworkContext } from '../../context/NetworkContext';
import { ReactComponent as ConstellationGrayIcon } from '../../assets/icons/constellation-gray.svg';
import clsx from 'clsx';

export const MetagraphsView = () => {
  const { network } = useContext(NetworkContext);

  const metagraphsPagination = usePagination(10);
  const metagraphs = useGetAllMetagraphProjects({
    limit: metagraphsPagination.limit,
    offset: metagraphsPagination.offset,
  });

  useEffect(() => {
    metagraphs.isFetched && metagraphsPagination.setTotalItems(metagraphs.data.meta?.total);
  }, [metagraphs.isFetched && metagraphs.data.meta?.total]);

  if (network === 'mainnet1') {
    return <Navigate to="/" />;
  }

  const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

  return (
    <ViewLayout className={styles.main}>
      <Subheader text="Metagraphs" />
      <div className={styles.metagraphs}>
        <Table
          primaryKey="id"
          titles={{
            name: { content: 'Project' },
            type: { content: 'Type' },
            snapshots90d: { content: 'Snapshots (90D)' },
            fees90d: { content: 'Fees (90D)' },
            feesTotal: { content: 'Total Fees' },
          }}
          showSkeleton={!metagraphs.isFetched ? { size: metagraphsPagination.currentPageSize } : null}
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
              <span className={styles.metagraphNumber}>{value === null ? 'Hidden' : numberFormat.format(value)}</span>
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

        <TablePagination
          currentPage={metagraphsPagination.currentPage}
          totalPages={metagraphsPagination.totalPages}
          currentSize={metagraphsPagination.currentPageSize}
          pageSizes={[10, 15, 20]}
          onPageSizeChange={(size) => metagraphsPagination.setPageSize(size)}
          onPageChange={(page) => metagraphsPagination.goPage(page)}
        />
      </div>
    </ViewLayout>
  );
};
