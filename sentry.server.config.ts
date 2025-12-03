// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// import * as Sentry from "@sentry/nextjs";

// Sentry.init({
//   dsn: "https://4e424ea04c6c4056355f0ef8e33ed353@o310458.ingest.us.sentry.io/4509242941636608",

//   // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
//   tracesSampleRate: 1,

//   // Setting this option to true will print useful information to the console while you're setting up Sentry.
//   debug: false,

//   beforeSend: (event, hint) => {
//     const error = hint.originalException;

//     if (
//       error &&
//       typeof error === "object" &&
//       (error as any).skipSentryReporting === true
//     ) {
//       return null;
//     }

//     return event;
//   },
// });

export {};
