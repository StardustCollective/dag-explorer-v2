import { Outlet, useRouteError } from 'react-router-dom';

import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { NavHeader } from '../components/Nav/component.module';
import styles from './Layout.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { PricesProvider } from '../context/PricesContext';

import clsx from 'clsx';
import { ErrorView } from './ErrorView/view';

export const Layout = ({ renderError }: { renderError?: boolean }) => {
  const { theme } = useContext(ThemeContext);

  const error = useRouteError();

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
