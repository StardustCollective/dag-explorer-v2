export type ISearchTarget = {
  search?: string;
  sort?: string;
  sortOrder?: "ASC" | "DESC";
};

export type ISearchOptions = { search?: ISearchTarget };
