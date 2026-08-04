export interface IJitsiResp {
  token:    string;
  message:  string;
  roomName: string;
}

export interface INotificationResp {
  notificationId: number;
  userId:         number;
  userEmail:      string;
  title:          string;
  content:        Content;
  message:        string;
  isRead:         boolean;
}

export interface Content {
  id:                 number;
  store:              StoreMessage;
  title:              string;
  users:              any[];
  status:             string;
  endDate:            Date;
  isActive:           boolean;
  isPublic:           boolean;
  products:           ProductMessage[];
  createdAt:          Date;
  createdBy:          number;
  isExpired:          boolean;
  startDate:          Date;
  updatedAt:          Date;
  updatedBy:          number;
  visibility:         string;
  description:        null;
  isScheduled:        boolean;
  observacion:        null;
  productCount:       number;
  videoRoomUrl:       string;
  contentDetail:      string;
  videoRoomName:      string;
  isCurrentlyValid:   boolean;
  publicationOption:  string;
  videoRoomExpiresAt: Date;
}

export interface ProductMessage {
  id:                 number;
  sku:                string;
  name:               string;
  badge:              null;
  brand:              null;
  sizes:              string[];
  stock:              number;
  colors:             string[];
  inStock:            boolean;
  featured:           boolean;
  isActive:           boolean;
  mediaUrls:          string[];
  productUrl:         string;
  salesCount:         number;
  description:        string;
  hasDiscount:        boolean;
  currentPrice:       number;
  mainImageUrl:       string;
  discountPrice:      number;
  originalPrice:      number;
  characteristics:    string[];
  discountPercentage: number;
}

export interface StoreMessage {
  id:      number;
  url:     string;
  name:    string;
  phone:   string;
  ubigeo:  string;
  address: string;
  logoUrl: string;
}
