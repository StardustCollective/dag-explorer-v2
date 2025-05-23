import * as Sentry from "@sentry/nextjs";
import { isAxiosError } from "axios";
import { Instrumentation } from "next";
import { configure } from "safe-stable-stringify";

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
  const stringify = configure({
    deterministic: false,
    maximumDepth: 3,
  });

  console.log(`Page Request Error (start)`);
  console.log(stringify({ routePath: errorContext.routePath }));
  if (isAxiosError(error)) {
    console.log("Axios Request");
    console.log(
      stringify({
        url:
          String(error.config?.baseURL ?? "") + String(error.config?.url ?? ""),
        params: error.config?.params,
        headers: error.config?.headers,
        data: error.config?.data,
      })
    );
    console.log("Axios Response");
    console.log(
      stringify({
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
      })
    );
  } else {
    console.dir(error, { depth: 5 });
  }
  console.log(`Page Request Error (end)`);

  return Sentry.captureRequestError(error, errorRequest, errorContext);
};
