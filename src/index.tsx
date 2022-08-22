import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomeView } from './views/HomeView/HomeView';
import { Layout } from './views/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { NotFound } from './views/NotFoundView/NotFound';
import { NetworkProvider } from './context/NetworkContext';
import { SnapshotsWrapper } from './views/SnapshotsView/Wrappers/SnapshotsWrapper';
import { SnapshotDetailsWrapper } from './views/SnapshotsView/Wrappers/SnapshotDetailsWrapper';
import { TransactionsWrapper } from './views/TransactionsView/Wrappers/TransactionsWrapper';
import { TransactionDetailsWrapper } from './views/TransactionsView/Wrappers/TransactionDetailsWrapper';
import { BlockDetailsWrapper } from './views/BlocksView/Wrappers/BlockDetailsWrapper';
import { AddressDetailsWrapper } from './views/AddressView/Wrappers/AddressDetailsWrapper';
import { Search } from './components/Search/Search';
import { NodeExplorerWrapper } from './views/NodeExplorerView/NodeExplorerWrapper';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <ThemeProvider>
      <NetworkProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomeView />} />
            <Route path="transactions" element={<TransactionsWrapper />} />
            <Route path="transactions/:transactionHash" element={<TransactionDetailsWrapper />} />
            <Route path="snapshots" element={<SnapshotsWrapper />} />
            <Route path="snapshots/:snapshotHeight" element={<SnapshotDetailsWrapper />} />
            <Route path="address/:addressId" element={<AddressDetailsWrapper />} />
            <Route path="blocks/:blockHash" element={<BlockDetailsWrapper />} />
            <Route path="node-explorer" element={<NodeExplorerWrapper />} />
            <Route path="search" element={<Search />} />
            <Route path="*" element={<NotFound entire errorCode={'404'} />} />
          </Route>
        </Routes>
      </NetworkProvider>
    </ThemeProvider>
  </BrowserRouter>
);
