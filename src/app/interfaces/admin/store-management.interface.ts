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
