import { DataPaginationResponse } from '../services/services.interface';

export interface RolesResponse extends DataPaginationResponse {
  content: RolesContent[];
}

export interface RolesContent {
  id:                            number;
  denominacion:                  string;
  descripcion:                   null;
  estadoIdc:                     number;
  fechaCreacion:                 Date;
  fechaModificacion:             Date;
  usuarioCreacion:               null;
  usuarioModificacion:           null;
  observacion:                   null;
  esVisible:                     boolean;
  cantidadUsuariosHabilitados:   null;
  cantidadUsuariosInhabilitados: null;
}
