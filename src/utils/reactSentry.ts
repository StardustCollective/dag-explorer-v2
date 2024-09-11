import React from 'react';
import * as Sentry from '@sentry/react';

import { useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from 'react-router-dom';

export const initializeReactSentryLib = () => {
  Sentry.init({
    dsn: 'https://481bfa5448825e6b5020fdaa3ec33af7@o4507929519063040.ingest.us.sentry.io/4507929521356800',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      /^https:\/\/[a-zA-Z0-9]+\.execute-api\.[a-zA-Z0-9-]+\.amazonaws\.com/,
      /^https:\/\/[a-zA-Z0-9]+\.cloudfront\.net/,
    ],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
};
