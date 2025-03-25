export type IPaginationTargetResponse = {
  limit?: number;
  offset?: number;
  total?: number;
};

export type IPaginationTarget = {
  limit?: number;
  offset?: number;
};

export type INextTokenPaginationTarget = {
  limit?: number;
  next?: string;
};

export type IPaginationOptions = { pagination?: IPaginationTarget };

export type INextTokenPaginationOptions = {
  tokenPagination?: INextTokenPaginationTarget;
};
