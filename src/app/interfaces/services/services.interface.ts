export interface OptionsRequest {
  page?: number;
  size?: number;
  sortBy?: string; //fechaCreacion
  sortDirection?: string; //DESC
}

export interface DataPaginationResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}
