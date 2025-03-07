import { parseNumberOrDefault } from "@/utils";

export type IServerPaginationHookOptions = {
  pageSize?: number;
  page?: number;
};

export type IServerPaginationHook = {
  page: number;
  pageSize: number;
  limit: number;
  offset: number;
};

export const useServerPagination = Object.assign(
  ({ page = 0, pageSize = 5 }: IServerPaginationHookOptions) => {
    const actions: IServerPaginationHook = {
      page,
      pageSize,
      limit: pageSize,
      offset: pageSize * page,
    };

    return actions;
  },
  {
    parseQueryPage: function (page: any) {
      return parseNumberOrDefault(page, 1) - 1;
    },
    parseQueryPageInProps: async function (
      props: { searchParams?: Promise<Record<any, any>> },
      paramName: string
    ) {
      const params = await props.searchParams;
      return this.parseQueryPage(params?.[paramName]);
    },
  }
);
