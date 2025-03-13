"use client";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import { parseNumberOrDefault } from "@/utils";

export type IClientPaginationHookOptions = {
  pageSize?: number;
  page?: number;
  total?: number;
  onPageChange?: (page: number) => void;
};

export type IClientPaginationHook = {
  page: number;
  pageSize: number;
  limit: number;
  offset: number;
  total: number | null;
  totalPages: number;
  goNextPage: (numPages?: number) => number;
  goPrevPage: (numPages?: number) => number;
  goPage: (numPages: number) => number;
};

export const useClientPagination = Object.assign(
  ({
    page = 0,
    pageSize = 5,
    total,
    onPageChange,
  }: IClientPaginationHookOptions) => {
    const _total = total;

    const actions: IClientPaginationHook = {
      page,
      pageSize,
      limit: pageSize,
      offset: pageSize * page,
      get total() {
        return _total ?? null;
      },
      get totalPages() {
        return actions.total ? Math.ceil(actions.total / pageSize) : 0;
      },
      goNextPage: (numPages = 1) => {
        return actions.goPage(page + numPages);
      },
      goPrevPage: (numPages = 1) => {
        return actions.goPage(page - numPages);
      },
      goPage: (page: number) => {
        if (actions.totalPages) {
          page = Math.min(actions.totalPages - 1, page);
        }

        page = Math.max(0, page);

        onPageChange && onPageChange(page);
        return page;
      },
    };

    return actions;
  },
  {
    parseQueryPage: function (page: any) {
      return parseNumberOrDefault(page, 1) - 1;
    },
    parseQueryPageInContext: function (paramName: string) {
      const searchParams = useSearchParams();
      return this.parseQueryPage(searchParams.get(paramName));
    },
    replaceToPageInContext: function (
      page: number,
      paramName: string,
      pathname: string,
      searchParams: ReadonlyURLSearchParams
    ) {
      const _searchParams = new URLSearchParams(searchParams);
      _searchParams.set(paramName, String(page + 1));
      return `${pathname}?${_searchParams.toString()}`;
    },
  }
);
