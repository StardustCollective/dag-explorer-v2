import { useContext, useState } from 'react';
import { Network } from '../../constants';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import styles from './Nav.module.scss';

export const Dropdown = () => {
  const { network, changeNetwork } = useContext(NetworkContext) as NetworkContextType;
  const [open, setOpen] = useState(false);
  const options: Record<Network, string> = { mainnet1: 'Mainnet 1.0', mainnet2: 'Mainnet 2.0', testnet: 'Testnet' };
  return (
    <div className={`${styles.dropdown} ${styles.navSeparator}`}>
      {
        <button className={styles.network} onClick={() => setOpen(!open)}>
          {options[network]} <i className={`${styles.arrow} ${styles.down}`}></i>
        </button>
      }

      {open && (
        <div className={styles.dropdownContent}>
          {Object.keys(options).map((option) =>
            option === network ? null : (
              <div
                className={styles.dropdownItem}
                key={option}
                onClick={() => {
                  changeNetwork(option as Network);
                  setOpen(!open);
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
