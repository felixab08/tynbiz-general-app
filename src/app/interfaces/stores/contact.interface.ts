import { DataPaginationResponse } from "../general/services.interface";

export interface IContactResp extends DataPaginationResponse {
  content:          ContentContact[];
}

export interface ContentContact {
  id:                 number;
  calendarId:         number;
  calendarName:       string;
  storeId:            number;
  storeName:          string;
  customerUserId:     string;
  customerName:       string;
  customerEmail:      string;
  appointmentDate:    string;
  startTime:          string;
  endTime:            string;
  status:             'PENDIENTE' | 'CONFIRMADA' | 'RECHAZADA' | 'COMPLETADA' | 'FINALIZADA';
  notes:              string;
  trackingToken:      string;
  confirmedAt:        string;
  cancelledAt:        string;
  cancellationReason: string;
  createdAt:          Date;
  updatedAt:          Date;
  videoRoomName:      string;
  videoRoomUrl:       string;
  videoRoomExpiresAt: string;
  customerAvatarUrl: string;
}
