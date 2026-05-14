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


export interface ItemCreation {
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
  items:        ItemCreation[];
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
  imageUrl:           string | string[];
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


export interface ICreationStoreRespo {
  content:          ICreationStoreContent[];
  page:             number;
  size:             number;
  totalElements:    number;
  totalPages:       number;
  first:            boolean;
  last:             boolean;
  hasNext:          boolean;
  hasPrevious:      boolean;
  numberOfElements: number;
  empty:            boolean;
}

export interface ICreationStoreContent {
  id:                number;
  title:             string;
  isOferta:          boolean;
  isEnVivo:          boolean;
  status:            string;
  viewCount:         number;
  availableDuration: null;
  startDate:         null;
  productImages:     string[];
}
