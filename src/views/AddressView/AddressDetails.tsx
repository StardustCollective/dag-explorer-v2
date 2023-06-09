import clsx from 'clsx';

import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAddressBalance, useGetAddressTransactions } from '../../api/block-explorer';
import { AddressMetagraphResponse, Transaction } from '../../types';
import { ArrowButton } from '../../components/Buttons/ArrowButton';
import { DetailRow } from '../../components/DetailRow/DetailRow';
import { Subheader } from '../../components/Subheader/Subheader';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { IconType, Network } from '../../constants';
import { NotFound } from '../NotFoundView/NotFound';
import { formatAmount, formatPrice, formatPriceWithSymbol } from '../../utils/numbers';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { PricesContext, PricesContextType } from '../../context/PricesContext';
import { ExportModal } from '../../components/Modals/ExportModal';
import { AddressShape } from '../../components/Shapes/AddressShape';
import { MetagraphTokensSection } from '../../components/MetagraphTokensSection/MetagraphTokensSection';
import { SearchTokenBar } from '../../components/SearchTokenBar/SearchTokenBar';
import { TokensTable } from '../../components/TokensTable/TokensTable';

import { isValidAddress } from '../../utils/search';
import { useGetAddressTotalRewards } from '../../api/block-explorer/address';
import { useGetAdressMetagraphs } from '../../api/block-explorer/metagraph-address';
import { SPECIAL_ADDRESSES_LIST } from '../../constants/specialAddresses';
import { handleFetchedData, handlePagination } from '../../utils/pagination';
import { FetchedData, Params } from '../../types/requests';

import styles from './AddressDetails.module.scss';

const LIMIT = 10;

