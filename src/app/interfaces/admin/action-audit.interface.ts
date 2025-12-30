import { DataPaginationResponse } from "../general/services.interface";

export interface IActionAuditResponse extends DataPaginationResponse{
  content:          AuditContent[];
}

export interface AuditContent {
  id:                number;
  roleName:          string;
  userId?:            number;
  userDisplayName:   string;
  actionDate:        Date;
  moduleName:        string;
  actionDescription: string;
}


