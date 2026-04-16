export interface IStatusWordpress {
  id:         number;
  platform:   string;
  shopDomain: string;
  status:     string;
  lastSyncAt: Date;
  createdAt:  Date;
}

export interface IconnectWordpress {
  authorizationUrl: string;
  expiresAt:        Date;
}
