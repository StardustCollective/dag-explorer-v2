import { createBrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';

import { Layout } from './views/Layout';
import { HomeView } from './views/HomeView/HomeView';
import { NotFound } from './views/NotFoundView/NotFound';
import { TransactionsWrapper } from './views/TransactionsView/Wrappers/TransactionsWrapper';
import { TransactionDetailsWrapper } from './views/TransactionsView/Wrappers/TransactionDetailsWrapper';
import { SnapshotsWrapper } from './views/SnapshotsView/Wrappers/SnapshotsWrapper';
import { SnapshotDetailsWrapper } from './views/SnapshotsView/Wrappers/SnapshotDetailsWrapper';
import { BlockDetailsWrapper } from './views/BlocksView/Wrappers/BlockDetailsWrapper';
import { AddressDetailsWrapper } from './views/AddressView/Wrappers/AddressDetailsWrapper';
import { NodeExplorerWrapper } from './views/NodeExplorerView/NodeExplorerWrapper';
import { Search } from './components/Search/Search';
import { MetagraphsView } from './views/MetagraphsView/view';
import { MetagraphDetailsView } from './views/MetagraphsView/views';
import { MetagraphSnapshotDetailsView } from './views/MetagraphsView/views/MetagraphSnapshotDetailsView/view';

export const router = Sentry.wrapCreateBrowserRouter(createBrowserRouter)([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Layout renderError />,
    children: [
      { index: true, element: <HomeView /> },

      { path: 'metagraphs', element: <MetagraphsView /> },
      { path: 'metagraphs/:metagraphId', element: <MetagraphDetailsView /> },

      { path: 'transactions', element: <TransactionsWrapper /> },
      { path: 'metagraphs/:metagraphId/transactions', element: <TransactionsWrapper /> },

      { path: 'transactions/:transactionHash', element: <TransactionDetailsWrapper /> },
      { path: 'metagraphs/:metagraphId/transactions/:transactionHash', element: <TransactionDetailsWrapper /> },

      { path: 'snapshots', element: <SnapshotsWrapper /> },
      { path: 'metagraphs/:metagraphId/snapshots', element: <SnapshotsWrapper /> },

      { path: 'snapshots/:snapshotHeight', element: <SnapshotDetailsWrapper /> },
      { path: 'metagraphs/:metagraphId/snapshots/:snapshotOrdinal', element: <MetagraphSnapshotDetailsView /> },

      { path: 'blocks/:blockHash', element: <BlockDetailsWrapper /> },
      { path: 'metagraphs/:metagraphId/blocks/:blockHash', element: <BlockDetailsWrapper /> },

      { path: 'address/:addressId', element: <AddressDetailsWrapper /> },

      { path: 'node-explorer', element: <NodeExplorerWrapper /> },

      { path: 'search', element: <Search /> },

      { path: '*', element: <NotFound entire errorCode={'404'} /> },
    ],
  },
]);
