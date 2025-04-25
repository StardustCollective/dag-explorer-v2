/**
 * Limit Offset Pagination
 */

export type ILimitOffsetPaginationMeta = {
  limit?: number;
  offset?: number;
  total?: number;
};

export type ILimitOffsetPaginationSearchParams = {
  limit?: string;
  offset?: string;
};

export type ILimitOffsetPaginationTarget = {
  limit?: number;
  offset?: number;
};

export type ILimitOffsetPaginationOptions = {
  limitPagination?: ILimitOffsetPaginationTarget;
};

/**
 * Next Token Pagination
 */

export type INextTokenPaginationMeta = {
  next?: string;
  total?: number;
};

export type INextTokenPaginationSearchParams = {
  limit?: string;
  next?: string;
};

export type INextTokenPaginationTarget = {
  limit?: number;
  next?: string;
};

export type INextTokenPaginationOptions = {
  tokenPagination?: INextTokenPaginationTarget;
};
