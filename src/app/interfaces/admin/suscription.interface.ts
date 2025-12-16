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
