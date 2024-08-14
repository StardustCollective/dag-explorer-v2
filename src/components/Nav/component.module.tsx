import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../assets/icons/HeaderLogo.svg';
import { ReactComponent as ChevronDownIcon } from '../../assets/icons/chevron-down.svg';
import { ReactComponent as ChevronUpIcon } from '../../assets/icons/chevron-up.svg';
import { ReactComponent as MenuIcon } from '../../assets/icons/Menu.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/Close.svg';

import { NetworkContext } from '../../context/NetworkContext';
import { SelectMenu } from '../SelectMenu/component';

import styles from './component.module.scss';
import { Network } from '../../constants';
import { ISelectMenuItemProps } from '../SelectMenu/components/SelectMenuItem/component';

const NetworkOptions: (ISelectMenuItemProps & { network: Network })[] = [
  { content: 'MainNet 2.0', network: 'mainnet' },
  { content: 'IntegrationNet 2.0', network: 'integrationnet' },
  { content: 'TestNet 2.0', network: 'testnet' },
  { content: 'MainNet 1.0', network: 'mainnet1' },
];

export const NavHeader = () => {
  const { network, changeNetwork } = useContext(NetworkContext);
  const [networkSelectOpen, setNetworkSelectOpen] = useState(false);
  const [linksSelectOpen, setLinksSelectOpen] = useState(false);

  return (
    <nav className={styles.main}>
      <div className={styles.track}>
        <Link to={'/'} className={styles.leftSide}>
          <img src={Logo} />
          <span>DAG Explorer</span>
        </Link>
        <div className={styles.rightSide}>
          <div className={styles.desktopControls}>
            {network !== 'mainnet1' && (
              <Link className={styles.metagraphsLink} to="/metagraphs">
                Metagraphs
              </Link>
            )}
            <Link className={styles.metagraphsLink} to="/node-explorer">
              Node Explorer
            </Link>
            <div className={styles.networkSelector} onClick={() => setNetworkSelectOpen((s) => !s)}>
              {NetworkOptions.find((option) => option.network === network)?.content}
              {networkSelectOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              <SelectMenu
                open={networkSelectOpen}
                options={NetworkOptions.map((option) => ({
                  ...option,
                  onClick: () => changeNetwork(option.network),
                  selected: option.network === network,
                }))}
              />
            </div>
          </div>

          <div className={styles.mobileControls}>
            <div className={styles.networkSelector} onClick={() => setNetworkSelectOpen((s) => !s)}>
              {NetworkOptions.find((option) => option.network === network)?.content}
              {networkSelectOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              <SelectMenu
                open={networkSelectOpen}
                options={NetworkOptions.map((option) => ({
                  ...option,
                  onClick: () => changeNetwork(option.network),
                  selected: option.network === network,
                }))}
              />
            </div>
            <div className={styles.linksSelector} onClick={() => setLinksSelectOpen((s) => !s)}>
              {linksSelectOpen ? <CloseIcon /> : <MenuIcon />}
              <SelectMenu
                open={linksSelectOpen}
                options={[
                  network !== 'mainnet1' && { content: 'Metagraphs', linkTo: '/metagraphs' },
                  { content: 'Node Explorer', linkTo: '/node-explorer' },
                ].filter(Boolean)}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
