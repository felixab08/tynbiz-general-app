export interface OptionsRequest {
  page?:          number; //0
  size?:          number; //5 cantidad de registros por pagina
  sort?:        string; //fechaCreacion
  sortDirection?: 'desc' | 'asc'; //DESC
  nombre?:        string; //DESC
  startDate?:   string; //2025-01-31 año-mes-dia
  endDate?:      string; //2025-12-31 año-mes-dia
  status?:        string; //1 ACTIVE, 0 INACTIVE
  // Planes
  isActive? :      boolean // true / false
  isPublic? :      boolean // true / false
  searchTerm? :      string // buscar por nombre o descripcion
  ubigeoId? :      string // buscar por nombre o descripcion
  keyword? :      string // buscar por nombre o descripcion
  tab? :      string // buscar por nombre o descripcion
}

export interface DataPaginationResponse {
  page:             number;
  size:             number;
  totalElements:    number;
  totalPages:       number;
  first:            boolean;
  last:             boolean;
  hasNext:          boolean;
  hasPrevious:      boolean;
  numberOfElements: number;
  empty:            boolean;
}
