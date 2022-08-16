import { ArrowButton } from '../Buttons/ArrowButton';
import styles from './TableController.module.scss';

const TableController = ({
  handlePrevPage,
  handleNextPage,
  firstPage,
  lastPage,
}: {
  handlePrevPage: () => void;
  handleNextPage: () => void;
  firstPage: boolean;
  lastPage: boolean;
}) => {
  return (
    <div className={styles.controllerRow}>
      <div className={styles.showButton}></div>
      <div className={styles.arrows}>
        <ArrowButton handleClick={handlePrevPage} disabled={firstPage} />
        <ArrowButton forward handleClick={handleNextPage} disabled={lastPage} />
      </div>
    </div>
  );
};

export default TableController;
