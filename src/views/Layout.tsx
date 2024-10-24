import { Outlet, useRouteError } from 'react-router-dom';

import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { NavHeader } from '../components/Nav/component.module';
import styles from './Layout.module.scss';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { PricesProvider } from '../context/PricesContext';
import { detectSubdomain, getNetworkContextFromLocation } from '../utils/network';
import { NetworkContext, NetworkContextType } from '../context/NetworkContext';
import clsx from 'clsx';
import { ErrorView } from './ErrorView/view';
import { HgtpNetwork } from '../constants';

export const Layout = ({ renderError }: { renderError?: boolean }) => {
  const { theme } = useContext(ThemeContext);
  const { changeNetwork } = useContext(NetworkContext) as NetworkContextType;

  const error = useRouteError();

  useEffect(() => {
    const detectedSubdomain = detectSubdomain();
    switch (detectedSubdomain) {
      case 'testnet-staging':
      case 'testnet':
        changeNetwork(HgtpNetwork.TESTNET);
        break;
      case 'integrationnet-staging':
      case 'integrationnet':
        changeNetwork(HgtpNetwork.INTEGRATIONNET);
        break;
      case 'mainnet1-staging':
      case 'mainnet1':
        changeNetwork(HgtpNetwork.MAINNET_1);
        break;
      default:
        changeNetwork(HgtpNetwork.MAINNET);
        break;
    }
  }, []);

  useEffect(() => {
    const networkContext = getNetworkContextFromLocation();
  }, []);

  return (
    <PricesProvider>
      <div className={clsx(styles.container, theme)}>
        <NavHeader />
        <Header />
        <Outlet />
        {renderError && <ErrorView error={error} />}
        <Footer />
      </div>
    </PricesProvider>
  );
};