export const AddressDetails = ({ network }: { network: Exclude<Network, 'mainnet1'> }) => {
  const { addressId } = useParams();
  const { dagInfo } = useContext(PricesContext) as PricesContextType;
  const [addressTxs, setAddressTxs] = useState<Transaction[] | undefined>(undefined);
  const [fetchedData, setFetchedData] = useState<FetchedData<Transaction>[] | undefined>([]);
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const [allTimeRewards, setAllTimeRewards] = useState<number | undefined>(undefined);
  const [params, setParams] = useState<Params>({ limit: LIMIT });
  const addressInfo = useGetAddressTransactions(addressId, params);
  const addressBalance = useGetAddressBalance(addressId);
  const totalRewards = useGetAddressTotalRewards(addressId, network);
  const [error, setError] = useState<string>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [txsSkeleton, setTxsSkeleton] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [selectedTable, setSelectedTable] = useState<'transactions' | 'tokens'>('transactions');
  const addressMetagraphs = useGetAdressMetagraphs(addressId);
  const [metagraphTokens, setMetagraphTokens] = useState<AddressMetagraphResponse[]>([]);
  const [metagraphTokensTable, setMetagraphTokensTable] = useState<AddressMetagraphResponse[]>([]);

  useEffect(() => {
    if (!isValidAddress.test(addressId) && !SPECIAL_ADDRESSES_LIST.includes(addressId)) {
      setError('404');
    }
  }, []);

  useEffect(() => {
    if (!addressInfo.isLoading && !addressInfo.isFetching && !addressInfo.isError) {
      if (addressInfo.data?.data.length > 0) {
        setAddressTxs(addressInfo.data.data);
      }
      handleFetchedData(setFetchedData, addressInfo, currentPage);
      setTxsSkeleton(false);
    }
  }, [addressInfo.isLoading, addressInfo.isFetching]);

  useEffect(() => {
    if (!addressBalance.isFetching && !addressBalance.isError) {
      setBalance(addressBalance.data.balance);
    }
  }, [addressBalance.isFetching]);

  useEffect(() => {
    if (!addressMetagraphs.isFetching && !addressMetagraphs.isError) {
      const metagraphs = addressMetagraphs.data;
      const metagraphsSize = metagraphs.length;

      setMetagraphTokensTable(metagraphs);
      setMetagraphTokens([
        {
          metagraphName: `All ${metagraphsSize} L0 tokens`,
          metagraphSymbol: 'ALL',
          metagraphIcon: '',
          balance: 0,
        },
        ...metagraphs,
      ]);
    }
  }, [addressMetagraphs.isFetching]);

  useEffect(() => {
    if (!totalRewards.isFetching && !totalRewards.isError) {
      if (totalRewards.data.isValidator) {
        setAllTimeRewards(totalRewards.data.totalAmount ?? 0);
      } else {
        setAllTimeRewards(undefined);
      }
    }
  }, [totalRewards.isFetching]);

  useEffect(() => {
    if (addressInfo.isError) {
      if (addressInfo.error.message !== '404') {
        setError(addressInfo.error.message);
      }
      setAddressTxs(undefined);
    }
    if (addressBalance.isError) {
      setError(addressBalance.error.message);
    }
    if (addressMetagraphs.isError) {
      setError(addressMetagraphs.error.message);
    }
  }, [addressInfo.isError, addressBalance.isError, addressMetagraphs.isError]);

  const [handlePrevPage, handleNextPage] = handlePagination<Transaction[], FetchedData<Transaction>[]>(
    addressTxs,
    setAddressTxs,
    fetchedData,
    currentPage,
    setCurrentPage,
    setParams,
    setLastPage,
    setTxsSkeleton,
    LIMIT
  );

  const handleExport = () => {
    setModalOpen(!modalOpen);
  };

  const skeleton = addressBalance.isFetching || totalRewards.isFetching || !dagInfo;
  const metagraphSkeleton = addressMetagraphs.isFetching || metagraphTokens.length === 0;

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
        <main className={`${styles.fullWidth3}`}>
          <div className={`${styles.addressOverview}`}>
            <div className={`${styles.subTitle}`}>
              <div className={`${styles.flexRowBottom}`}>
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
                  value={skeleton ? '' : balance ? formatAmount(balance, 8) : '0 DAG'}
                  subValue={skeleton ? '' : `(${formatPriceWithSymbol(balance || 0, dagInfo, 2, '$', 'USD')})`}
                  skeleton={skeleton}
                  isLargeRow
                />
                <MetagraphTokensSection
                  skeleton={metagraphSkeleton}
                  metagraphTokens={metagraphTokens}
                  defaultOption={metagraphTokens[0]}
                />
                {!totalRewards.isFetching && !totalRewards.isLoading && allTimeRewards !== undefined && (
                  <DetailRow
                    title={'ALL-TIME REWARDS RECEIVED'}
                    value={skeleton ? '' : allTimeRewards ? formatAmount(allTimeRewards, 8) : '0 DAG'}
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
              </div>
            </div>
          </div>
          <div className={`${styles.row3}`}>
            <div className={`${styles.flexRowBottom}`}>
              <div className={`${styles.tableOptions}`}>
                <label
                  className={clsx(styles.tab, selectedTable === 'transactions' && styles.selected)}
                  htmlFor="radio-1"
                >
                  Transactions
                </label>
                <input type="radio" id="radio-1" name="tabs" onClick={() => setSelectedTable('transactions')} />

                <label className={clsx(styles.tab, selectedTable === 'tokens' && styles.selected)} htmlFor="radio-2">
                  Tokens list
                </label>
                <input type="radio" id="radio-2" name="tabs" onClick={() => setSelectedTable('tokens')} />

                <span className={styles.glider} />
              </div>
            </div>
          </div>
          <div className={`${styles.row4}`}>
            <div className={styles.searchTokens}>
              <SearchTokenBar />
            </div>
            <div className={styles.arrows}>
              <ArrowButton handleClick={handlePrevPage} disabled={currentPage === 0 || txsSkeleton} />
              <ArrowButton forward handleClick={handleNextPage} disabled={txsSkeleton || lastPage} />
            </div>
          </div>
          <div className={`${styles.row5}`}>
            {selectedTable === 'transactions' ? (
              <TransactionsTable
                skeleton={{ showSkeleton: txsSkeleton }}
                limit={LIMIT}
                transactions={addressTxs}
                icon={<AddressShape />}
              />
            ) : (
              <TokensTable metagraphTokens={metagraphTokensTable} amount={5} loading={!metagraphTokensTable} />
            )}
          </div>
          <div className={`${styles.row6}`}>
            <div className={`${styles.flexRowTop}`}>
              <span />

              <div className={styles.arrows}>
                <ArrowButton handleClick={handlePrevPage} disabled={currentPage === 0 || txsSkeleton} />
                <ArrowButton forward handleClick={handleNextPage} disabled={txsSkeleton || lastPage} />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};
