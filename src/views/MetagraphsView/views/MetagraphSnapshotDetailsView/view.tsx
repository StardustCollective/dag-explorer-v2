import { Link, useParams } from 'react-router-dom';
import { useGetMetagraph } from '../../../../api/block-explorer/metagraphs';

import styles from './view.module.scss';

import { useEffect } from 'react';
import { useGetSnapshot, useGetSnapshotTransactions } from '../../../../api/block-explorer/global-snapshot';
import { useNextTokenPagination } from '../../../../utils/pagination';
import { Table } from '../../../../components/Table';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import { formatNumber, NumberFormat } from '../../../../utils/numbers';
import { TablePagination } from '../../../../components/TablePagination/component';

import { shorten } from '../../../../utils/shorten';
import { InfoRowsCard } from '../../../../components/InfoRowsCard/component';

import { ViewLayout } from '../../../../components/ViewLayout/component';

import { Subheader } from '../../../../components/Subheader/Subheader';
import { CopyableContent } from '../../../../components/CopyableContent/component';

export const MetagraphSnapshotDetailsView = () => {
  const { metagraphId, snapshotOrdinal } = useParams();

  const metagraph = useGetMetagraph(metagraphId);

  const snapshot = useGetSnapshot(snapshotOrdinal, metagraphId);

  const transactionsPagination = useNextTokenPagination(10);
  const transactions = useGetSnapshotTransactions(
    snapshotOrdinal,
    { limit: transactionsPagination.currentPageSize, next: transactionsPagination.pageToken },
    metagraphId
  );

  useEffect(() => {
    transactionsPagination.setTotalItems(null);
    if (transactions.isFetched && transactions.data?.meta?.next) {
      transactionsPagination.setNextPageToken(transactions.data.meta?.next);
    }
  }, [transactions.isFetched && transactions.data?.meta?.next]);

  return (
    <ViewLayout className={styles.main}>
      <Subheader text="Metagraph Snapshot Details" />
      <h3>Overview</h3>
      <div className={styles.snapshotData}>
        <InfoRowsCard
          className={styles.rowsCard}
          variants={['border-record']}
          rows={[
            {
              icon: null,
              label: 'Metagraph Name',
              content: (
                <div className={styles.metagraphName}>
                  <img src={metagraph.data?.metagraphIcon} />
                  <span>{metagraph.data?.metagraphName}</span>
                </div>
              ),
            },
            {
              icon: null,
              label: 'Metagraph ID',
              content: (
                <Link className={styles.detailLink} to={`/metagraphs/${metagraphId}`}>
                  {shorten(metagraphId, 8, 8)}
                </Link>
              ),
            },
            {
              icon: null,
              label: 'Ordinal',
              content: (
                <Link className={styles.detailLink} to={`/metagraphs/${metagraphId}/snapshots/${snapshotOrdinal}`}>
                  {snapshotOrdinal}
                </Link>
              ),
            },
            {
              icon: null,
              label: 'Timestamp',
              content: (
                <div className={styles.snapshotTimestamp}>
                  <span className={styles.relative}>{dayjs(snapshot.data?.timestamp).fromNow()}</span>
                  <span className={styles.absolute}>{dayjs(snapshot.data?.timestamp).toISOString()}</span>
                </div>
              ),
            },
          ]}
        />
        <InfoRowsCard
          className={styles.rowsCard}
          variants={['border-record']}
          rows={[
            {
              icon: null,
              label: 'Snapshot Hash',
              content: (
                <span className={styles.detailLink}>
                  {shorten(snapshot.data?.hash)}
                  <CopyableContent content={snapshot.data?.hash} />
                </span>
              ),
            },
            {
              icon: null,
              label: 'Last Snapshot Hash',
              content: (
                <Link
                  className={styles.detailLink}
                  to={`/metagraphs/${metagraphId}/snapshots/${parseInt(snapshotOrdinal) - 1}`}
                >
                  {shorten(snapshot.data?.lastSnapshotHash)}
                  <CopyableContent content={snapshot.data?.lastSnapshotHash} />
                </Link>
              ),
            },
            {
              icon: null,
              label: 'Snapshot Fee',
              content:
                formatNumber(
                  new Decimal(snapshot.data?.fee ?? 0).div(Decimal.pow(10, 8)),
                  NumberFormat.DECIMALS_TRIMMED_EXPAND
                ) + ' DAG',
            },
            {
              icon: null,
              label: 'Snapshot Size',
              content: (snapshot.data?.sizeInKB ?? '-- ') + 'kb',
            },
          ]}
        />
      </div>
      <h3>Transactions</h3>
      <div className={styles.tables}>
        <Table
          primaryKey="hash"
          titles={{
            hash: { content: 'Txn Hash' },
            timestamp: { content: 'Timestamp' },
            snapshotOrdinal: { content: 'Snapshot' },
            fee: { content: 'Fee' },
            source: { content: 'From' },
            destination: { content: 'To' },
            amount: { content: 'Amount' },
          }}
          showSkeleton={!transactions.isFetched ? { size: transactionsPagination.currentPageSize } : null}
          emptyStateLabel="No transactions detected"
          data={transactions.data?.data ?? []}
          formatData={{
            hash: (value) => <Link to={`/metagraphs/${metagraphId}/transactions/${value}`}>{shorten(value)}</Link>,
            timestamp: (value) => <span title={value}>{dayjs(value).fromNow()}</span>,
            snapshotOrdinal: (value) => <Link to={`/metagraphs/${metagraphId}/snapshots/${value}`}>{value}</Link>,
            fee: (value) =>
              formatNumber(new Decimal(value ?? 0), NumberFormat.WHOLE) + ` d${metagraph.data?.metagraphSymbol}`,
            source: (value) => (
              <Link to={`/address/${value}`}>
                {shorten(value)} <CopyableContent content={value} />
              </Link>
            ),
            destination: (value) => (
              <Link to={`/address/${value}`}>
                {shorten(value)} <CopyableContent content={value} />
              </Link>
            ),
            amount: (value) =>
              formatNumber(new Decimal(value ?? 0).div(Decimal.pow(10, 8)), NumberFormat.DECIMALS_TRIMMED_EXPAND) +
              ` ${metagraph.data?.metagraphSymbol}`,
          }}
        />
        <TablePagination
          currentPage={transactionsPagination.currentPage}
          totalPages={transactionsPagination.totalPages}
          currentSize={transactionsPagination.currentPageSize}
          pageSizes={[10, 15, 20]}
          onPageSizeChange={(size) => transactionsPagination.setPageSize(size)}
          onPageChange={(page) => transactionsPagination.goPage(page)}
          useNextPageToken
          nextPageToken={transactionsPagination.nextPageToken}
        />
      </div>
    </ViewLayout>
  );
};
