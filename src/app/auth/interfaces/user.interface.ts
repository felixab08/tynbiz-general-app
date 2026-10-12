
/**
 * Roles Emitidos por el backend.
 *
 * Tipar el rol como unión (en vez de `string`) convierte los errores de rol en
 * errores de compilación en lugar de comparaciones silenciosamente falsas.
 * `SUPER-ADMIN` está contemplado desde la V2: hoy debe comportarse igual que
 * `ADMIN` en toda la capa de presentación.
 */
export type UserRole = 'ADMIN' | 'SUPER-ADMIN' | 'STORE_OWNER' | 'CLIENT';

export interface User {
  id:            number;
  email:         string;
  firstName:     string;
  lastName:      string;
  fullName:      string;
  phone:         string;
  role:          UserRole;
  status:        string;
  storeId?:      number;
  emailVerified: boolean;
  lastLoginAt:   Date;
  createdAt:     Date;
  avatarUrl?:    string;
  photoUrl?:     string;
}

export interface IUserStore {
  id:                  number;
  businessName:        string;
  tradeName:           string;
  displayName:         string;
  ruc:                 string;
  email:               string;
  phone:               string;
  storeUrl:            string;
  logo:                null;
  address:             string;
  ubigeoId:            string;
  departamento:        string;
  provincia:           string;
  distrito:            string;
  country:             string;
  fullAddress:         string;
  status:              null;
  onboardingCompleted: boolean;
  businessSettings:    BusinessSettings;
  industry:            null;
  currency:            string;
  timezone:            string;
  createdAt:           Date;
  updatedAt:           Date;
  category:            string;
  categoryDisplayName: string;
  planName:            string;
  planType:            string;
}

export interface BusinessSettings {
}
