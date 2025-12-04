import { DataPaginationResponse } from '../general/services.interface';

export interface RolesResponse extends DataPaginationResponse {
  content: RolesContent[];
}

export interface RolesContent {
  id:                 number;
  roleName:           string;
  description:        string;
  createdAt:          Date;
  status:             string;
  enabledUsersCount:  number;
}
