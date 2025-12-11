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
