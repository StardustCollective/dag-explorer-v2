import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { Nav } from '../components/Nav/Nav';
import styles from './Layout.module.scss';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { PricesProvider } from '../context/PricesContext';
import { detectSubdomain } from '../utils/network';
import { NetworkContext, NetworkContextType } from '../context/NetworkContext';

export const Layout = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  const { theme } = useContext(ThemeContext);
  const { changeNetwork } = useContext(NetworkContext) as NetworkContextType;

  useEffect(() => {
    const detectedSubdomain = detectSubdomain();
    switch (detectedSubdomain) {
      case 'testnet-staging':
      case 'testnet':
        changeNetwork('testnet');
        break;
      case 'mainnet1-staging':
      case 'mainnet1':
        changeNetwork('mainnet1');
        break;
      default:
        changeNetwork('mainnet');
        break;
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PricesProvider>
        <div className={`${styles.container} ${theme}`}>
          <Nav />
          <Header />
          <Outlet />
          <Footer />
        </div>
      </PricesProvider>
    </QueryClientProvider>
  );
};
