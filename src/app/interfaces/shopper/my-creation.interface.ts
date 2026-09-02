import { DataPaginationResponse } from "../general/services.interface";
import { ProductCreation } from "../stores/creations.interface";

export interface IMyCreationsResp extends DataPaginationResponse{
  content:          ContentMyCreation[];

}

export interface ContentMyCreation {
  id:                 number;
  creatorId:          number;
  creatorName:        string;
  creatorAvatarUrl:   string;
  visibility:         string;
  scheduledAt:        Date;
  videoRoomName:      string;
  videoRoomUrl:       string;
  videoRoomExpiresAt: Date;
  createdAt:          Date;
  roomStatus:         string;
  secondsUntilLive:   number | null;
  storeId:            number;
  storeName:          string;
  invitations:        any[];
  products:           ProductCreation[];
}


