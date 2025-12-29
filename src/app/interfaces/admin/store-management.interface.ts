import { DataPaginationResponse } from "../general/services.interface";

export interface IStoreManagementResponse extends DataPaginationResponse {
  content:          StoreManagementContent[];
}

export interface StoreManagementContent {
  id:                  number;
  businessName:        string;
  tradeName:           string;
  displayName:         string;
  email:               string;
  city:                null;
  country:             string;
  status:              null;
  onboardingCompleted: boolean;
  industry:            null;
  createdAt:           Date;
}

export interface IStoreManagementSearch extends DataPaginationResponse{
  content:          StoreSeachContent[];

}

export interface StoreSeachContent {
  id:           number;
  displayName:  string;
  storeUrl:     string;
  departamento: string;
  categoryName: string;
  statusName:   string;
  planType:     string;
  totalSpent:   string;
  createdAt:    Date;
}

export interface IStore {
  id:                  number;
  businessName:        string;
  tradeName:           string;
  displayName:         string;
  ruc:                 string;
  email:               string;
  phone:               string;
  storeUrl:            string;
  address:             string;
  ubigeoId:            string;
  departamento:        string;
  provincia:           string;
  distrito:            string;
  country:             string;
  fullAddress:         string;
  status:              null;
  onboardingCompleted: boolean;
  businessSettings:    null;
  industry:            null;
  currency:            string;
  timezone:            string;
  createdAt:           Date;
  updatedAt:           Date;
}
