import { DataPaginationResponse } from '../services/services.interface';
import { RolesContent } from './roles.interface';

export interface UsuariosResponse extends DataPaginationResponse {
  content:       UsuarioContent[];
  page:          number;
  size:          number;
  totalElements: number;
  totalPages:    number;
  first:         boolean;
  last:          boolean;
  hasNext:       boolean;
  hasPrevious:   boolean;
}

export interface UsuarioContent {
  id:                  number;
  usuario:             Usuario;
  rol:                 RolesContent;
  fechaCreacion:       Date | string;
  fechaModificacion:   Date | string;
  usuarioCreacion:     number;
  usuarioModificacion: number;
  observacion:         string;
  estado: number;
}

export interface Usuario {
  id:                   number;
  nombre:               string;
  apellido:             string;
  usuarioAcceso:        string;
  correoElectronico:    string;
  numeroIdentidad:      string;
  numeroTelefono:       string;
  estadoUsuarioIdc:     number;
  direccion:            string;
  generoIdc:            number;
  pais:                 number;
  fechaNacimiento:      Date | string;
  calificacion:         number;
  fechaCreacion:        Date | string;
  fechaModificacion:    Date | string;
  usuarioCreacion:      number;
  usuarioModificacion:  number;
  urlImg:               string;
  observacion:          string;
  estadoUsuario:        string;
  confirmacionDosPasos: boolean;
  contrasenia:        string;
}
