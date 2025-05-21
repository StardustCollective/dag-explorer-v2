import * as Sentry from "@sentry/nextjs";
import { Instrumentation } from "next";

export async function register() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_RUNTIME === "nodejs"
  ) {
    await import("../sentry.server.config");
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_RUNTIME === "edge"
  ) {
    await import("../sentry.edge.config");
  }
}

export const onRequestError: Instrumentation.onRequestError = (
  error,
  errorRequest,
  errorContext
) => {
  console.log("Inst Error");
  console.dir(error, { depth: 5 });

  return Sentry.captureRequestError(error, errorRequest, errorContext);
};
