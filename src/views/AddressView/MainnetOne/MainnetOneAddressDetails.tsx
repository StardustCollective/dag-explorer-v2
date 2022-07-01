import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainnetOneTransaction } from '../../../types';
import { ArrowButton } from '../../../components/Buttons/ArrowButton';
import { DetailRow } from '../../../components/DetailRow/DetailRow';
import { Subheader } from '../../../components/Subheader/Subheader';
import { IconType } from '../../../constants';
import styles from '.././AddressDetails.module.scss';
import AddressShape from '../../../assets/icons/AddressShape.svg';
import { NotFound } from '../../NotFoundView/NotFound';
import { useGetTransactionsByAddress } from '../../../api/mainnet_1/block-explorer';
import { useGetAddressBalance } from '../../../api/mainnet_1/load-balancer';
import { MainnetOneTransactionTable } from '../../../components/MainnetOneTable/MainnetOneTransactionTable';
import { formatAmount, formatPrice } from '../../../utils/numbers';
import { SearchBar } from '../../../components/SearchBar/SearchBar';
import { PricesContext, PricesContextType } from '../../../context/PricesContext';

const LIMIT = 10;

export const MainnetOneAddressDetails = () => {
  const { addressId } = useParams();
  const { dagInfo } = useContext(PricesContext) as PricesContextType;
  const [addressTxs, setAddressTxs] = useState<MainnetOneTransaction[] | undefined>(undefined);
  const [balance, setBalance] = useState(undefined);
  const addressInfo = useGetTransactionsByAddress(addressId);
  const addressBalance = useGetAddressBalance(addressId);
  const [isPrev, setIsPrev] = useState(false);
  const [startAt, setStartAt] = useState(0);
  const [endAt, setEndAt] = useState(LIMIT);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [error, setError] = useState<string>(undefined);

  useEffect(() => {
    if (!addressInfo.isLoading && !addressInfo.isFetching && !addressInfo.isError) {
      if (addressInfo.data.length > 0) {
        const arrTxs: MainnetOneTransaction[] = [];
        Object.values(addressInfo.data).map((t) => {
          const transaction: MainnetOneTransaction = {
            amount: t.amount,
            fee: t.fee,
            hash: t.hash,
            receiver: t.receiver,
            sender: t.sender,
            snapshot: t.snapshotHash,
            timestamp: t.timestamp,
          };
          arrTxs.push(transaction);
        });
        setAddressTxs(arrTxs);
      }
      if (addressInfo.data.length < LIMIT) {
        setLastPage(true);
      }
    }
  }, [addressInfo.isLoading, addressInfo.isFetching]);

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
    if (!error && addressBalance.isError) {
      setError(addressBalance.error.message);
    }
  }, [addressInfo.isError, addressBalance.isError]);

  useEffect(() => {
    if (!addressBalance.isFetching && !addressBalance.isError) {
      if (addressBalance.data.result.balance) {
        setBalance(addressBalance.data.result.balance.balance);
      } else {
        setBalance(0);
      }
    }
  }, [addressBalance.isFetching]);

  const handleNextPage = () => {
    if (addressTxs) {
      setStartAt((s) => s + LIMIT);
      setEndAt((e) => e + LIMIT);
      setIsPrev(false);
      setPage((p) => p + 1);

      if ((page + 1) * LIMIT < addressTxs.length && (page + 1) * LIMIT + LIMIT >= addressTxs.length) {
        setLastPage(true);
      }
    }
  };

  const handlePrevPage = () => {
    if (addressTxs) {
      setStartAt((s) => s - LIMIT);
      setEndAt((e) => e - LIMIT);
      setIsPrev(true);
      setPage((p) => p - 1);
      setLastPage(false);
    }
  };

  const skeleton = addressInfo.isFetching || !addressTxs || addressBalance.isFetching;
  return (
    <>
      <section className={`${styles.searchMobile}`}>
        <div className={`${styles.row} ${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <Subheader text={'Address details'} item={IconType.Address} />
      {error === '404' || error === '500' ? (
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
                  isMain
                />
                <DetailRow
                  title={'BALANCE'}
                  value={!skeleton ? formatAmount(balance, 8) : ''}
                  subValue={!skeleton ? '($' + formatPrice(balance, dagInfo, 2) + ' USD)' : ''}
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
            <MainnetOneTransactionTable
              skeleton={{ showSkeleton: skeleton }}
              limit={LIMIT}
              transactions={addressTxs ? addressTxs.slice(startAt, endAt) : null}
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
