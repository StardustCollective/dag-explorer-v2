import { Link, useParams } from 'react-router-dom';
import { useGetMetagraph } from '../../../../api/block-explorer/metagraphs';

import styles from './view.module.scss';
import { Tabs } from '../../../../components/Tabs/Tabs';
import { useEffect, useState } from 'react';
import { useGetAllSnapshots } from '../../../../api/block-explorer/global-snapshot';
import { useNextTokenPagination } from '../../../../utils/pagination';
import { Table } from '../../../../components/Table';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import { formatNumber, NumberFormat } from '../../../../utils/numbers';
import { SkeletonSpan } from '../../../../components/SkeletonSpan/component';
import { TablePagination } from '../../../../components/TablePagination/component';
import { useGetAllTransactions } from '../../../../api/block-explorer/transaction';
import { shorten } from '../../../../utils/shorten';
import { InfoRowsCard } from '../../../../components/InfoRowsCard/component';
import { NavPath } from '../../../../components/NavPath/component';
import { ViewLayout } from '../../../../components/ViewLayout/component';

import { ReactComponent as FlowDataIcon } from '../../../../assets/icons/FlowData.svg';
import { ReactComponent as WalletIcon } from '../../../../assets/icons/Wallet.svg';
import { NodeLayerCard } from '../../../../components/NodeLayerCard/component';
import { HorizontalBar } from '../../../../components/HorizontalBar/component';

