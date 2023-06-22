import clsx from 'clsx';
import Select from 'react-select';

import { useCallback, useContext, useEffect, useState } from 'react';
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
import { TokensTable } from '../../components/TokensTable/TokensTable';

import { isValidAddress } from '../../utils/search';
import { useGetAddressTotalRewards } from '../../api/block-explorer/address';
import { useGetAdressMetagraphs } from '../../api/block-explorer/metagraph-address';
import { SPECIAL_ADDRESSES_LIST } from '../../constants/specialAddresses';
import { handleFetchedData, handlePagination } from '../../utils/pagination';
import { FetchedData, Params } from '../../types/requests';

import styles from './AddressDetails.module.scss';

export const AddressDetails = ({ network }: { network: Exclude<Network, 'mainnet1'> }) => {
  const { addressId } = useParams();
  const { dagInfo } = useContext(PricesContext) as PricesContextType;
  const [addressTxs, setAddressTxs] = useState<Transaction[] | undefined>(undefined);
  const [fetchedData, setFetchedData] = useState<FetchedData<Transaction>[] | undefined>([]);
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const [allTimeRewards, setAllTimeRewards] = useState<number | undefined>(undefined);
  const [limit, setLimit] = useState<number>(10);
  const [params, setParams] = useState<Params>({ limit });
  const addressBalance = useGetAddressBalance(addressId);
  const totalRewards = useGetAddressTotalRewards(addressId, network);
  const [error, setError] = useState<string>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [txsSkeleton, setTxsSkeleton] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [selectedTable, setSelectedTable] = useState<'transactions' | 'tokens'>('transactions');

  const addressMetagraphs = useGetAdressMetagraphs(addressId);

  const [metagraphTokensDropdown, setMetagraphTokensDropdown] = useState<AddressMetagraphResponse[]>([]);
  const [metagraphTokensTable, setMetagraphTokensTable] = useState<AddressMetagraphResponse[]>([]);
  const [allMetagraphTokens, setAllMetagraphTokens] = useState<AddressMetagraphResponse[]>([]);

  const [limitAddressMetagraphs, setLimitAddressMetagraphs] = useState<number>(10);
  const [offsetAddressMetagraphs, setOffsetAddressMetagraphs] = useState<number>(0);

  const [selectedMetagraph, setSelectedMetagraph] = useState<AddressMetagraphResponse | null>(null);
  const [tokenChanged, setTokenChanged] = useState<boolean>(false);
  const addressInfo = useGetAddressTransactions(addressId, selectedMetagraph && selectedMetagraph.metagraphId, params);

  const [handlePrevPage, handleNextPage] = handlePagination<Transaction[], FetchedData<Transaction>[]>(
    addressTxs,
    setAddressTxs,
    fetchedData,
    currentPage,
    setCurrentPage,
    setParams,
    setLastPage,
    setTxsSkeleton,
    limit
  );

  const handlePreviousPageMetagraphsList = () => {
    setOffsetAddressMetagraphs(offsetAddressMetagraphs - limitAddressMetagraphs);
  };

  const handleNextPageMetagraphsList = () => {
    setOffsetAddressMetagraphs(offsetAddressMetagraphs + limitAddressMetagraphs);
  };

  const handleFillMetagraphs = () => {
    const metagraphsFormatted = allMetagraphTokens.slice(
      offsetAddressMetagraphs,
      limitAddressMetagraphs + offsetAddressMetagraphs
    );
    const metagraphsSize = allMetagraphTokens.length;

    const totalBalance = metagraphsFormatted.reduce(function (accumulate, current) {
      return accumulate + current.balance;
    }, 0);

    setMetagraphTokensTable(metagraphsFormatted);
    const defaultOption = {
      metagraphId: 'ALL_METAGRAPHS',
      metagraphName: `All Metagraph Tokens (${metagraphsSize})`,
      metagraphSymbol: `All Metagraph Tokens (${metagraphsSize})`,
      metagraphIcon: '',
      balance: totalBalance,
    };
    setSelectedMetagraph(defaultOption);
    setMetagraphTokensDropdown([defaultOption, ...allMetagraphTokens]);
  };

  useEffect(() => {
    if (!isValidAddress.test(addressId) && !SPECIAL_ADDRESSES_LIST.includes(addressId)) {
      setError('404');
    }
  }, []);

  useEffect(() => {
    if (!addressInfo.isLoading && !addressInfo.isFetching && !addressInfo.isError) {
      if (addressInfo.data?.data.length > 0) {
        const { data } = addressInfo.data;
        const transactions = data.map((tx) => {
          const isMetagraphTransaction = selectedMetagraph && selectedMetagraph.metagraphId !== 'ALL_METAGRAPHS';

          tx.symbol = isMetagraphTransaction ? selectedMetagraph.metagraphSymbol : 'DAG';
          tx.isMetagraphTransaction = isMetagraphTransaction;
          tx.direction = tx.destination === addressId ? 'IN' : 'OUT';
          tx.metagraphId = selectedMetagraph.metagraphId

          return tx;
        });
        setAddressTxs(transactions);
      }

      handleFetchedData(setFetchedData, addressInfo, currentPage, setLastPage, tokenChanged);
      setTokenChanged(false);
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
      setAllMetagraphTokens(addressMetagraphs.data);
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
      if (addressInfo.error.message === '404') {
        handlePrevPage(true);
      }
    }
    if (addressBalance.isError) {
      setError(addressBalance.error.message);
    }
    if (addressMetagraphs.isError) {
      setError(addressMetagraphs.error.message);
    }
  }, [addressInfo.isError, addressBalance.isError, addressMetagraphs.isError]);

  useEffect(() => {
    if (tokenChanged) {
      setCurrentPage(0);
      setFetchedData([]);
      setTxsSkeleton(true);
      setParams({ limit });
    }
  }, [tokenChanged]);

  useEffect(() => {
    setTxsSkeleton(true);
    setParams({ limit });
    setFetchedData([]);
    setCurrentPage(0);
  }, [limit]);

  useEffect(() => {
    handleFillMetagraphs();
  }, [offsetAddressMetagraphs, allMetagraphTokens]);

  const handleExport = () => {
    setModalOpen(!modalOpen);
  };

  const skeleton = addressBalance.isFetching || totalRewards.isFetching || !dagInfo;
  const metagraphSkeleton = addressMetagraphs.isFetching || metagraphTokensDropdown.length === 0;

  const handleSelectChange = useCallback(
    (selectedOption: { value: number; label: number }) => {
      setLimit(selectedOption.value);
      setLimitAddressMetagraphs(selectedOption.value);
    },
    [limit, limitAddressMetagraphs]
  );

  const pageSizeSelectorStyles = {
    indicatorSeparator: (styles) => ({ ...styles, display: 'none' }),
    valueContainer: (styles) => ({ ...styles, svg: { fill: 'black' } }),
    indicatorsContainer: (styles) => ({ ...styles, svg: { fill: 'black' } }),
    container: (styles) => ({ ...styles, borderRadius: '24px' }),
    control: (styles) => ({ ...styles, borderRadius: '24px' }),
  };

  const options = [
    { value: 10, label: 10 },
    { value: 25, label: 25 },
    { value: 50, label: 50 }
  ];

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
        <main className={clsx(selectedTable === 'transactions' ? styles.fullWidth3 : styles.fullWidth3)}>
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
                />
                <MetagraphTokensSection
                  skeleton={metagraphSkeleton}
                  metagraphTokens={metagraphTokensDropdown}
                  selectedOption={selectedMetagraph}
                  setSelectedMetagraph={setSelectedMetagraph}
                  setTokenChanged={setTokenChanged}
                />
                {!totalRewards.isFetching && !totalRewards.isLoading && allTimeRewards !== undefined && (
                  <DetailRow
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
          <div className={styles.row5}>
            {selectedTable === 'transactions' ? (
              <TransactionsTable
                skeleton={{ showSkeleton: txsSkeleton }}
                limit={addressTxs && addressTxs.length > 0 ? addressTxs.length : limit}
                transactions={addressTxs}
                icon={<AddressShape />}
              />
            ) : (
              <TokensTable metagraphTokens={metagraphTokensTable} amount={5} loading={!metagraphTokensTable} />
            )}
          </div>
          <div className={`${styles.row6}`}>
            <div className={`${styles.flexRowTop}`}>
              <div className={styles.selectorContainer}>
                <span>Show</span>
                <Select
                  styles={pageSizeSelectorStyles}
                  options={options}
                  defaultValue={options['0']}
                  onChange={handleSelectChange}
                />
              </div>
              {selectedTable === 'transactions' ? (
                <div className={styles.arrows}>
                  <ArrowButton handleClick={handlePrevPage} disabled={currentPage === 0 || txsSkeleton} />
                  <ArrowButton
                    forward
                    handleClick={() => handleNextPage()}
                    disabled={txsSkeleton || lastPage}
                  />
                </div>
              ) : (
                <div className={styles.arrows}>
                  <ArrowButton
                    handleClick={handlePreviousPageMetagraphsList}
                    disabled={offsetAddressMetagraphs === 0}
                  />
                  <ArrowButton
                    forward
                    handleClick={handleNextPageMetagraphsList}
                    disabled={offsetAddressMetagraphs + limitAddressMetagraphs >= allMetagraphTokens.length}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </>
  );
};
