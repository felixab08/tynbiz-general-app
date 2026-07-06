
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