export const MetagraphDetailsView = () => {
  const { metagraphId } = useParams();

  const [selectedTable, setSelectedTable] = useState('snapshots');

  const metagraph = useGetMetagraph(metagraphId);

  const snapshotsPagination = useNextTokenPagination(10);
  const snapshots = useGetAllSnapshots(
    { limit: snapshotsPagination.currentPageSize, next: snapshotsPagination.pageToken },
    undefined,
    metagraphId
  );

  const transactionsPagination = useNextTokenPagination(10);
  const transactions = useGetAllTransactions(
    { limit: transactionsPagination.currentPageSize, next: transactionsPagination.pageToken },
    undefined,
    metagraphId
  );

  useEffect(() => {
    snapshotsPagination.setTotalItems(null);
    if (snapshots.isFetched && snapshots.data?.meta.next) {
      snapshotsPagination.setNextPageToken(snapshots.data.meta.next);
    }
  }, [snapshots.isFetched && snapshots.data?.meta.next]);

  useEffect(() => {
    transactionsPagination.setTotalItems(null);
    if (transactions.isFetched && transactions.data?.meta.next) {
      transactionsPagination.setNextPageToken(transactions.data.meta.next);
    }
  }, [transactions.isFetched && transactions.data?.meta.next]);

  return (
    <ViewLayout className={styles.main}>
      <NavPath
        segments={[
          { name: 'Metagraphs', to: '/metagraphs' },
          { name: metagraph.data?.metagraphName, to: `/metagraphs/${metagraphId}` },
        ]}
      />
      <div className={styles.metagraphData}>
        <div className={styles.content}>
          <div className={styles.title}>
            <img src={metagraph.data?.metagraphIcon} />
            <h2>{metagraph.data?.metagraphName}</h2>
          </div>
          <p>{metagraph.data?.metagraphDescription}</p>
        </div>
        <InfoRowsCard
          className={styles.rowsCard}
          rows={[
            {
              icon: <FlowDataIcon />,
              label: 'Metagraph ID',
              content: <Link to={`/metagraphs/${metagraphId}`}>{shorten(metagraphId, 8, 8)}</Link>,
            },
            {
              icon: <WalletIcon />,
              label: 'Staking',
              content: (
                <Link to={`/address/${metagraph.data?.metagraphStakingWalletAddress}`}>
                  {shorten(metagraph.data?.metagraphStakingWalletAddress, 8, 8)}
                </Link>
              ),
            },
            {
              icon: <WalletIcon />,
              label: 'Snapshot fees',
              content: (
                <Link to={`/address/${metagraph.data?.metagraphFeesWalletAddress}`}>
                  {shorten(metagraph.data?.metagraphFeesWalletAddress, 8, 8)}
                </Link>
              ),
            },
          ]}
        />
      </div>
      <HorizontalBar />
      <div className={styles.nodeData}>
        <NodeLayerCard
          layerName="L0"
          nodesOnline={metagraph.data?.metagraphNodes?.l0.nodes}
          nodeUrl={metagraph.data?.metagraphNodes?.l0.url}
        />
        <NodeLayerCard
          layerName="cL1"
          nodesOnline={metagraph.data?.metagraphNodes?.cl1.nodes}
          nodeUrl={metagraph.data?.metagraphNodes?.l0.url}
        />
        <NodeLayerCard
          layerName="dL1"
          nodesOnline={metagraph.data?.metagraphNodes?.dl1.nodes}
          nodeUrl={metagraph.data?.metagraphNodes?.l0.url}
        />
      </div>
      <Tabs value={selectedTable} onValue={(value) => setSelectedTable(value)}>
        <Tabs.Tab id="snapshots">Snapshots</Tabs.Tab>
        <Tabs.Tab id="transactions">Transactions</Tabs.Tab>
      </Tabs>
      <div className={styles.tables}>
        {selectedTable === 'snapshots' && (
          <>
            {snapshots.isFetched ? (
              <Table
                primaryKey="ordinal"
                titles={{
                  ordinal: { content: 'Ordinal' },
                  timestamp: { content: 'Timestamp' },
                  sizeInKB: { content: 'Snapshot Size' },
                  fee: { content: 'Snapshot Fee' },
                }}
                data={snapshots.data.data}
                formatData={{
                  ordinal: (value) => <Link to={`/metagraphs/${metagraphId}/snapshots/${value}`}>{value}</Link>,
                  timestamp: (value) => <span title={value}>{dayjs(value).fromNow()}</span>,
                  sizeInKB: (value) => value + 'kb',
                  fee: (value) =>
                    formatNumber(new Decimal(value).div(Decimal.pow(10, 8)), NumberFormat.DECIMALS_TRIMMED_EXPAND) +
                    ' DAG',
                }}
              />
            ) : (
              <Table
                primaryKey="ordinal"
                titles={{
                  ordinal: { content: 'Ordinal' },
                  timestamp: { content: 'Timestamp' },
                  sizeInKB: { content: 'Snapshot Size' },
                  fee: { content: 'Snapshot Fee' },
                }}
                data={SkeletonSpan.generateTableRecords(snapshotsPagination.currentPageSize, [
                  'ordinal',
                  'timestamp',
                  'sizeInKB',
                  'fee',
                ])}
              />
            )}
            <TablePagination
              currentPage={snapshotsPagination.currentPage}
              totalPages={snapshotsPagination.totalPages}
              currentSize={snapshotsPagination.currentPageSize}
              pageSizes={[10, 15, 20]}
              onPageSizeChange={(size) => snapshotsPagination.setPageSize(size)}
              onPageChange={(page) => snapshotsPagination.goPage(page)}
            />
          </>
        )}
        {selectedTable === 'transactions' && (
          <>
            {transactions.isFetched ? (
              <Table
                primaryKey="hash"
                titles={{
                  hash: { content: 'Txn Hash' },
                  timestamp: { content: 'Timestamp' },
                  snapshotOrdinal: { content: 'Snapshot' },
                  fee: { content: 'Fee' },
                  source: { content: 'From / To' },
                  amount: { content: 'Amount' },
                }}
                data={transactions.data.data}
                formatData={{
                  hash: (value) => (
                    <Link to={`/metagraphs/${metagraphId}/transactions/${value}`}>{shorten(value)}</Link>
                  ),
                  timestamp: (value) => <span title={value}>{dayjs(value).fromNow()}</span>,
                  snapshotOrdinal: (value) => <Link to={`/metagraphs/${metagraphId}/snapshots/${value}`}>{value}</Link>,
                  fee: (value) =>
                    formatNumber(new Decimal(value).div(Decimal.pow(10, 8)), NumberFormat.DECIMALS_TRIMMED_EXPAND) +
                    ` ${metagraph.data?.metagraphSymbol}`,
                  source: (value, record) => (
                    <div className={styles.fromToTransaction}>
                      <Link to={`/address/${value}`}>From: {shorten(value)}</Link>
                      <Link to={`/address/${record.destination}`}>To: {shorten(record.destination)}</Link>
                    </div>
                  ),
                  amount: (value) =>
                    formatNumber(new Decimal(value).div(Decimal.pow(10, 8)), NumberFormat.DECIMALS) +
                    ` ${metagraph.data?.metagraphSymbol}`,
                }}
              />
            ) : (
              <Table
                primaryKey="hash"
                titles={{
                  hash: { content: 'Txn Hash' },
                  timestamp: { content: 'Timestamp' },
                  snapshotOrdinal: { content: 'Snapshot' },
                  fee: { content: 'Fee' },
                  source: { content: 'From / To' },
                  amount: { content: 'Amount' },
                }}
                data={SkeletonSpan.generateTableRecords(transactionsPagination.currentPageSize, [
                  'hash',
                  'timestamp',
                  'snapshotOrdinal',
                  'fee',
                  'source',
                  'amount',
                ])}
              />
            )}
            <TablePagination
              currentPage={transactionsPagination.currentPage}
              totalPages={transactionsPagination.totalPages}
              currentSize={transactionsPagination.currentPageSize}
              pageSizes={[10, 15, 20]}
              onPageSizeChange={(size) => transactionsPagination.setPageSize(size)}
              onPageChange={(page) => transactionsPagination.goPage(page)}
            />
          </>
        )}
      </div>
    </ViewLayout>
  );
};
