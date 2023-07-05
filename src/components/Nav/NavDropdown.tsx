import { useContext } from 'react';
import { Network } from '../../constants';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { useComponentVisible } from '../../utils/clickOutside';
import ArrowDown from '../../assets/icons/ArrowDown.svg';
import styles from './Nav.module.scss';

export const NavDropdown = () => {
  const { network, changeNetwork } = useContext(NetworkContext) as NetworkContextType;

  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const options: Partial<Record<Network, string>> = {
    mainnet: 'Mainnet 2.0',
    mainnet1: 'Mainnet 1.0',
    testnet: 'Testnet 2.0',
    integrationnet: 'Integrationnet 2.0',
  };
  return (
    <div className={`${styles.dropdown} ${styles.navSeparator}`} ref={ref}>
      {
        <div className={styles.network} tabIndex={0} onClick={() => setIsComponentVisible(!isComponentVisible)}>
          {options[network]} <img src={ArrowDown} />
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
