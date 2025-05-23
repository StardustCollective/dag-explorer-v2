import { AxiosInstance, isAxiosError } from "axios";
import { setupCache, buildMemoryStorage } from "axios-cache-interceptor";
import axiosRetry, {
  exponentialDelay,
  isIdempotentRequestError,
  isNetworkOrIdempotentRequestError,
} from "axios-retry";

export const isAxiosTimeoutError = (error: any) => {
  if (!isAxiosError(error)) {
    return false;
  }

  if (error.code !== "ECONNABORTED") {
    return false;
  }

  return true;
};

export const addRetryBehavior = (
  axiosInstance: AxiosInstance,
  delayExpFactor = 2.5 * 1000
): AxiosInstance => {
  axiosRetry(axiosInstance, {
    retries: 3,
    retryCondition: (error) => {
      return (
        isNetworkOrIdempotentRequestError(error) ||
        (isIdempotentRequestError(error) && isAxiosTimeoutError(error))
      );
    },
    retryDelay: (retryCount, error) => {
      return exponentialDelay(retryCount, error, delayExpFactor);
    },
    onRetry: (retryCount, error, config) => {
      console.log(`Request Retry: ${retryCount}`);
      console.log(`Error: ${error.status} - ${error.message}`);
      console.log(
        `Request: ${config.method} - ${
          (config.baseURL ?? "") + (config.url ?? "")
        }`
      );
    },
    shouldResetTimeout: true,
  });
  return axiosInstance;
};

export const addCacheBehavior = (
  axiosInstance: AxiosInstance,
  storage = buildMemoryStorage(false, 60 * 1000, false)
) => {
  return setupCache(axiosInstance, {
    storage,
  });
};
