export interface UsuariosResponse {
  content: Content[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Content {
  id: number;
  nombre: null | string;
  apellido: null | string;
  usuarioAcceso: string;
  correoElectronico: null | string;
  numeroIdentidad: null | string;
  numeroTelefono: null | string;
  estadoUsuarioIdc: number;
  direccion: null | string;
  generoIdc: number | null;
  pais: number | null;
  fechaNacimiento: Date | null;
  calificacion: null;
  fechaCreacion: Date;
  fechaModificacion: Date;
  usuarioCreacion: number;
  usuarioModificacion: number;
  urlImg: null;
  observacion: null;
  roles: string;
  twoConfirmation: boolean;
}
