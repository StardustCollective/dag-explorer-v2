import { useEffect, useState } from 'react';
import { Transaction } from '../../types';
import { ArrowButton } from '../../components/Buttons/ArrowButton';
import { Subheader } from '../../components/Subheader/Subheader';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { IconType } from '../../constants';
import styles from './Transactions.module.scss';
import { NotFound } from '../NotFoundView/NotFound';
import { useGetAllTransactions } from '../../api/block-explorer/transaction';
import { TransactionShape } from '../../components/Shapes/TransactionShape';

const LIMIT = 14;

type Params = {
  limit: number;
  search_after?: string;
  search_before?: string;
};

export const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[] | undefined>(undefined);
  const [params, setParams] = useState<Params>({ limit: LIMIT });
  const transactionsInfo = useGetAllTransactions(params);
  const [isPrev, setIsPrev] = useState(false);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [error, setError] = useState<string>(undefined);
  const [skeleton, setSkeleton] = useState(false);

  useEffect(() => {
    setSkeleton(true);
    if (!transactionsInfo.isFetching && !transactionsInfo.isError) {
      if (transactionsInfo.data.length > 0) {
        setTransactions(transactionsInfo.data);
      }
      if (transactionsInfo.data.length < LIMIT) {
        setLastPage(true);
      } else {
        setLastPage(false);
      }
      setSkeleton(false);
    }
  }, [transactionsInfo.isFetching]);

  useEffect(() => {
    if (transactionsInfo.isError) {
      setError(transactionsInfo.error.message);
    }
  }, [transactionsInfo.isError]);

  const handleNextPage = () => {
    if (transactions) {
      setParams({
        limit: LIMIT,
        search_before: transactions[LIMIT - 1].hash,
      });
      setIsPrev(false);
      setPage((p) => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (transactions) {
      setParams({
        limit: LIMIT,
        search_after: transactions[0].hash,
      });
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
                <ArrowButton
                  forward
                  handleClick={handleNextPage}
                  disabled={transactionsInfo.isFetching || lastPage || !transactions}
                />
              </div>
            </div>
          </div>
          <div className={`${styles.row2}`}>
            <TransactionsTable
              skeleton={{ showSkeleton: skeleton }}
              transactions={transactions}
              icon={<TransactionShape />}
              limit={LIMIT}
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
                  disabled={transactionsInfo.isFetching || lastPage || !transactions}
                />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};
