export interface User {
  usuarioId?: any;
  image: string;
  fechaNacimiento?: string;
  apellido: string;
  correo: string;
  genero?: string;
  estadoUsuario?: number;
  roles: string[];
  nombre: string;
  pais?: number;
}
