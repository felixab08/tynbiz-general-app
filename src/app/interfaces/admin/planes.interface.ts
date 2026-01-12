import { DataPaginationResponse } from "../general/services.interface";


export interface IPlanResponse extends DataPaginationResponse{
  content:          PlanContent[];
}

export interface PlanContent {
  id:           number;
  name:         string;
  statusName:   string;
  price:        string;
  billingCycle: string;
  promotion:    string;
  description:  string;
  createdAt:    Date;
}

export interface IPlan {
  id:                  number;
  name:                string;
  description:         string;
  currency:            string;
  price:               number;
  billingCycleCatId:   number;
  billingCycleDisplay: string;
  freeTrialMonths:     number;
  promotionalLabel:    string;
  pricePerUse:         number;
  features:            string[];
}

export interface IplanRequest {
  name:                    string;
  description:             string;
  billingCycle:            string;
  currency:                string;
  price:                   number;
  isActive:                boolean;
  hasPromotion:            boolean;
  discountPercentage?:      number;
  discountDays?:            number;
  freeTrialMonths?:         number;
  pricePerUse?:             number;
  maxUsers?:                number;
  maxStorageGb?:            number;
  maxProducts?:             number;
  maxTransactionsPerMonth?: number;
  features?:                Features;
  trialDays?:               number;
  isPublic?:                boolean;
  sortOrder?:               number;
}

export interface Features {
  "Reportes avanzados": boolean;
}
