import { useEffect, useState } from 'react';
import { useComponentVisible } from '../../../utils/clickOutside';
import { MetagraphToken } from '../../../types';
import { formatPrice } from '../../../utils/numbers';
import { ReactComponent as ChevronUpIcon } from '../../../assets/icons/chevron-up.svg';
import { ReactComponent as ChevronDownIcon } from '../../../assets/icons/chevron-down.svg';
import { ReactComponent as DefaultTokenIcon } from '../../../assets/icons/DefaultTokenIcon.svg';
import { ReactComponent as DAGToken } from '../../../assets/icons/DAGToken.svg';

import styles from './MetagraphTokensBalances.module.scss';

type MetagraphTokensBalancesProps = {
  metagraphTokens: MetagraphToken[];
  defaultOption: MetagraphToken;
};

export const MetagraphTokensBalances = ({ metagraphTokens, defaultOption }: MetagraphTokensBalancesProps) => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const [selectedMetagraphToken, setSelectedMetagraphToken] = useState<MetagraphToken>();

  useEffect(() => {
    setSelectedMetagraphToken(defaultOption);
  }, [defaultOption]);

  return (
    <>
      {selectedMetagraphToken && (
        <div className={`${styles.dropdown}`} ref={ref}>
          {
            <div
              className={styles.dropdownInput}
              tabIndex={0}
              onClick={() => setIsComponentVisible(!isComponentVisible)}
            >
              <div>
                <span className={styles.name}>{selectedMetagraphToken.name}</span>
                <span className={styles.amount}>
                  (${formatPrice(selectedMetagraphToken.balance, { usd: 100000 }, 2)} USD)
                </span>
              </div>
              {isComponentVisible ? (
                <ChevronUpIcon width={24} height={24} />
              ) : (
                <ChevronDownIcon width={24} height={24} />
              )}
            </div>
          }

          {isComponentVisible && (
            <div className={styles.dropdownContent}>
              {metagraphTokens.map((option) => (
                <div
                  className={styles.dropdownItem}
                  key={option.name}
                  onClick={() => {
                    setIsComponentVisible(!isComponentVisible);
                    setSelectedMetagraphToken(option);
                  }}
                >
                  <div className={styles.nameList}>
                    {option.icon ? (
                      <img src={option.icon} />
                    ) : option.symbol === 'DAG' ? (
                      <DAGToken />
                    ) : (
                      <DefaultTokenIcon />
                    )}
                    <span>{option.name}</span>
                  </div>
                  <div className={styles.amountList}>
                    <span>
                      {option.amount} {option.symbol}
                    </span>
                    <span>${formatPrice(option.amount, { usd: option.price }, 2)} USD</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
