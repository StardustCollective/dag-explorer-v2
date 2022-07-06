import { useContext, useEffect, useRef, useState } from 'react';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import styles from './ExportModal.module.scss';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import { subDays, format, isWithinInterval } from 'date-fns';
import { Button } from '../Buttons/Button';
import { CSVLink } from 'react-csv';
import { api } from '../../utils/api';
import { Network } from '../../constants';
import { Transaction } from '../../types';
import { formatAmount } from '../../utils/numbers';

const { REACT_APP_TESTNET_BLOCK_EXPLORER_URL, REACT_APP_MAINNET_ONE_BE } = process.env;

export const ExportModal = ({ open, onClose, address }: { open: boolean; onClose: () => void; address: string }) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;

  const [range, setRange] = useState([{ startDate: subDays(new Date(), 7), endDate: new Date(), key: 'selection' }]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const refDateRange = useRef(null);

  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [downloadClicked, setDownloadClicked] = useState(false);
  const csvLink = useRef<HTMLButtonElement>();

  const getTransactionData = async (network: Network) => {
    let URL = '';

    if (network === 'mainnet1') {
      URL = REACT_APP_MAINNET_ONE_BE + '/address/' + address + '/transaction';
      setHeaders(['amount', 'checkpointBlock', 'fee', 'hash', 'receiver', 'sender', 'snapshotHash', 'timestamp']);
    } else {
      URL = REACT_APP_TESTNET_BLOCK_EXPLORER_URL + '/addresses/' + address + '/transactions';
      setHeaders(['hash', 'amount', 'source', 'destination', 'fee', 'blockHash', 'snapshotOrdinal', 'timestamp']);
    }

    await api
      .get<Transaction[]>(URL, { limit: 3370 })
      .then((r) => {
        const transformed = r
          .filter((tx) => {
            const date = new Date(tx.timestamp);
            return isWithinInterval(date, { start: range[0].startDate, end: range[0].endDate });
          })
          .map((tx) => {
            return { ...tx, amount: formatAmount(tx.amount, 8, true), fee: formatAmount(tx.fee, 8, true) };
          });
        setData(transformed);
      })
      .catch((e) => console.log(e));
    setDownloadClicked(true);
  };

  useEffect(() => {
    if (downloadClicked) {
      if (csvLink && csvLink.current) {
        const link: CSVLink = csvLink.current;
        link.link.click();
      }
    }
    setDownloadClicked(false);
  }, [data]);

  useEffect(() => {
    document.addEventListener('keydown', hideOnEscape, true);
    document.addEventListener('click', hideOnClickOutside, true);
  }, []);

  const hideOnEscape = (e) => {
    if (e.key === 'Escape') {
      setOpenCalendar(false);
    }
  };

  const hideOnClickOutside = (e) => {
    if (refDateRange.current && !refDateRange.current.contains(e.target)) {
      setOpenCalendar(false);
    }
  };

  const handleDownload = async () => {
    await getTransactionData(network);
  };

  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.innerContainer}>
          <div className={styles.modalHeader}>
            <h6 className={styles.title}>Export .csv data</h6>
            <div onClick={onClose} className={styles.close}>
              X
            </div>
          </div>
          <div className={styles.modalContent}>
            <div className={`${styles.text} ${styles.description}`}>
              Each export is capped at 3,370 transactions. For larger datasets, run multiple exports with shorter time
              ranges, such as quartely.
            </div>
            <div className={styles.dateSelection}>
              <div className={styles.dateFrame}>
                <div className={`${styles.text} ${styles.flexRow}`}>
                  Selected date range:
                  <div className={styles.bold}>{`${format(range[0].startDate, 'MM/dd/yyyy')} to ${format(
                    range[0].endDate,
                    'MM/dd/yyyy'
                  )}`}</div>
                </div>
                <Button variant={styles.changeRange} onClick={() => setOpenCalendar((openCalendar) => !openCalendar)}>
                  Change Range
                </Button>
              </div>
              <div ref={refDateRange}>
                {openCalendar && (
                  <DateRange
                    ranges={range}
                    onChange={(item) => setRange([item.selection])}
                    editableDateInputs
                    moveRangeOnFirstSelection={false}
                    direction="horizontal"
                    className={styles.calendarElement}
                  />
                )}
              </div>
            </div>
            <div className={styles.buttons}>
              <Button variant={styles.close} onClick={onClose}>
                Cancel
              </Button>
              <Button variant={styles.download} onClick={handleDownload}>
                Download CSV
              </Button>
              <CSVLink
                ref={csvLink}
                className={styles.download}
                data={data}
                headers={headers}
                filename={`Transactions_from_${range[0].startDate.toLocaleDateString()}_to_${range[0].endDate.toLocaleDateString()}`}
                target="_blank"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
