import { DataPaginationResponse } from "../general/services.interface";

export interface ICreateResq {
  title:             string;
  description:       string;
  publicationOption: string;
  contentDetail:     string;
  visibility:        string;
  startDate:         Date;
  endDate:           Date;
  status:            string;
  productIds:        number[];
  userIds:           number[];
  observacion:       string;
}

export interface Section {
  categoryName: string;
  categoryCode: string;
  totalItems:   number;
  items:        Item[];
}

export interface Item {
  id:            number;
  title:         string;
  status:        string;
  contentType:   string;
  store:         Store;
  metrics:       Metrics;
  products:      any[];
  scheduledInfo: string;
}

export interface ICreationResp extends DataPaginationResponse{
  content:          ICreationContent[];
}


export interface ICreationContent {
  categoryName: string;
  categoryCode: string;
  totalItems:   number;
  items:        Item[];
}

export interface Metrics {
  viewerCount:        number;
  participantCount:   number;
  participantAvatars: any[];
}

export interface ProductCreation {
  id:                 number;
  name:               string;
  brand:              string;
  imageUrl:           string;
  originalPrice:      number;
  offerPrice:         number;
  discountPercentage: number;
}

export interface Store {
  id:      number;
  name:    string;
  logoUrl: string;
  url:     string;
}
