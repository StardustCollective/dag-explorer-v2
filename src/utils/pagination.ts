import { useEffect, useState } from 'react';

interface DataFields {
  data: any;
  page: number;
  next?: string;
  lastPage?: boolean;
}

/**
 * @deprecated please use react-query constructs and the usePagination() hook
 */
export function handlePagination<TData, TFetchedData extends DataFields[]>(
  data: TData,
  setData: React.Dispatch<React.SetStateAction<TData>>,
  fetchedData: TFetchedData,
  currentPage: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  setParams: React.Dispatch<React.SetStateAction<{ limit: number; next?: string }>>,
  setLastPage: React.Dispatch<React.SetStateAction<boolean>>,
  setSkeleton: React.Dispatch<React.SetStateAction<boolean>>,
  limit: number
) {
  const handleNextPage = () => {
    if (data) {
      setCurrentPage((p) => p + 1);
      if (fetchedData.length > 0 && currentPage + 1 <= fetchedData.length - 1) {
        setData(fetchedData[currentPage + 1].data);
        setLastPage(!fetchedData[currentPage + 1].next);
        setSkeleton(false);
      } else {
        setParams({ limit: limit, next: fetchedData[currentPage]?.next ?? '' });
        setSkeleton(true);
      }
    } else {
      handlePrevPage(true);
    }
    if (fetchedData[currentPage]?.lastPage) {
      setSkeleton(false);
      setLastPage(true);
    }
  };

  const handlePrevPage = (forceLastPage = false) => {
    if (fetchedData[currentPage - 1]) {
      setCurrentPage((p) => p - 1);
      setData(fetchedData[currentPage - 1].data);
      setLastPage(false);
    }
    if (forceLastPage) {
      setCurrentPage((p) => p + 1);
      setLastPage(true);
      setSkeleton(false);
      if (fetchedData[currentPage - 2]) {
        fetchedData[currentPage - 2].lastPage = true;
      }
    }
  };

  return [handlePrevPage, handleNextPage];
}

/**
 * @deprecated please use react-query constructs and the usePagination() hook
 */
export const handleFetchedData = (
  setFetchedData: React.Dispatch<React.SetStateAction<DataFields[]>>,
  endpointData: any,
  currentPage: number,
  setLastPage: React.Dispatch<React.SetStateAction<boolean>>,
  resetPagination?: boolean
) => {
  if (endpointData.data?.data) {
    setFetchedData((data) =>
      data.length === 0 || resetPagination
        ? [
            {
              data: endpointData.data?.data,
              page: currentPage,
              next: endpointData.data?.meta?.next,
              lastPage: !endpointData.data?.meta?.next,
            },
          ]
        : currentPage >= data.length
        ? [
            ...data,
            {
              data: endpointData.data?.data,
              page: currentPage,
              next: endpointData.data?.meta?.next,
              lastPage: !endpointData.data?.meta?.next,
            },
          ]
        : [...data]
    );
  }
  setLastPage(!endpointData.data?.meta?.next);
};

export const usePagination = (pageSize = 10, defaultPage = 0) => {
  const [totalItems, setTotalItems] = useState<number | null>(0);
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  const totalPages = totalItems ? Math.ceil(totalItems / currentPageSize) : null;

  const actions = {
    currentPage,
    currentPageSize,
    limit: currentPageSize,
    offset: currentPageSize * currentPage,
    totalPages,
    goNextPage: (numPages = 1) => {
      return actions.goPage(currentPage + numPages);
    },
    goPreviousPage: (numPages = 1) => {
      return actions.goPage(currentPage - numPages);
    },
    goPage: (page: number) => {
      if (totalPages) {
        page = Math.min(totalPages - 1, page);
      }

      page = Math.max(0, page);

      setCurrentPage(page);
      return page;
    },
    setPageSize: (size: number) => {
      setCurrentPage(0);
      setCurrentPageSize(size);
    },
    setTotalItems,
  };

  useEffect(() => {
    if (currentPageSize !== pageSize) {
      actions.setPageSize(pageSize);
    }
  }, [pageSize]);

  return actions;
};

export const useNextTokenPagination = (pageSize = 10) => {
  const [totalItems, setTotalItems] = useState<number | null>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [pageTokens, setPageTokens] = useState<Record<number, string | null>>({});

  const totalPages = totalItems ? Math.ceil(totalItems / currentPageSize) : null;

  const actions = {
    currentPage,
    currentPageSize,
    limit: currentPageSize,
    pageToken: pageTokens[currentPage] ?? null,
    nextPageToken: pageTokens[currentPage + 1] ?? null,
    totalPages,
    goNextPage: (numPages = 1) => {
      return actions.goPage(currentPage + numPages);
    },
    goPreviousPage: (numPages = 1) => {
      return actions.goPage(currentPage - numPages);
    },
    goPage: (page: number) => {
      if (totalPages) {
        page = Math.min(totalPages - 1, page);
      }

      page = Math.max(0, page);

      setCurrentPage(page);
      return page;
    },
    setPageSize: (size: number) => {
      setCurrentPage(0);
      setPageTokens({});
      setCurrentPageSize(size);
    },
    setNextPageToken: (token: string) => {
      setPageTokens((s) => ({ ...s, [currentPage + 1]: token }));
    },
    setTotalItems,
  };

  useEffect(() => {
    if (currentPageSize !== pageSize) {
      actions.setPageSize(pageSize);
    }
  }, [pageSize]);

  return actions;
};
