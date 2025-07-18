import { DataPaginationResponse } from '../services/services.interface';

export interface UsersActionsResponse extends DataPaginationResponse {
  content: UserActionContent[];
}

export interface UserActionContent {
  id: number;
  fechaCreacion: Date;
  usuarioCreacion: null;
  observacion: string;
  entidadId: number;
  accion: string;
  entidad: string;
  usuarioNombre: string;
  usuarioRol: string;
}
