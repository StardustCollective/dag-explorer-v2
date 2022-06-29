import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAddressBalance, useGetAddressTransactions } from '../../api/block-explorer';
import { Transaction } from '../../types';
import { ArrowButton } from '../../components/Buttons/ArrowButton';
import { DetailRow } from '../../components/DetailRow/DetailRow';
import { Subheader } from '../../components/Subheader/Subheader';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { IconType } from '../../constants';
import styles from './AddressDetails.module.scss';
import AddressShape from '../../assets/icons/AddressShape.svg';
import { NotFound } from '../NotFoundView/NotFound';
import { formatAmount } from '../../utils/numbers';
import { SearchBar } from '../../components/SearchBar/SearchBar';

const LIMIT = 10;

type Params = {
  limit: number;
  search_after?: string;
  search_before?: string;
};

export const AddressDetails = () => {
  const { addressId } = useParams();
  const [addressTxs, setAddressTxs] = useState<Transaction[] | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [params, setParams] = useState<Params>({ limit: LIMIT });
  const addressInfo = useGetAddressTransactions(addressId, params);
  const addressBalance = useGetAddressBalance(addressId);
  const [isPrev, setIsPrev] = useState(false);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [error, setError] = useState<string>(undefined);

  useEffect(() => {
    if (!addressInfo.isLoading && !addressInfo.isFetching && !addressInfo.isError) {
      if (addressInfo.data.length > 0) {
        setAddressTxs(addressInfo.data);
      }
      if (addressInfo.data.length < LIMIT) {
        setLastPage(true);
      }
    }
  }, [addressInfo.isLoading, addressInfo.isFetching]);

  useEffect(() => {
    if (!addressBalance.isFetching && !addressBalance.isError) {
      setBalance(formatAmount(addressBalance.data.balance, 8));
    }
  }, [addressBalance.isFetching]);

  useEffect(() => {
    if (!addressInfo.isFetching) {
      if (isPrev) {
        setAddressTxs(addressInfo.data.reverse());
      }
    }
  }, [addressInfo.isFetching]);

  useEffect(() => {
    if (addressInfo.isError) {
      setError(addressInfo.error.message);
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
      setIsPrev(false);
      setPage((p) => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (addressTxs) {
      setParams({
        limit: LIMIT,
        search_after: addressTxs[0].hash,
      });
      setIsPrev(true);
      setPage((p) => p - 1);
      setLastPage(false);
    }
  };

  const skeleton = addressBalance.isFetching;

  return (
    <>
      <section className={`${styles.searchMobile}`}>
        <div className={`${styles.row} ${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <Subheader text={'Address details'} item={IconType.Address} />
      {error === '404' ? (
        <NotFound entire={false} />
      ) : (
        <main className={`${styles.fullWidth3}`}>
          <div className={`${styles.row1}`}>
            <div className={`${styles.flexRowBottom}`}>
              <p className="overviewText">Overview</p>
            </div>
          </div>
          <div className={`${styles.row2}`}>
            <div className={styles.spanContent}>
              <div className={`${styles.txGroup}`}>
                <DetailRow
                  borderBottom
                  title={'ADDRESS'}
                  value={skeleton ? '' : addressId}
                  skeleton={skeleton}
                  isLong
                />
                <DetailRow
                  title={'BALANCE'}
                  value={skeleton ? '' : balance ? balance + ' DAG' : ''}
                  skeleton={skeleton}
                />
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
              skeleton={{ showSkeleton: addressInfo.isFetching }}
              limit={LIMIT}
              transactions={addressTxs}
              icon={AddressShape}
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
