export interface ListInterface<T> {
  data: T[];
}

export interface LimitationListInterface<T> extends ListInterface<T> {
  count: number;
  offset: number;
  totalCount?: number;
}
