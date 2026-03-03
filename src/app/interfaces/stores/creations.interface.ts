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

export interface ICreationResp {
  sections:      Section[];
  totalElements: number;
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
  scheduledInfo: null;
}

export interface Metrics {
  viewerCount:        number;
  participantCount:   number;
  participantAvatars: any[];
}

export interface Store {
  id:      number;
  name:    string;
  logoUrl: null;
  url:     string;
}
