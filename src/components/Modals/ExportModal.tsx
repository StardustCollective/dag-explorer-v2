import { useContext, useEffect, useRef, useState } from 'react';
import cls from 'classnames';
import { isWithinInterval } from 'date-fns';
import { CSVLink } from 'react-csv';

import styles from './ExportModal.module.scss';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { Button } from '../Buttons/Button';
import { api } from '../../utils/api';
import { Transaction } from '../../types';
import { formatAmount } from '../../utils/numbers';
import { InputRow } from '../InputRow';
import 'react-datepicker/dist/react-datepicker.css';
import { Dropdown } from '../Dropdown';
import { ImpulseSpinner } from 'react-spinners-kit';
import CalendarIcon from '../../assets/icons/CalendarBlank.svg';

const {
  REACT_APP_TESTNET_BE_URL,
  REACT_APP_MAINNET_ONE_BE_URL,
  REACT_APP_MAINNET_TWO_BE_URL,
  REACT_APP_DAG_EXPLORER_API_URL,
} = process.env;

export const ExportModal = ({
  open,
  onClose,
  address,
  hasRewards,
  loadingRewards,
}: {
  open: boolean;
  onClose: () => void;
  address: string;
  hasRewards: boolean;
  loadingRewards: boolean;
}) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [requesting, setRequesting] = useState(false);

  const filterPassedTime = (time: any) => new Date().getTime() < new Date(time).getTime();

  const filterEndTime = (time: any) => (startDate ? startDate.getTime() + 1 < new Date(time).getTime() : false);
  const [dataSet, setDataSet] = useState<{ value: string; content: string }>({
    value: 'transactions',
    content: 'Transaction history',
  });
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [downloadClicked, setDownloadClicked] = useState(false);
  const csvLink = useRef<HTMLButtonElement>();

  const getData = async (request: () => Promise<any>) => {
    setRequesting(true);
    const dataToSet = await request();
    setDownloadClicked(true);
    setRequesting(false);
    return dataToSet;
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

  const handleDownload = async () => {
    if (startDate && endDate) {
      if (dataSet.value === 'rewards') {
        setHeaders(['date', 'amount']);
        const data = await getData(() =>
          api
            .get<any>(REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/validator-nodes/' + address + '/rewards', {
              startDate: startDate.toLocaleDateString(),
              endDate: endDate.toLocaleDateString(),
            })
            .then((r) => {
              const data = r.data as {
                rewards: { rewardAmount: string; date: string }[];
                isValidator: boolean;
              };
              const transformed = data.rewards.map((reward) => {
                return {
                  date: new Date(reward.date).toLocaleDateString().replaceAll('/', '-'),
                  amount: formatAmount(Number.parseInt(reward.rewardAmount), 8, true),
                };
              });
              return transformed;
            })
            .catch((e) => console.log(e))
        );
        setData(data);
      }
      if (dataSet.value === 'transactions') {
        let URL: string;

        if (network === 'mainnet1') {
          URL = REACT_APP_MAINNET_ONE_BE_URL + '/address/' + address + '/transaction';
          setHeaders(['amount', 'checkpointBlock', 'fee', 'hash', 'receiver', 'sender', 'snapshotHash', 'timestamp']);
        } else {
          const base = network === 'testnet' ? REACT_APP_TESTNET_BE_URL : REACT_APP_MAINNET_TWO_BE_URL;
          URL = base + '/addresses/' + address + '/transactions';
          setHeaders(['hash', 'amount', 'source', 'destination', 'fee', 'blockHash', 'snapshotOrdinal', 'timestamp']);
        }

        const data = await getData(() =>
          api
            .get<any>(URL, { limit: 3370 })
            .then((r) => {
              const data = r.data as Transaction[];
              const transformed = data
                .filter((tx) => {
                  const date = new Date(tx.timestamp);
                  return isWithinInterval(date, { start: startDate, end: endDate });
                })
                .map((tx) => {
                  return { ...tx, amount: formatAmount(tx.amount, 8, true), fee: formatAmount(tx.fee, 8, true) };
                });
              return transformed;
            })
            .catch((e) => console.log(e))
        );
        setData(data);
      }
    }
  };

  useEffect(() => {
    if (startDate) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + 365);
      setMaxDate(date > new Date() ? new Date() : date);
    }
  }, [startDate]);

  useEffect(() => {
    setDataSet({
      value: 'transactions',
      content: 'Transaction history',
    });
    setStartDate(null);
    setEndDate(null);
  }, []);

  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.innerContainer}>
          <div className={styles.modalHeader}>
            <h6 className={styles.title}>Export .csv data</h6>
          </div>
          <div className={`${styles.text} ${styles.description}`}>
            Each export is capped at 3,370 transactions. For larger datasets, run multiple exports with shorter time
            ranges, such as quartely. Exports are limited to 1 year.
          </div>
          <div className={styles.modalContent}>
            <div className={styles.dateSelection}>
              {loadingRewards && (
                <div className={styles.separate}>
                  <ImpulseSpinner frontColor={'#ffffff'} backColor={'#174cd3'} size={30} />
                </div>
              )}
              {hasRewards && (
                <div className={styles.dropdownWrapper}>
                  <div className={styles.text}>Select data set to export</div>
                  <Dropdown
                    options={[
                      { value: 'transactions', content: 'Transaction history' },
                      { value: 'rewards', content: 'Rewards history' },
                    ].map((option) => ({
                      value: option,
                      content: option.content,
                    }))}
                    onOptionClick={(value) => setDataSet(value)}
                    className={{ button: styles.dropdownButton }}
                  >
                    {dataSet.content}
                  </Dropdown>
                </div>
              )}
              <div className={styles.dateSelectors}>
                <InputRow.DatePicker
                  selected={startDate}
                  label={'Start Date'}
                  variants={['indent', 'full-width']}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="MM/dd/yyyy"
                  filterTime={filterPassedTime}
                  className={{ inputWrapper: styles.timeinput, input: styles.inputs, label: styles.label }}
                  maxDate={new Date()}
                  icon={<img src={CalendarIcon} />}
                />
                <InputRow.DatePicker
                  selected={endDate}
                  label={'End Date'}
                  disabled={!startDate}
                  variants={['indent', 'full-width']}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="MM/dd/yyyy"
                  filterTime={filterEndTime}
                  className={{ inputWrapper: styles.timeinput, input: styles.inputs, label: styles.label }}
                  maxDate={maxDate || new Date()}
                  icon={<img src={CalendarIcon} />}
                />
              </div>
            </div>
            <div className={styles.buttons}>
              <Button variant={cls(styles.button, styles.close)} onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant={cls(styles.button, styles.download)}
                disabled={!startDate || !endDate || requesting}
                onClick={() => !requesting && handleDownload()}
              >
                {requesting ? <ImpulseSpinner frontColor={'#ffffff'} backColor={'#174cd3'} size={30} /> : 'Download'}
              </Button>
            </div>
          </div>
          <CSVLink
            ref={csvLink}
            className={styles.download}
            data={data}
            headers={headers}
            filename={
              startDate && endDate
                ? dataSet.value === 'transactions'
                  ? `Transactions_from_${startDate.toLocaleDateString()}_to_${endDate.toLocaleDateString()}.csv`
                  : dataSet.value === 'rewards'
                  ? `Rewards_from_${startDate.toLocaleDateString()}_to_${endDate.toLocaleDateString()}.csv`
                  : ''
                : ''
            }
            target="_blank"
          />
        </div>
      </div>
    </div>
  );
};
