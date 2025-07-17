import { DataPaginationResponse } from '../services/services.interface';

export interface RolesResponse extends DataPaginationResponse {
  content: RolesContent[];
}

export interface RolesContent {
  id: number;
  denominacion: string;
  descripcion: null | string;
  estadoIdc: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  usuarioCreacion: number | null;
  usuarioModificacion: null;
  observacion: null | string;
  esVisible: boolean;
}
