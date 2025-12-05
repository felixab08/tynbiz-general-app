import { DataPaginationResponse } from "../general/services.interface";

export interface IRequestDemo extends DataPaginationResponse{
  content:          RequestDemoContent[];
}

export interface RequestDemoContent {
  id:          number;
  displayName: string;
  storeUrl:    string;
  email:       string;
  statusCatId: number;
  statusName:  string;
  createdAt:   Date;
  lastName?:    string;
  firstName?:   string;
  phoneNumber?: string;
}


export interface IDemoCreate {
  firstName:   string;
  lastName:    string;
  email:       string;
  phoneNumber: string;
  storeName:   string;
  storeUrl:    string;
  message:     string;
}
