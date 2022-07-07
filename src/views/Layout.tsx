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
    console.log('subdomain detected: ', detectedSubdomain);
    switch (detectedSubdomain) {
      case 'testnet' || 'testnet-staging':
        changeNetwork('testnet');
        break;
      case 'mainnet1' || 'mainnet1-staging':
      default:
        changeNetwork('mainnet1');
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
