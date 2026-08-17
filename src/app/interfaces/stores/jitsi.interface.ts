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
  content:        ContentNotification;
  message:        string;
  isRead:         boolean;
}

export interface ContentNotification {
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
  description?:        string;
  isScheduled?:        boolean;
  observacion?:        string;
  productCount?:       number;
  contentDetail?:      string;
  videoRoomName?:      string;
  isCurrentlyValid?:   boolean;
  publicationOption?:  string;
  videoRoomExpiresAt?: Date | string;
  senderName?:  string;
  senderEmail?:  string;
  senderAvatarUrl?:  string;
}

export interface ProductMessage {
  id:                  number;
  name:                string;
  imageUrl:           string;
  mainImageUrl:       string;
  sku?:                string;
  badge?:              string;
  brand?:              string;
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

