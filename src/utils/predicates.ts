import dayjs from "dayjs";

export type IWaitForPredicate = {
  timeoutMs?: number;
  retryDelayMs?: number;
  throwOnTimeout?: boolean;
};

export const waitForPredicate = async (
  predicate: () => Promise<boolean>,
  options?: IWaitForPredicate
) => {
  const { timeoutMs = 60 * 1000, retryDelayMs = 3 * 1000, throwOnTimeout = true } = options ?? {};

  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    try {
      const result = await predicate();

      if (result) {
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    await new Promise((r) => setTimeout(r, retryDelayMs));
  }

  if (throwOnTimeout) {
    throw new Error(
      `Unable to confirm action after ${dayjs.duration(timeoutMs).humanize()}`
    );
  }

  return false;
};