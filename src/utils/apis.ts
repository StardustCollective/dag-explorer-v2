export const getNextTokenCallFullResults = async <T>(
  predicate: (params: { limit: number; nextToken?: string }) => Promise<{
    results: T[];
    nextToken?: string;
  }>,
  options?: { limit?: number }
): Promise<T[]> => {
  const limit = options?.limit ?? 100;
  const results: T[] = [];
  let nextToken: string | undefined;

  do {
    const { results: batch, nextToken: newNextToken } = await predicate({
      limit,
      nextToken,
    });

    results.push(...batch);
    nextToken = newNextToken;
  } while (nextToken);

  return results;
};

export const getLimitOffsetCallFullResults = async <T>(
  predicate: (params: { limit: number; offset: number }) => Promise<{
    results: T[];
    total: number;
  }>,
  options?: { limit?: number }
): Promise<T[]> => {
  const limit = options?.limit ?? 100;
  const results: T[] = [];
  let offset = 0;
  let total: number | undefined;

  do {
    const { results: batch, total: newTotal } = await predicate({
      limit,
      offset,
    });

    if (total === undefined) {
      total = newTotal;
    }

    results.push(...batch);
    offset += batch.length;
  } while (offset < (total ?? 0));

  return results;
};
