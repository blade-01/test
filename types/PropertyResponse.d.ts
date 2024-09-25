interface PropertyResponse<T> {
  result: boolean;
  message: string;
  data: {
    properties: T<any>;
    pagination: Pagination;
  };
}
