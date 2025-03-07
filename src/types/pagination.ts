export type IPaginationTarget = {
  limit?: number;
  offset?: number;
};

export type IPaginationTargetResponse = {
  limit?: number;
  offset?: number;
  total?: number;
};

export type IPaginationOptions = { pagination?: IPaginationTarget };
