// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

process.env.NODE_ENV === "production" &&
  Sentry.init({
    dsn: "https://4e424ea04c6c4056355f0ef8e33ed353@o310458.ingest.us.sentry.io/4509242941636608",

    // Add optional integrations for additional features
    integrations: [Sentry.replayIntegration()],

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Define how likely Replay events are sampled.
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,

    // Define how likely Replay events are sampled when an error occurs.
    replaysOnErrorSampleRate: 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    beforeSend: (event, hint) => {
      const error = hint.originalException;

      if (
        error &&
        typeof error === "object" &&
        (error as any).skipSentryReporting === true
      ) {
        return null;
      }

      return event;
    },
  });

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
