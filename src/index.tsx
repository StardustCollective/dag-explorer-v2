import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomeView } from './views/HomeView/HomeView';
import { Transactions } from './views/TransactionsView/Transactions';
import { Layout } from './views/Layout';
import { Snapshots } from './views/SnapshotsView/Snapshots';
import { ThemeProvider } from './context/ThemeContext';
import { TransactionDetail } from './views/TransactionDetailView/TransactionDetail';
import { AddressDetails } from './views/AddressView/AddressDetails';
import { SnapshotDetails } from './views/SnapshotsView/SnapshotDetails';
import { NotFound } from './views/NotFoundView/NotFound';
import { BlockDetails } from './views/BlocksView/BlockDetails';
import { NetworkProvider } from './context/NetworkContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <ThemeProvider>
      <NetworkProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomeView />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="transactions/:transactionHash" element={<TransactionDetail />} />
            <Route path="snapshots" element={<Snapshots />} />
            <Route path="snapshots/:snapshotHeight" element={<SnapshotDetails />} />
            <Route path="address/:addressId" element={<AddressDetails />} />
            <Route path="blocks/:blockHash" element={<BlockDetails />} />
            <Route path="*" element={<NotFound entire />} />
          </Route>
        </Routes>
      </NetworkProvider>
    </ThemeProvider>
  </BrowserRouter>
);
