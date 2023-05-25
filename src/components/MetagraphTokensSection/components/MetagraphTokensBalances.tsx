import { useEffect, useState } from 'react';
import { useComponentVisible } from '../../../utils/clickOutside';
import { MetagraphToken } from '../../../types';
import { formatPrice } from '../../../utils/numbers';

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
        <div className={`${styles.dropdown} ${styles.navSeparator}`} ref={ref}>
          {
            <div
              className={styles.dropdownInput}
              tabIndex={0}
              onClick={() => setIsComponentVisible(!isComponentVisible)}
            >
              <div>
                <span className={styles.name}>{selectedMetagraphToken.name}</span>
                <span className={styles.amount}>(${selectedMetagraphToken.balance} USD)</span>
              </div>
              <i className={`${styles.arrow} ${styles.down}`}></i>
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
                    <img src={option.icon} />
                    <span>{option.name}</span>
                    </div>
                  <div className={styles.amountList}>
                    <span>{option.amount} {option.symbol}</span>
                    <span>${formatPrice(option.amount, {usd: option.price}, 2)} USD</span>
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
