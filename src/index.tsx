import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import { RouterProvider } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { NetworkProvider } from './context/NetworkContext';
import { initializeReactGaLib } from './utils/reactGoogleAnalytics';
import { router } from './routes';
import { TanstackQueryProvider } from './context/TanstackQueryContext';

initializeReactGaLib();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <TanstackQueryProvider>
    <ThemeProvider>
      <NetworkProvider>
        <RouterProvider router={router} />
      </NetworkProvider>
    </ThemeProvider>
  </TanstackQueryProvider>
);
