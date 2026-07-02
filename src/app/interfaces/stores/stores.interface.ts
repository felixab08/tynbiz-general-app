import { DataPaginationResponse } from "../general/services.interface";

export interface IStoresResp {
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
  businessSettings:    any;
  industry:            null;
  currency:            string;
  timezone:            string;
  createdAt:           Date;
  updatedAt:           Date;
}


export interface IPublicStore extends DataPaginationResponse{
  content:          ContentPublicStore[];
}

export interface ContentPublicStore {
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
  website:             string;
  isFavorite:          boolean;
  totalFavorites:      number;
  logo:                string;
  createdAt:           Date;
}
