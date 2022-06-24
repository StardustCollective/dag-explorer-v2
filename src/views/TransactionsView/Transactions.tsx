import { useEffect, useState } from 'react';
import { Transaction } from '../../api/types';
import { ArrowButton } from '../../components/Buttons/ArrowButton';
import { Subheader } from '../../components/Subheader/Subheader';
import { SkeletonTransactionsTable } from '../../components/TransactionsTable/SkeletonTransactionsTable';
import { TransactionsTable } from '../../components/TransactionsTable/TransactionsTable';
import { IconType } from '../../constants';
import styles from './Transactions.module.scss';
import TransactionShape from '../../assets/icons/TransactionShape.svg';
import { NotFound } from '../NotFoundView/NotFound';
import { useGetAllTransactions } from '../../api/block-explorer/transaction';

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
  //const [lastPage, setLastPage] = useState(false);
  const [error, setError] = useState<string>(undefined);
  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    if (!transactionsInfo.isFetching && !transactionsInfo.isError) {
      setTransactions(transactionsInfo.data);
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
    }
  };

  return (
    <>
      <Subheader text={'Transactions'} item={IconType.Transaction} />
      {error === '404' ? (
        <NotFound entire={false} />
      ) : (
        <main className={`${styles.fullWidth3}`}>
          <div className={`${styles.row1}`}>
            <div className={`${styles.flexRowBottom}`}>
              <span />
              <div className={styles.arrows}>
                <ArrowButton handleClick={handlePrevPage} disabled />
                <ArrowButton forward handleClick={handleNextPage} disabled />
              </div>
            </div>
          </div>
          <div className={`${styles.row2}`}>
            {skeleton ? (
              <SkeletonTransactionsTable rows={LIMIT} />
            ) : (
              <TransactionsTable transactions={transactions} icon={TransactionShape} />
            )}
          </div>
          <div className={`${styles.row3}`}>
            <div className={`${styles.flexRowBottom}`}>
              <span />

              <div className={styles.arrows}>
                {/*handlePagination*/}
                <ArrowButton handleClick={() => handlePrevPage()} disabled={page < 0 || !isPrev} />
                <ArrowButton forward handleClick={() => handleNextPage()} disabled={page < 0 || !isPrev} />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};
