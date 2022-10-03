import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAddressBalance, useGetAddressTransactions } from '../../api/block-explorer';
import { Transaction } from '../../types';
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
import { isValidAddress } from '../../utils/search';
import { useGetAddressTotalRewards } from '../../api/block-explorer/address';

const LIMIT = 10;

type Params = {
  limit: number;
  search_after?: string;
  search_before?: string;
};

export const AddressDetails = ({ network }: { network: Exclude<Network, 'mainnet1'> }) => {
  const { addressId } = useParams();
  const { dagInfo } = useContext(PricesContext) as PricesContextType;
  const [addressTxs, setAddressTxs] = useState<Transaction[] | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [allTimeRewards, setAllTimeRewards] = useState<number | undefined>(undefined);
  const [params, setParams] = useState<Params>({ limit: LIMIT });
  const addressInfo = useGetAddressTransactions(addressId, params);
  const addressBalance = useGetAddressBalance(addressId);
  const totalRewards = useGetAddressTotalRewards(addressId, network);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [error, setError] = useState<string>(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!isValidAddress.test(addressId)) {
      setError('404');
    }
  }, []);

  useEffect(() => {
    if (!addressInfo.isLoading && !addressInfo.isFetching && !addressInfo.isError) {
      if (addressInfo.data.length > 0) {
        setAddressTxs(addressInfo.data);
      }
      if (addressInfo.data.length <= LIMIT) {
        setLastPage(true);
      } else {
        setLastPage(false);
      }
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
      setLastPage(true);
    }
    if (addressBalance.isError) {
      setError(addressBalance.error.message);
    }
  }, [addressInfo.isError, addressBalance.isError]);

  const handleNextPage = () => {
    if (addressTxs) {
      setParams({
        limit: LIMIT,
        search_before: addressTxs[LIMIT - 1].hash,
      });
      setPage((p) => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (addressTxs) {
      setParams({
        limit: LIMIT,
        search_after: addressTxs[0].hash,
      });
      setPage((p) => p - 1);
      setLastPage(false);
    }
  };

  const handleExport = () => {
    setModalOpen(!modalOpen);
  };

  const skeleton = addressInfo.isLoading || addressBalance.isLoading || totalRewards.isLoading || !dagInfo;

  return (
    <>
      <section className={`${styles.searchMobile}`}>
        <div className={`${styles.row} ${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <Subheader text={'Address details'} item={IconType.Address} hasExport handleExport={handleExport} />
      <ExportModal open={modalOpen} onClose={handleExport} address={addressId} />
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
                  title={'ADDRESS'}
                  value={skeleton ? '' : addressId}
                  skeleton={skeleton}
                  isLong
                  isMain
                />
                <DetailRow
                  borderBottom
                  title={'BALANCE'}
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
              <p className="overviewText">Transactions</p>
              <div className={styles.arrows}>
                <ArrowButton handleClick={handlePrevPage} disabled={page === 0 || addressInfo.isFetching} />
                <ArrowButton forward handleClick={handleNextPage} disabled={addressInfo.isFetching || lastPage} />
              </div>
            </div>
          </div>
          <div className={`${styles.row4}`}>
            <TransactionsTable
              skeleton={{ showSkeleton: skeleton }}
              limit={LIMIT}
              transactions={addressTxs}
              icon={<AddressShape />}
            />
          </div>
          <div className={`${styles.row5}`}>
            <div className={`${styles.flexRowTop}`}>
              <span />

              <div className={styles.arrows}>
                <ArrowButton handleClick={() => handlePrevPage()} disabled={page === 0 || addressInfo.isFetching} />
                <ArrowButton
                  forward
                  handleClick={() => handleNextPage()}
                  disabled={addressInfo.isFetching || lastPage}
                />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};
