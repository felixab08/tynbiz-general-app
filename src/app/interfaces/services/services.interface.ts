export interface OptionsRequest {
  page?:          number; //0
  size?:          number; //5 cantidad de registros por pagina
  sortBy?:        string; //fechaCreacion
  sortDirection?: string; //DESC
  nombre?:        string; //DESC
  fechaInicio?:   string; //2025-01-31 año-mes-dia
  fechaFin?:      string; //2025-12-31 año-mes-dia
  estado?:        string; //1 Activo, 0 Inactivo
}

export interface DataPaginationResponse {
  page:           number;
  size:           number;
  totalElements:  number;
  totalPages:     number;
  first:          boolean;
  last:           boolean;
  hasNext:        boolean;
  hasPrevious:    boolean;
}
