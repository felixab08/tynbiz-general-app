import { DataPaginationResponse } from '../services/services.interface';
import { RolesContent } from './roles.interface';

export interface UsuariosResponse extends DataPaginationResponse {
  content: UsuarioContent[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UsuarioContent {
  id: number;
  usuario: Usuario;
  rol: RolesContent;
  fechaCreacion: Date;
  fechaModificacion: Date;
  usuarioCreacion: number;
  usuarioModificacion: number;
  observacion: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  usuarioAcceso: string;
  correoElectronico: string;
  numeroIdentidad: string;
  numeroTelefono: string;
  estadoUsuarioIdc: number;
  direccion: string;
  generoIdc: number;
  pais: number;
  fechaNacimiento: Date;
  calificacion: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  usuarioCreacion: number;
  usuarioModificacion: number;
  urlImg: string;
  observacion: string;
  estadoUsuario: string;
  confirmacionDosPasos: boolean;
}
