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
import { getBEUrl } from '../../utils/networkUrls';

const {
  REACT_APP_MAINNET_ONE_BE_URL,
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

  const filterEndTime = (time: any) => {
    return startDate ? startDate.getTime() <= new Date(time).getTime() : false;
  };

  const [dataSet, setDataSet] = useState<{ value: string; content: string }>({
    value: 'transactions',
    content: 'Transaction history',
  });
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [downloadClicked, setDownloadClicked] = useState(false);
  const csvLink = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null);

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
        csvLink.current.link.click();
      }
    }
    setDownloadClicked(false);
  }, [data]);

  const handleDownload = async () => {
    if (startDate && endDate) {
      if (dataSet.value === 'rewards') {
        setHeaders(['date', 'amount']);
        const data = await getData(async () => {
          const result = await api.get<{
            data: {
              rewards: { rewardAmount: string; date: string }[];
              isValidator: boolean;
            };
          }>(REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/validator-nodes/' + address + '/rewards', {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          });

          const data = result.data as {
            rewards: { rewardAmount: string; date: string }[];
            isValidator: boolean;
          };
          return data.rewards.map((reward) => {
            return {
              date: new Date(reward.date).toISOString().replaceAll('/', '-'),
              amount: formatAmount(Number.parseInt(reward.rewardAmount), 8, true),
            };
          });
        });
        setData(data);
      }

      if (dataSet.value === 'transactions') {
        let URL: string;

        if (network === 'mainnet1') {
          URL = REACT_APP_MAINNET_ONE_BE_URL + '/address/' + address + '/transaction';
          setHeaders(['amount', 'checkpointBlock', 'fee', 'hash', 'receiver', 'sender', 'snapshotHash', 'timestamp']);
        } else {
          const base = getBEUrl(network)
          URL = base + '/addresses/' + address + '/transactions';
          setHeaders(['hash', 'amount', 'source', 'destination', 'fee', 'blockHash', 'snapshotOrdinal', 'timestamp']);
        }

        const data = await getData(async () => {
          try {
            const result = await api.get<any>(URL, { limit: 3370 });

            const data = result.data as Transaction[];
            return data
              .filter((tx) => {
                const date = new Date(tx.timestamp);
                const endDateToUse = new Date(endDate);
                endDateToUse.setDate(endDateToUse.getDate() + 1);
                return isWithinInterval(date, {
                  start: startDate,
                  end: endDateToUse,
                });
              })
              .map((tx) => {
                return { ...tx, amount: formatAmount(tx.amount, 8, true), fee: formatAmount(tx.fee, 8, true) };
              });
          } catch (e) {
            console.log(e);
          }
        });
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
                  dateFormat="yyyy-MM-dd"
                  className={{ inputWrapper: styles.timeinput, input: styles.inputs, label: styles.label }}
                  maxDate={new Date()}
                  icon={<img src={CalendarIcon} />}
                  placeholderText={'Select date'}
                />
                <InputRow.DatePicker
                  selected={endDate}
                  label={'End Date'}
                  disabled={!startDate}
                  variants={['indent', 'full-width']}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  filterTime={filterEndTime}
                  filterDate={filterEndTime}
                  className={{ inputWrapper: styles.timeinput, input: styles.inputs, label: styles.label }}
                  maxDate={maxDate || new Date()}
                  icon={<img src={CalendarIcon} />}
                  placeholderText={'Select date'}
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
                  ? `Transactions_from_${startDate.toISOString()}_to_${endDate.toISOString()}.csv`
                  : dataSet.value === 'rewards'
                  ? `Rewards_from_${startDate.toISOString()}_to_${endDate.toISOString()}.csv`
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
