import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetAddressBalance, useGetAddressTransactions } from '../../api/block-explorer';
import { AddressMetagraphResponse, Transaction } from '../../types';
import { DetailRow } from '../../components/DetailRow/DetailRow';
import { Subheader } from '../../components/Subheader/Subheader';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { IconType, HgtpNetwork } from '../../constants';
import { NotFound } from '../NotFoundView/NotFound';
import {
  formatAmount,
  formatNumber,
  formatPrice,
  formatPriceWithSymbol,
  formatTime,
  NumberFormat,
} from '../../utils/numbers';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { PricesContext, PricesContextType } from '../../context/PricesContext';
import { ExportModal } from '../../components/Modals/ExportModal';
import { AddressShape } from '../../components/Shapes/AddressShape';
import { MetagraphTokensSection } from '../../components/MetagraphTokensSection/MetagraphTokensSection';
import { TokensTable } from '../../components/TokensTable/TokensTable';

import { isValidAddress } from '../../utils/search';
import {
  useGetAddressMetagraphRewards,
  useGetAddressRewards,
  useGetAddressTotalRewards,
} from '../../api/block-explorer/address';
import { useGetAddressMetagraphs, useGetAddressMetagraphSnapshots } from '../../api/block-explorer/metagraph-address';
import { SPECIAL_ADDRESSES_LIST } from '../../constants/specialAddresses';
import { useNextTokenPagination, usePagination } from '../../utils/pagination';

import styles from './AddressDetails.module.scss';
import { Tabs } from '../../components/Tabs/Tabs';
import { isAxiosError } from 'axios';

import { Table } from '../../components/Table';
import { shorten } from '../../utils/shorten';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import { TablePagination } from '../../components/TablePagination/component';

