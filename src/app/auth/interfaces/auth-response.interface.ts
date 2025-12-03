import { User } from './user.interface';


export interface AuthResponse {
  accessToken:  string;
  refreshToken: string;
  tokenType:    string;
  expiresIn:    number;
  user:         User;
}
