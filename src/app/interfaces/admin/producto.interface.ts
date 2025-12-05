import { DataPaginationResponse } from "../general/services.interface";

export interface IProductoResponse extends DataPaginationResponse {
  content:          ProductoContent[];
}

export interface ProductoContent {
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

export interface OptionsProductRequest {
  storeId?:       number;
  categoryCatId?: number;
  searchTerm?:    string;
  minPrice?:      number;
  maxPrice?:      number;
  isActive?:      boolean;
  featured?:      boolean;
  inStock?:       boolean;
  hasDiscount?:   boolean;
  page:          number;
  size:          number;
  sortBy?:        string;
  sortDirection?: string;

}

export interface IProductoRequest {
  storeId:       number;
  name:          string;
  description:   string;
  sku:           string;
  stock:         number;
  categoryCatId: number;
  sizes:         string[];
  colors:        string[];
  originalPrice: number;
  discountPrice: number;
  mediaUrls:     string[];
  productUrl:    string;
  isActive:      boolean;
  featured:      boolean;
  observacion:   string;
}
