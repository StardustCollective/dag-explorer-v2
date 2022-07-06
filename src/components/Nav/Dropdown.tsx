import { useContext } from 'react';
import { Network } from '../../constants';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { useComponentVisible } from '../../utils/clickOutside';
import styles from './Nav.module.scss';

export const Dropdown = () => {
  const { network, changeNetwork } = useContext(NetworkContext) as NetworkContextType;

  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const options: Record<Network, string> = { mainnet1: 'Mainnet 1.0', testnet: 'Testnet 2.0' };
  return (
    <div className={`${styles.dropdown} ${styles.navSeparator}`} ref={ref}>
      {
        <div className={styles.network} tabIndex={0} onClick={() => setIsComponentVisible(!isComponentVisible)}>
          {options[network]} <i className={`${styles.arrow} ${styles.down}`}></i>
        </div>
      }

      {isComponentVisible && (
        <div className={styles.dropdownContent}>
          {Object.keys(options).map((option) =>
            option === network ? null : (
              <div
                className={styles.dropdownItem}
                key={option}
                onClick={() => {
                  changeNetwork(option as Network);
                  setIsComponentVisible(!isComponentVisible);
                }}
              >
                {options[option]}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
