import { useGetAllMetagraphs } from '../../api/block-explorer/metagraphs';
import { Subheader } from '../../components/Subheader/Subheader';

import styles from './view.module.scss';
import { TablePagination } from '../../components/TablePagination/component';
import { Table } from '../../components/Table';
import { shorten } from '../../utils/shorten';
import { Link } from 'react-router-dom';
import { SkeletonSpan } from '../../components/SkeletonSpan/component';
import { usePagination } from '../../utils/pagination';
import { useEffect } from 'react';
import { ViewLayout } from '../../components/ViewLayout/component';

export const MetagraphsView = () => {
  const metagraphsPagination = usePagination(10);
  const metagraphs = useGetAllMetagraphs({ limit: metagraphsPagination.limit, offset: metagraphsPagination.offset });

  useEffect(() => {
    metagraphs.isFetched && metagraphsPagination.setTotalItems(metagraphs.data.meta.total);
  }, [metagraphs.isFetched && metagraphs.data.meta.total]);

  return (
    <ViewLayout className={styles.main}>
      <Subheader text="Metagraphs" />
      <div className={styles.metagraphs}>
        {metagraphs.isFetched ? (
          <Table
            primaryKey="metagraphId"
            titles={{
              metagraphName: { content: 'Metagraph' },
              metagraphSymbol: { content: 'Symbol' },
              metagraphId: { content: 'Metagraph Id' },
              metagraphSiteUrl: { content: 'Website' },
            }}
            data={metagraphs.data.data}
            formatData={{
              metagraphName: (value, record) => (
                <Link to={`/metagraphs/${record.metagraphId}`} className={styles.metagraphLink}>
                  <img src={record.metagraphIcon} />
                  {value}
                </Link>
              ),
              metagraphId: (value) => <Link to={`/metagraphs/${value}`}>{shorten(value)}</Link>,
              metagraphSiteUrl: (value) => (
                <a target="_blank" href={value} rel="noreferrer">
                  {value}
                </a>
              ),
            }}
          />
        ) : (
          <Table
            primaryKey="metagraphId"
            titles={{
              metagraphName: { content: 'Metagraph' },
              metagraphSymbol: { content: 'Symbol' },
              metagraphId: { content: 'Metagraph Id' },
              metagraphSiteUrl: { content: 'Website' },
            }}
            data={SkeletonSpan.generateTableRecords(metagraphsPagination.currentPageSize, [
              'metagraphName',
              'metagraphSymbol',
              'metagraphId',
              'metagraphSiteUrl',
            ])}
          />
        )}
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
