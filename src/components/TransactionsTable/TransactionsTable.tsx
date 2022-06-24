import { Transaction } from '../../api/types';
import { HeaderRow } from './HeaderRow';
import { TransactionRow } from './TransactionRow';
import styles from './TransactionsTable.module.scss';

export const TransactionsTable = ({ transactions, icon }: { transactions: Transaction[]; icon?: string }) => {
  let tableRows =
    transactions &&
    transactions.length > 0 &&
    transactions.map((tx) => <TransactionRow key={tx.hash} tx={tx} icon={icon} />);
  if (!tableRows) {
    tableRows = [<TransactionRow key={0} tx={null} />];
  }
  return (
    <div className={styles.container}>
      <HeaderRow />
      {tableRows}
    </div>
  );
};
