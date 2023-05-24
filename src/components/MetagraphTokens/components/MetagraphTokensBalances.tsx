import { useEffect, useState } from 'react';
import { useComponentVisible } from '../../../utils/clickOutside';
import styles from './MetagraphTokensBalances.module.scss';
import { MetagraphToken } from '../../../types';

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
                  <span className={styles.name}>{option.name}</span>
                  <span className={styles.amount}>(${option.balance} USD)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
