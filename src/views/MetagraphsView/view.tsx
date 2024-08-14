import { useGetAllMetagraphs } from '../../api/block-explorer/metagraphs';
import { Subheader } from '../../components/Subheader/Subheader';

import styles from './view.module.scss';
import { TablePagination } from '../../components/TablePagination/component';
import { Table } from '../../components/Table';
import { shorten } from '../../utils/shorten';
import { Link, Navigate } from 'react-router-dom';
import { usePagination } from '../../utils/pagination';
import { useContext, useEffect } from 'react';
import { ViewLayout } from '../../components/ViewLayout/component';
import { NetworkContext } from '../../context/NetworkContext';

export const MetagraphsView = () => {
  const { network } = useContext(NetworkContext);

  const metagraphsPagination = usePagination(10);
  const metagraphs = useGetAllMetagraphs({ limit: metagraphsPagination.limit, offset: metagraphsPagination.offset });

  useEffect(() => {
    metagraphs.isFetched && metagraphsPagination.setTotalItems(metagraphs.data.meta.total);
  }, [metagraphs.isFetched && metagraphs.data.meta.total]);

  if (network === 'mainnet1') {
    return <Navigate to="/" />;
  }

  return (
    <ViewLayout className={styles.main}>
      <Subheader text="Metagraphs" />
      <div className={styles.metagraphs}>
        <Table
          primaryKey="metagraphId"
          titles={{
            metagraphName: { content: 'Metagraph' },
            metagraphSymbol: { content: 'Symbol' },
            metagraphId: { content: 'Metagraph Id' },
            metagraphSiteUrl: { content: 'Website' },
          }}
          showSkeleton={!metagraphs.isFetched ? { size: metagraphsPagination.currentPageSize } : null}
          emptyStateLabel="No metagraphs detected"
          data={metagraphs.data?.data ?? []}
          formatData={{
            metagraphName: (value, record) => (
              <Link to={`/metagraphs/${record.metagraphId}`} className={styles.metagraphLink}>
                <img src={record.metagraphIcon} />
                {value}
              </Link>
            ),
            metagraphId: (value) => <Link to={`/metagraphs/${value}`}>{shorten(value)}</Link>,
            metagraphSiteUrl: (value) => (
              <a className={styles.metagraphSiteLink} target="_blank" href={value} rel="noreferrer">
                {value}
              </a>
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
