import { DataPaginationResponse } from "../general/services.interface";

export interface ISuscriptionResponse extends DataPaginationResponse{
  content:          SuscriptionContent[];
}

export interface SuscriptionContent {
  id:            number;
  displayName:   string;
  storeUrl:      string;
  requestDate:   Date;
  businessEmail: string;
  status:        string;
  statusName:    string;
}

export interface ISuscription {
  id:             number;
  businessName:   string;
  ruc:            string;
  displayName:    string;
  storeUrl:       string;
  storeCategory:  string;
  ubigeoId:       string;
  address:        string;
  departamento:   string;
  provincia:      string;
  distrito:       string;
  businessEmail:  string;
  businessPhone:  string;
  firstName:      string;
  lastName:       string;
  documentType:   string;
  documentNumber: string;
  planId:         number;
  planName:       string;
  status:         string;
  statusName:     string;
  requestDate:    Date;
}
