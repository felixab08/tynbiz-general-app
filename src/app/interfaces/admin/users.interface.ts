import { DataPaginationResponse } from '../general/services.interface';
import { RolesContent } from './roles.interface';

export interface UsuariosResponse extends DataPaginationResponse {
  content:       UsuarioContent[];
}



export interface UsuarioContent {
  id:        number;
  firstName: string;
  lastName:  string;
  email:     string;
  role:      string;
  status:    string;
  createdAt: Date;
  image?: string;
}

