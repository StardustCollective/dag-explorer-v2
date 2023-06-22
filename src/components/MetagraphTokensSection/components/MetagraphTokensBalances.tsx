import { useComponentVisible } from '../../../utils/clickOutside';
import { AddressMetagraphResponse } from '../../../types';
import { formatAmount } from '../../../utils/numbers';
import { ReactComponent as ChevronUpIcon } from '../../../assets/icons/chevron-up.svg';
import { ReactComponent as ChevronDownIcon } from '../../../assets/icons/chevron-down.svg';
import { ReactComponent as DefaultTokenIcon } from '../../../assets/icons/DefaultTokenIcon.svg';
import { ReactComponent as DAGToken } from '../../../assets/icons/DAGToken.svg';

import styles from './MetagraphTokensBalances.module.scss';

type MetagraphTokensBalancesProps = {
  metagraphTokens: AddressMetagraphResponse[];
  selectedOption: AddressMetagraphResponse;
  setSelectedMetagraph: (metagraph: AddressMetagraphResponse) => void;
  setTokenChanged: (changed: boolean) => void;
};

export const MetagraphTokensBalances = ({
  metagraphTokens,
  selectedOption,
  setSelectedMetagraph,
  setTokenChanged,
}: MetagraphTokensBalancesProps) => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  return (
    <>
      {selectedOption && (
        <div className={`${styles.dropdown}`} ref={ref}>
          {
            <div
              className={styles.dropdownInput}
              tabIndex={0}
              onClick={() => setIsComponentVisible(!isComponentVisible)}
            >
              <div>
                <span className={styles.name}>{selectedOption.metagraphName}</span>
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
                  key={option.metagraphName}
                  onClick={() => {
                    setIsComponentVisible(!isComponentVisible);
                    setSelectedMetagraph(option);
                    setTokenChanged(true);
                  }}
                >
                  <div className={styles.nameList}>
                    {option.metagraphIcon ? (
                      <img src={option.metagraphIcon} />
                    ) : option.metagraphSymbol === 'DAG' ? (
                      <DAGToken />
                    ) : (
                      <DefaultTokenIcon />
                    )}
                    <span>{option.metagraphSymbol}</span>
                  </div>
                  {option.metagraphId !== 'ALL_METAGRAPHS' && (
                    <div className={styles.amountList}>
                      <span>{formatAmount(option.balance, 6, false, option.metagraphSymbol)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
