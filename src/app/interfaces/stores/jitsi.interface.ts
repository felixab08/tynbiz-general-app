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
  type?:               string;
  hostName?:           string;
  roomId?:             number;
  roomName?:           string;
  videoRoomUrl?:       string;
  products?:           ProductMessage[];
  id?:                 number;
  store?:              StoreMessage;
  title?:              string;
  users?:              any[];
  status?:             string;
  endDate?:            Date | string;
  isActive?:           boolean;
  isPublic?:           boolean;
  createdAt?:          Date | string;
  createdBy?:          number;
  isExpired?:          boolean;
  startDate?:          Date | string;
  updatedAt?:          Date | string;
  updatedBy?:          number;
  visibility?:         string;
  description?:        string | null;
  isScheduled?:        boolean;
  observacion?:        string | null;
  productCount?:       number;
  contentDetail?:      string;
  videoRoomName?:      string;
  isCurrentlyValid?:   boolean;
  publicationOption?:  string;
  videoRoomExpiresAt?: Date | string;
}

export interface ProductMessage {
  id:                  number;
  name:                string;
  imageUrl?:           string | null;
  mainImageUrl?:       string | null;
  sku?:                string;
  badge?:              string | null;
  brand?:              string | null;
  sizes?:              string[];
  stock?:              number;
  colors?:             string[];
  inStock?:            boolean;
  featured?:           boolean;
  isActive?:           boolean;
  mediaUrls?:          string[];
  productUrl?:         string;
  salesCount?:         number;
  description?:        string;
  hasDiscount?:        boolean;
  currentPrice?:       number;
  discountPrice?:      number;
  originalPrice?:      number;
  characteristics?:    string[];
  discountPercentage?: number;
}

export interface StoreMessage {
  id?:      number;
  url?:     string;
  name?:    string;
  phone?:   string;
  ubigeo?:  string;
  address?: string;
  logoUrl?: string;
}