export const AddressDetails = ({ network }: { network: Exclude<HgtpNetwork, 'mainnet1'> }) => {
  const { addressId } = useParams();
  const { dagInfo } = useContext(PricesContext) as PricesContextType;
  const [addressTxs, setAddressTxs] = useState<Transaction[] | undefined>(undefined);

  const [allTimeRewards, setAllTimeRewards] = useState<number | undefined>(undefined);
  const addressBalance = useGetAddressBalance(addressId);
  const totalRewards = useGetAddressTotalRewards(addressId, network);
  const [error, setError] = useState<string>(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedTable, setSelectedTable] = useState<'transactions' | 'tokens' | 'rewards' | 'snapshots'>(
    'transactions'
  );

  const addressMetagraphsPagination = usePagination(10);
  const addressMetagraphs = useGetAddressMetagraphs(addressId);

  const [metagraphTokensDropdown, setMetagraphTokensDropdown] = useState<AddressMetagraphResponse[]>([]);
  const [metagraphTokensTable, setMetagraphTokensTable] = useState<AddressMetagraphResponse[]>([]);
  const [allMetagraphTokens, setAllMetagraphTokens] = useState<AddressMetagraphResponse[]>([]);

  const [limitAddressMetagraphs] = useState<number>(10);
  const [offsetAddressMetagraphs] = useState<number>(0);

  const [selectedMetagraph, setSelectedMetagraph] = useState<AddressMetagraphResponse | null>(null);
  const [tokenChanged, setTokenChanged] = useState<boolean>(false);

  const isInMetagraphPage = selectedMetagraph && selectedMetagraph.metagraphId !== 'ALL_METAGRAPHS';

  const addressTransactionsPagination = useNextTokenPagination(10);
  const addressTransactions = useGetAddressTransactions(
    addressId,
    isInMetagraphPage && selectedMetagraph?.metagraphId,
    {
      limit: addressTransactionsPagination.currentPageSize,
      next: addressTransactionsPagination.pageToken,
    }
  );

  const addressSnapshotsPagination = usePagination(10);
  const addressSnapshots = useGetAddressMetagraphSnapshots(addressId, {
    limit: addressSnapshotsPagination.limit,
    offset: addressSnapshotsPagination.offset,
  });

  const addressRewardsPagination = usePagination(10);
  const addressRewards = useGetAddressRewards(addressId, network, {
    limit: addressRewardsPagination.limit,
    offset: addressRewardsPagination.offset,
  });

  const addressMetagraphRewardsPagination = usePagination(10);
  const addressMetagraphRewards = useGetAddressMetagraphRewards(addressId, selectedMetagraph?.metagraphId, network, {
    limit: addressMetagraphRewardsPagination.limit,
    offset: addressMetagraphRewardsPagination.offset,
  });

  const skeleton = addressBalance.isFetching || totalRewards.isFetching || !dagInfo;
  const metagraphSkeleton = addressMetagraphs.isFetching || metagraphTokensDropdown.length === 0;

  const handleFillMetagraphs = () => {
    const allMetagraphsToUse = allMetagraphTokens ?? [];
    const metagraphsFormatted = allMetagraphsToUse.slice(
      offsetAddressMetagraphs,
      limitAddressMetagraphs + offsetAddressMetagraphs
    );
    const metagraphsSize = allMetagraphsToUse.length;

    const totalBalance = metagraphsFormatted.reduce(function (accumulate, current) {
      return accumulate + current.balance;
    }, 0);

    setMetagraphTokensTable(metagraphsFormatted);
    const defaultOption = {
      metagraphId: 'ALL_METAGRAPHS',
      metagraphName: `All Metagraph Tokens (${metagraphsSize})`,
      metagraphDescription: `All Metagraph Tokens (${metagraphsSize})`,
      metagraphSymbol: `All Metagraph Tokens (${metagraphsSize})`,
      metagraphIcon: '',
      metagraphSiteUrl: null,
      metagraphStakingWalletAddress: null,
      metagraphFeesWalletAddress: null,
      balance: totalBalance,
    };
    setSelectedMetagraph(defaultOption);
    setMetagraphTokensDropdown([defaultOption, ...allMetagraphsToUse]);
  };

  const handleExport = () => {
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    if (!isValidAddress.test(addressId) && !SPECIAL_ADDRESSES_LIST.includes(addressId)) {
      setError('404');
    }
  }, []);

  useEffect(() => {
    if (!addressMetagraphs.isFetching && !addressMetagraphs.isError) {
      setAllMetagraphTokens(addressMetagraphs.data);
    }
  }, [addressMetagraphs.isFetching]);

  useEffect(() => {
    if (!totalRewards.isFetching && !totalRewards.isError) {
      if (totalRewards.data.isValidator) {
        setAllTimeRewards(totalRewards.data.totalAmount);
      } else {
        setAllTimeRewards(undefined);
      }
    }
  }, [totalRewards.isFetching]);

  useEffect(() => {
    if (isAxiosError(addressTransactions.error) && addressTransactions.error.response.status !== 404) {
      setError(addressTransactions.error.message);
    }

    if (isAxiosError(addressTransactions.error) && addressTransactions.error.response.status === 404) {
      if (tokenChanged) {
        setAddressTxs([]);
      }
    }

    if (addressBalance.isError) {
      setError(addressBalance.error.message);
    }

    if (addressMetagraphs.isError) {
      setError(addressMetagraphs.error.message);
    }
  }, [addressTransactions.isError, addressBalance.isError, addressMetagraphs.isError]);

  useEffect(() => {
    if (tokenChanged) {
      addressTransactionsPagination.goPage(0);
    }
  }, [tokenChanged]);

  useEffect(() => {
    handleFillMetagraphs();
  }, [offsetAddressMetagraphs, allMetagraphTokens]);

  useEffect(() => {
    addressSnapshots.isFetched && addressSnapshotsPagination.setTotalItems(addressSnapshots.data.meta.total);
  }, [addressSnapshots.isFetched && addressSnapshots.data.meta.total]);

  useEffect(() => {
    addressTransactionsPagination.setTotalItems(null);
    if (addressTransactions.isFetched && addressTransactions.data?.meta?.next) {
      addressTransactionsPagination.setNextPageToken(addressTransactions.data.meta?.next);
    }
  }, [addressTransactions.isFetched && addressTransactions.data?.meta?.next]);

  return (
    <>
      <section className={`${styles.searchMobile}`}>
        <div className={`${styles.row} ${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <Subheader text={'Address details'} item={IconType.Address} hasExport handleExport={handleExport} />
      <ExportModal
        open={modalOpen}
        onClose={handleExport}
        address={addressId}
        hasRewards={!totalRewards.isFetching && !totalRewards.isLoading && allTimeRewards !== undefined}
        loadingRewards={totalRewards.isFetching || totalRewards.isLoading}
      />
      {error ? (
        <NotFound entire={false} errorCode={error} />
      ) : (
        <main className={styles.fullWidth3}>
          <div className={styles.addressOverview}>
            <div className={styles.subTitle}>
              <div className={styles.flexRowBottom}>
                <p className="overviewText">Overview</p>
              </div>
            </div>
            <div className={styles.spanContent}>
              <div className={`${styles.txGroup}`}>
                <DetailRow
                  title={'Address'}
                  borderBottom
                  value={!skeleton ? addressId : ''}
                  skeleton={skeleton}
                  icon={<AddressShape />}
                  copy
                  isLong
                  isMain
                />
                <DetailRow
                  borderBottom
                  title={'Balance'}
                  value={
                    skeleton
                      ? ''
                      : addressBalance.isFetching
                      ? '... DAG'
                      : formatAmount(addressBalance.data?.balance ?? 0, 8)
                  }
                  subValue={
                    skeleton
                      ? ''
                      : `(${formatPriceWithSymbol(addressBalance.data?.balance ?? 0, dagInfo, 2, '$', 'USD')})`
                  }
                  skeleton={skeleton}
                />
                {!totalRewards.isFetching && !totalRewards.isLoading && allTimeRewards !== undefined && (
                  <DetailRow
                    borderBottom
                    title={'ALL-TIME REWARDS RECEIVED'}
                    value={skeleton ? '' : allTimeRewards ? formatAmount(allTimeRewards, 6) : '0 DAG'}
                    subValue={
                      skeleton
                        ? ''
                        : allTimeRewards
                        ? '($' + formatPrice(allTimeRewards, dagInfo, 2) + ' USD)'
                        : '($0 USD)'
                    }
                    skeleton={totalRewards.isLoading || !dagInfo}
                  />
                )}
                <MetagraphTokensSection
                  skeleton={metagraphSkeleton}
                  metagraphTokens={metagraphTokensDropdown}
                  selectedOption={selectedMetagraph}
                  setSelectedMetagraph={setSelectedMetagraph}
                  setTokenChanged={setTokenChanged}
                  setSkeleton={() => void 0}
                />
              </div>
            </div>
          </div>
          <div className={`${styles.row3}`}>
            <div className={`${styles.flexRowBottom}`}>
              <Tabs value={selectedTable} onValue={(value) => setSelectedTable(value as any)}>
                <Tabs.Tab id="transactions">
                  {!isInMetagraphPage ? 'DAG Transactions' : `${selectedMetagraph.metagraphSymbol} Transactions`}
                </Tabs.Tab>
                <Tabs.Tab id="rewards">
                  {!isInMetagraphPage ? 'DAG Rewards' : `${selectedMetagraph.metagraphSymbol} Rewards`}
                </Tabs.Tab>
                {(addressSnapshots.data?.data.length ?? 0) > 0 && !isInMetagraphPage && (
                  <Tabs.Tab id="snapshots">Snapshots</Tabs.Tab>
                )}
                <Tabs.Tab id="tokens">Tokens list</Tabs.Tab>
              </Tabs>
            </div>
          </div>
          <div className={styles.row5}>
            {selectedTable === 'transactions' && (
              <TransactionsTable
                skeleton={{ showSkeleton: addressTransactions.isFetching }}
                limit={
                  addressTxs && addressTxs.length > 0
                    ? addressTxs.length
                    : addressTransactionsPagination.currentPageSize
                }
                transactions={(addressTransactions.data?.data ?? []).map((transaction) => ({
                  ...transaction,
                  symbol: isInMetagraphPage ? selectedMetagraph.metagraphSymbol : 'DAG',
                  isMetagraphTransaction: isInMetagraphPage,
                  direction: transaction.destination === addressId ? 'IN' : 'OUT',
                  metagraphId: isInMetagraphPage ? selectedMetagraph.metagraphId : 'ALL_METAGRAPHS',
                }))}
                icon={<AddressShape />}
                emptyStateLabel="No transactions detected"
              />
            )}
            {selectedTable === 'tokens' && (
              <TokensTable
                metagraphTokens={metagraphTokensTable}
                amount={1}
                loading={addressMetagraphs.isFetching}
                emptyStateLabel="No tokens detected"
              />
            )}
            {selectedTable === 'rewards' && !isInMetagraphPage && (
              <Table
                primaryKey="ordinal"
                titles={{
                  address: { content: 'Sent To' },
                  rewardsCount: { content: 'Rewards Txns' },
                  amount: { content: 'Daily Total' },
                  accruedAt: { content: 'Date' },
                }}
                showSkeleton={!addressRewards.isFetched ? { size: addressRewardsPagination.currentPageSize } : null}
                emptyStateLabel="No rewards detected"
                data={addressRewards.data?.data ?? []}
                formatData={{
                  address: (value) => <Link to={`/address/${value}`}>{(console.log(value), shorten(value))}</Link>,
                  amount: (value) => (
                    <span className={styles.rewardAmountCell}>
                      <span className={styles.total}>
                        {formatNumber(
                          new Decimal(value ?? 0).div(Decimal.pow(10, 8)),
                          NumberFormat.DECIMALS_TRIMMED_EXPAND
                        ) + ' DAG'}
                      </span>
                    </span>
                  ),
                  accruedAt: (value) => formatTime(value, 'date'),
                }}
              />
            )}
            {selectedTable === 'rewards' && isInMetagraphPage && (
              <Table
                primaryKey="ordinal"
                titles={{
                  address: { content: 'Sent To' },
                  rewardsCount: { content: 'Rewards Txns' },
                  amount: { content: 'Daily Total' },
                  accruedAt: { content: 'Date' },
                }}
                showSkeleton={
                  !addressMetagraphRewards.isFetched
                    ? { size: addressMetagraphRewardsPagination.currentPageSize }
                    : null
                }
                emptyStateLabel="No rewards detected"
                data={addressMetagraphRewards.data?.data ?? []}
                formatData={{
                  address: (value) => <Link to={`/address/${value}`}>{shorten(value)}</Link>,
                  amount: (value) => (
                    <span className={styles.rewardAmountCell}>
                      <span className={styles.total}>
                        {formatNumber(
                          new Decimal(value ?? 0).div(Decimal.pow(10, 8)),
                          NumberFormat.DECIMALS_TRIMMED_EXPAND
                        ) + ` ${selectedMetagraph.metagraphSymbol}`}
                      </span>
                    </span>
                  ),
                  accruedAt: (value) => formatTime(value, 'date'),
                }}
              />
            )}
            {selectedTable === 'snapshots' && !isInMetagraphPage && (
              <Table
                primaryKey="ordinal"
                titles={{
                  metagraphId: { content: 'Metagraph Id' },
                  ordinal: { content: 'Ordinal' },
                  timestamp: { content: 'Timestamp' },
                  sizeInKB: { content: 'Snapshot Size' },
                  fee: { content: 'Snapshot Fee' },
                }}
                showSkeleton={!addressSnapshots.isFetched ? { size: addressSnapshotsPagination.currentPageSize } : null}
                emptyStateLabel="No snapshots detected"
                data={addressSnapshots.data?.data ?? []}
                formatData={{
                  metagraphId: (value) => <Link to={`/metagraphs/${value}`}>{shorten(value)}</Link>,
                  ordinal: (value, record) => (
                    <Link to={`/metagraphs/${record.metagraphId}/snapshots/${value}`}>{value}</Link>
                  ),
                  timestamp: (value) => <span title={value}>{dayjs(value).fromNow()}</span>,
                  sizeInKB: (value) => (value ?? '-- ') + 'kb',
                  fee: (value) =>
                    formatNumber(
                      new Decimal(value ?? 0).div(Decimal.pow(10, 8)),
                      NumberFormat.DECIMALS_TRIMMED_EXPAND
                    ) + ' DAG',
                }}
              />
            )}
          </div>
          <div className={styles.row6}>
            {selectedTable === 'transactions' && (
              <TablePagination
                currentPage={addressTransactionsPagination.currentPage}
                totalPages={addressTransactionsPagination.totalPages}
                currentSize={addressTransactionsPagination.currentPageSize}
                pageSizes={[10, 15, 20]}
                onPageSizeChange={(size) => addressTransactionsPagination.setPageSize(size)}
                onPageChange={(page) => addressTransactionsPagination.goPage(page)}
                useNextPageToken
                nextPageToken={addressTransactionsPagination.nextPageToken}
              />
            )}
            {selectedTable === 'rewards' && !isInMetagraphPage && (
              <TablePagination
                currentPage={addressRewardsPagination.currentPage}
                totalPages={addressRewardsPagination.totalPages}
                currentSize={addressRewardsPagination.currentPageSize}
                pageSizes={[10, 15, 20]}
                onPageSizeChange={(size) => addressRewardsPagination.setPageSize(size)}
                onPageChange={(page) => addressRewardsPagination.goPage(page)}
              />
            )}
            {selectedTable === 'rewards' && isInMetagraphPage && (
              <TablePagination
                currentPage={addressMetagraphRewardsPagination.currentPage}
                totalPages={addressMetagraphRewardsPagination.totalPages}
                currentSize={addressMetagraphRewardsPagination.currentPageSize}
                pageSizes={[10, 15, 20]}
                onPageSizeChange={(size) => addressMetagraphRewardsPagination.setPageSize(size)}
                onPageChange={(page) => addressMetagraphRewardsPagination.goPage(page)}
              />
            )}
            {selectedTable === 'snapshots' && (
              <TablePagination
                currentPage={addressSnapshotsPagination.currentPage}
                totalPages={addressSnapshotsPagination.totalPages}
                currentSize={addressSnapshotsPagination.currentPageSize}
                pageSizes={[10, 15, 20]}
                onPageSizeChange={(size) => addressSnapshotsPagination.setPageSize(size)}
                onPageChange={(page) => addressSnapshotsPagination.goPage(page)}
              />
            )}
            {selectedTable === 'tokens' && (
              <TablePagination
                currentPage={addressMetagraphsPagination.currentPage}
                totalPages={addressMetagraphsPagination.totalPages}
                currentSize={addressMetagraphsPagination.currentPageSize}
                pageSizes={[10, 15, 20]}
                onPageSizeChange={(size) => addressMetagraphsPagination.setPageSize(size)}
                onPageChange={(page) => addressMetagraphsPagination.goPage(page)}
              />
            )}
          </div>
        </main>
      )}
    </>
  );
};
