interface DataFields {
  data: any;
  page: number;
  next?: string;
}

function handlePagination<TData, TFetchedData extends DataFields[]>(
  data: TData,
  setData: React.Dispatch<React.SetStateAction<TData>>,
  fetchedData: TFetchedData,
  currentPage: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  setParams: React.Dispatch<React.SetStateAction<{ limit: number; next?: string }>>,
  limit: number
) {
  const handleNextPage = () => {
    if (data) {
      setCurrentPage((p) => p + 1);
      if (fetchedData.length > 0 && currentPage + 1 <= fetchedData.length - 1) {
        setData(fetchedData[currentPage + 1].data);
      } else {
        setParams({ limit: limit, next: fetchedData[currentPage]?.next ?? '' });
      }
    }
  };
  const handlePrevPage = () => {
    if (data) {
      setCurrentPage((p) => p - 1);
      setData(fetchedData[currentPage - 1].data);
    }
  };
  return [handlePrevPage, handleNextPage];
}

const handleFetchedData = (
  setFetchedData: React.Dispatch<React.SetStateAction<DataFields[]>>,
  endpointData: any,
  currentPage: number
) => {
  setFetchedData((data) =>
    data.length === 0
      ? [{ data: endpointData.data?.data, page: currentPage, next: endpointData.data?.meta?.next }]
      : currentPage >= data.length
      ? [...data, { data: endpointData.data?.data, page: currentPage, next: endpointData.data?.meta?.next }]
      : [...data]
  );
};

export { handleFetchedData, handlePagination };
