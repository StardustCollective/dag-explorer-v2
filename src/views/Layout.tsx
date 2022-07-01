import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { Nav } from '../components/Nav/Nav';
import styles from './Layout.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { PricesProvider } from '../context/PricesContext';

export const Layout = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  const { theme } = useContext(ThemeContext);

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
