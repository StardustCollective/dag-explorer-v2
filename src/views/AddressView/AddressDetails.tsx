import clsx from 'clsx';

import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAddressBalance, useGetAddressTransactions } from '../../api/block-explorer';
import { MetagraphToken, Transaction } from '../../types';
import { ArrowButton } from '../../components/Buttons/ArrowButton';
import { DetailRow } from '../../components/DetailRow/DetailRow';
import { Subheader } from '../../components/Subheader/Subheader';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { IconType, Network } from '../../constants';
import styles from './AddressDetails.module.scss';
import { NotFound } from '../NotFoundView/NotFound';
import { formatAmount, formatPrice } from '../../utils/numbers';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { PricesContext, PricesContextType } from '../../context/PricesContext';
import { ExportModal } from '../../components/Modals/ExportModal';
import { AddressShape } from '../../components/Shapes/AddressShape';
import { MetagraphTokens } from '../../components/MetagraphTokens/MetagraphTokens';
import { SearchTokenBar } from '../../components/SearchTokenBar/SearchTokenBar';

import { isValidAddress } from '../../utils/search';
import { useGetAddressTotalRewards } from '../../api/block-explorer/address';
import { SPECIAL_ADDRESSES_LIST } from '../../constants/specialAddresses';
import { handleFetchedData, handlePagination } from '../../utils/pagination';
import { FetchedData, Params } from '../../types/requests';
import { useGetAllMetagraphs } from '../../api/block-explorer/metagraphs';
import { TokensTable } from '../../components/TokensTable/TokensTable';

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
  const metagraphTokensInfo = useGetAllMetagraphs(addressId, {});
  const [error, setError] = useState<string>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [txsSkeleton, setTxsSkeleton] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [metagraphTokens, setMetagraphTokens] = useState<MetagraphToken[]>([]);
  const [metagraphTokensWithAmount, setMetagraphTokensWithAmount] = useState<MetagraphToken[]>([]);
  const [selectedTable, setSelectedTable] = useState<'transactions' | 'tokens'>('transactions');

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
  }, [addressInfo.isError, addressBalance.isError]);

  useEffect(() => {
    const data = [
      {
        name: 'DAG',
        symbol: 'DAG',
        icon: 'https://pbs.twimg.com/profile_images/1590732001992114178/sIGtbT44_400x400.jpg',
        price: 123,
        balance: 0,
        amount: 10
      },
      {
        name: 'DAG2',
        symbol: 'DAG',
        icon: 'https://pbs.twimg.com/profile_images/1590732001992114178/sIGtbT44_400x400.jpg',
        price: 123,
        balance: 2,
        amount: 10,
      },
    ];

    const balance = data.reduce((partialSum, a) => partialSum + a.balance, 0);
    setMetagraphTokens(data);

    setMetagraphTokensWithAmount([{
      name: `All ${data.length} L0 tokens`,
      symbol: 'DAG',
      icon: '',
      price: 123,
      balance,
      amount: 10,
    }, ... data]);

  }, []);

  // useEffect(() => {
  //   if (metagraphTokensInfo.isError) {
  //     setError(metagraphTokensInfo.error.message);
  //   }
  // }, [metagraphTokensInfo.isError]);

  // useEffect(() => {
  //   if (!metagraphTokensInfo.isFetching && !metagraphTokensInfo.isError) {
  //     setMetagraphTokens(metagraphTokensInfo.data.data);
  //   }
  // }, [metagraphTokensInfo.isFetching]);

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
                  borderBottom
                  title={'Address'}
                  value={skeleton ? '' : addressId}
                  skeleton={skeleton}
                  isLong
                  isMain
                />
                <DetailRow
                  borderBottom
                  title={'Balance'}
                  value={skeleton ? '' : balance ? formatAmount(balance, 8) : '0 DAG'}
                  subValue={skeleton ? '' : balance ? '($' + formatPrice(balance, dagInfo, 2) + ' USD)' : '($0 USD)'}
                  skeleton={skeleton}
                />
                <MetagraphTokens skeleton={skeleton} metagraphTokens={metagraphTokensWithAmount} defaultOption={metagraphTokensWithAmount[0]} />
                <DetailRow
                  title={'All time rewards'}
                  value={skeleton ? '' : balance ? formatAmount(balance, 8) : '0 DAG'}
                  subValue={skeleton ? '' : balance ? '($' + formatPrice(balance, dagInfo, 2) + ' USD)' : '($0 USD)'}
                  skeleton={skeleton}
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
              <TokensTable metagraphTokens={metagraphTokens} amount={5} loading={!metagraphTokens} />
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
