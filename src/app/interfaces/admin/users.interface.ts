import { DataPaginationResponse } from '../services/services.interface';

export interface UsuariosResponse extends DataPaginationResponse {
  content: Content[];
}

export interface Content {
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
  calificacion: null;
  fechaCreacion: Date;
  fechaModificacion: Date;
  usuarioCreacion: number;
  usuarioModificacion: number;
  urlImg: any;
  observacion: null;
  roles: string;
  twoConfirmation: boolean;
}
