
export interface User {
  id:            number;
  email:         string;
  firstName:     string;
  lastName:      string;
  fullName:      string;
  phone:         string;
  role:          string;
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
}

export interface BusinessSettings {
}
