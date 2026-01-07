
export interface IProductStore {
  id:                 number;
  name:               string;
  sku:                string;
  currentPrice:       number;
  originalPrice:      number;
  discountPercentage: number;
  stock:              number;
  inStock:            boolean;
  mainImageUrl:       string;
  isActive:           boolean;
  featured:           boolean;
}


export interface IProduct {
  id:                 number;
  storeId:            number;
  storeName:          string;
  name:               string;
  description:        string;
  sku:                string;
  stock:              number;
  categoryCatId:      number;
  sizes:              string[];
  colors:             string[];
  originalPrice:      number;
  discountPrice:      number;
  currentPrice:       number;
  discountPercentage: number;
  mediaUrls:          string[];
  productUrl:         string;
  isActive:           boolean;
  featured:           boolean;
  inStock:            boolean;
  hasDiscount:        boolean;
  createdAt:          Date;
  updatedAt:          Date;
  createdBy:          number;
  updatedBy:          number;
  observacion:        string;
}




