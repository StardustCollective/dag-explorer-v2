import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainnetOneTransaction } from '../../../types';
import { ArrowButton } from '../../../components/Buttons/ArrowButton';
import { DetailRow } from '../../../components/DetailRow/DetailRow';
import { Subheader } from '../../../components/Subheader/Subheader';
import { HgtpNetwork, IconType } from '../../../constants';
import { NotFound } from '../../NotFoundView/NotFound';
import { useGetTransactionsByAddress } from '../../../api/mainnet_1/block-explorer';
import { MainnetOneTransactionTable } from '../../../components/MainnetOneTable/MainnetOneTransactionTable';
import { SearchBar } from '../../../components/SearchBar/SearchBar';
import { PricesContext, PricesContextType } from '../../../context/PricesContext';
import { TransactionShape } from '../../../components/Shapes/TransactionShape';
import { isValidAddress } from '../../../utils/search';

import { SPECIAL_ADDRESSES_LIST } from '../../../constants/specialAddresses';

import styles from './MainnetOneAddressDetails.module.scss';
import { useNetwork } from '../../../context/NetworkContext';

const LIMIT = 10;

export const MainnetOneAddressDetails = () => {
  const { changeNetwork } = useNetwork();
  const { addressId } = useParams();
  const { dagInfo } = useContext(PricesContext) as PricesContextType;
  const [addressTxs, setAddressTxs] = useState<MainnetOneTransaction[] | undefined>(undefined);
  const addressInfo = useGetTransactionsByAddress(addressId);
  const [startAt, setStartAt] = useState(0);
  const [endAt, setEndAt] = useState(LIMIT);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [error, setError] = useState<string>(undefined);

  useEffect(() => {
    if (!isValidAddress.test(addressId) && !SPECIAL_ADDRESSES_LIST.includes(addressId)) {
      setError('404');
    }
  }, []);

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

      if (addressInfo.data.length === 0) {
        setAddressTxs(undefined);
      }

      if (addressInfo.data.length < LIMIT) {
        setLastPage(true);
      } else {
        setLastPage(false);
      }
    }
  }, [addressInfo.isLoading, addressInfo.isFetching]);

  useEffect(() => {
    if (addressInfo.isError) {
      setError(addressInfo.error.message);
    }
  }, [addressInfo.isError]);

  const handleNextPage = () => {
    if (addressTxs) {
      setStartAt((s) => s + LIMIT);
      setEndAt((e) => e + LIMIT);
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
      setPage((p) => p - 1);
      setLastPage(false);
    }
  };

  const skeleton = addressInfo.isFetching || !dagInfo;
  return (
    <>
      <section className={`${styles.searchMobile}`}>
        <div className={`${styles.row} ${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <Subheader text={'Address details'} item={IconType.Address} />
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
                  title={'BALANCE'}
                  value={!skeleton ? 'Transferred to ' : ''}
                  onlyLink={
                    <span className={styles.spanLink} onClick={() => changeNetwork(HgtpNetwork.MAINNET)}>
                      MainNet 2.0
                    </span>
                  }
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
              icon={<TransactionShape />}
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
