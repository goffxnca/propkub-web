export interface paginatedItemsResponse<T> {
  items: T[];
  total_count: number;
  page: number;
  per_page: number;
}
