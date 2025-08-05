import { UsuarioContent } from '@app/interfaces/admin/users.interface';

export class UserMapper {
  static mapResrtUserToUser(FormUser: any): UsuarioContent | any {
    return {
      usuario: {
        nombre: FormUser.UserName,
        apellido: FormUser.fullNamePerson,
        fechaNacimiento: FormUser.birthdate,
        numeroIdentidad: FormUser.dniPerson,
        generoIdc: FormUser.gender,
        usuarioAcceso: FormUser.accounUser,
        contrasenia: FormUser.password,
        correoElectronico: FormUser.email,
        numeroTelefono: FormUser.phone,
        direccion: FormUser.direction,
        pais: FormUser.ubigeo,
        estadoUsuarioIdc: FormUser.status === 'Activo' ? 1 : 0,
        calificacion: 5,
        observacion: FormUser.observacion ?? '',
      },
      rol: {
        id: FormUser.role,
      },
      estado: FormUser.status === 'Activo' ? 1 : 0,
      observacion: 'Asignación de rol inicial',
      usuarioCreacion: 1,
      usuarioModificacion: 1,
    };
  }
}
