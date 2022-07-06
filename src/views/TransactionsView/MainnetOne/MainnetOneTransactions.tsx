import { useEffect, useState } from 'react';
import { MainnetOneTransaction } from '../../../types';
import { ArrowButton } from '../../../components/Buttons/ArrowButton';
import { Subheader } from '../../../components/Subheader/Subheader';
import { IconType } from '../../../constants';
import styles from '../Transactions.module.scss';
import { NotFound } from '../../NotFoundView/NotFound';
import { useGetLatestTransactions } from '../../../api/mainnet_1/block-explorer';
import { MainnetOneTransactionTable } from '../../../components/MainnetOneTable/MainnetOneTransactionTable';
import { TransactionShape } from '../../../components/Shapes/TransactionShape';

const LIMIT = 13;

export const MainnetOneTransactions = () => {
  const [transactions, setTransactions] = useState<MainnetOneTransaction[] | undefined>(undefined);
  const [startAt, setStartAt] = useState(0);
  const [endAt, setEndAt] = useState(LIMIT);
  const query = `?startAt="${startAt.toString()}"&endAt="${endAt.toString()}"&orderBy="$key"`;
  const transactionsInfo = useGetLatestTransactions(query);
  const [isPrev, setIsPrev] = useState(false);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [error, setError] = useState<string>(undefined);
  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    if (!transactionsInfo.isFetching && !transactionsInfo.isError) {
      if (transactionsInfo.data) {
        const arrTxs: MainnetOneTransaction[] = [];
        Object.values(transactionsInfo.data).map((e) => arrTxs.push(e));
        setTransactions(arrTxs);

        if (arrTxs.length < LIMIT) {
          setLastPage(true);
        } else {
          setLastPage(false);
        }
        setSkeleton(false);
      }
    }
  }, [transactionsInfo.isFetching]);

  useEffect(() => {
    if (transactionsInfo.isError) {
      setError(transactionsInfo.error.message);
    }
  }, [transactionsInfo.isError]);

  useEffect(() => {
    if (!transactionsInfo.isFetching) {
      if (isPrev) {
        const arrTxs: MainnetOneTransaction[] = [];
        Object.values(transactionsInfo.data).map((e) => arrTxs.push(e));
        setTransactions(arrTxs);
      }
    }
  }, [transactionsInfo.isFetching]);

  const handleNextPage = () => {
    if (transactions) {
      setStartAt((s) => s + LIMIT + 1);
      setEndAt((e) => e + LIMIT);
      setIsPrev(false);
      setPage((p) => p + 1);

      if ((page + 1) * LIMIT < transactions.length && (page + 1) * LIMIT + LIMIT >= transactions.length) {
        setLastPage(true);
      }
    }
  };

  const handlePrevPage = () => {
    if (transactions) {
      setStartAt((s) => s - LIMIT);
      setEndAt((e) => e - LIMIT);
      setIsPrev(true);
      setPage((p) => p - 1);
      setLastPage(false);
    }
  };

  return (
    <>
      <Subheader text={'Transactions'} item={IconType.Transaction} />
      {error ? (
        <NotFound entire={false} errorCode={error} />
      ) : (
        <main className={`${styles.fullWidth3}`}>
          <div className={`${styles.row1}`}>
            <div className={`${styles.flexRowBottom}`}>
              <span />
              <div className={styles.arrows}>
                <ArrowButton handleClick={handlePrevPage} disabled={page === 0 || transactionsInfo.isFetching} />
                <ArrowButton forward handleClick={handleNextPage} disabled={transactionsInfo.isFetching || lastPage} />
              </div>
            </div>
          </div>
          <div className={`${styles.row2}`}>
            <MainnetOneTransactionTable
              skeleton={{ showSkeleton: skeleton }}
              limit={LIMIT}
              transactions={transactions}
              icon={<TransactionShape />}
            />
          </div>
          <div className={`${styles.row3}`}>
            <div className={`${styles.flexRowBottom}`}>
              <span />

              <div className={styles.arrows}>
                <ArrowButton
                  handleClick={() => handlePrevPage()}
                  disabled={page === 0 || transactionsInfo.isFetching}
                />
                <ArrowButton
                  forward
                  handleClick={() => handleNextPage()}
                  disabled={transactionsInfo.isFetching || lastPage}
                />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};
