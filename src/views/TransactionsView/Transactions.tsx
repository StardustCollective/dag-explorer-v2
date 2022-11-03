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
import { FetchedData, Params } from '../../types/requests';
import { handleFetchedData, handlePagination } from '../../utils/pagination';

const LIMIT = 14;

export const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[] | undefined>(undefined);
  const [params, setParams] = useState<Params>({ limit: LIMIT });
  const [fetchedData, setFetchedData] = useState<FetchedData<Transaction>[] | undefined>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const transactionsInfo = useGetAllTransactions(params);
  const [skeleton, setSkeleton] = useState(false);
  const [lastPage, setLastPage] = useState(false);

  useEffect(() => {
    if (!transactionsInfo.isFetching && !transactionsInfo.isLoading && !transactionsInfo.isError) {
      if (transactionsInfo.data?.data.length > 0) {
        setTransactions(transactionsInfo.data.data);
      }
      handleFetchedData(setFetchedData, transactionsInfo, currentPage);
      setSkeleton(false);
    }
  }, [transactionsInfo.isLoading, transactionsInfo.isFetching]);

  const [handlePrevPage, handleNextPage] = handlePagination<Transaction[], FetchedData<Transaction>[]>(
    transactions,
    setTransactions,
    fetchedData,
    currentPage,
    setCurrentPage,
    setParams,
    setLastPage,
    setSkeleton,
    LIMIT
  );

  return (
    <>
      <Subheader text={'Transactions'} item={IconType.Transaction} />
      {transactionsInfo.isError ? (
        <NotFound entire={false} errorCode={transactionsInfo.error.message} />
      ) : (
        <main className={`${styles.fullWidth3}`}>
          <div className={`${styles.row1}`}>
            <div className={`${styles.flexRowBottom}`}>
              <span />
              <div className={styles.arrows}>
                <ArrowButton handleClick={handlePrevPage} disabled={currentPage === 0 || skeleton} />
                <ArrowButton forward handleClick={handleNextPage} disabled={skeleton || lastPage} />
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
                <ArrowButton handleClick={handlePrevPage} disabled={currentPage === 0 || skeleton} />
                <ArrowButton forward handleClick={handleNextPage} disabled={skeleton || lastPage} />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};
