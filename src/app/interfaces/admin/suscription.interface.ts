import { DataPaginationResponse } from "../general/services.interface";

export interface ISuscriptionResponse extends DataPaginationResponse{
  content:          SuscriptionContent[];
}

export interface SuscriptionContent {
  id:            number;
  displayName:   string;
  storeUrl:      string;
  requestDate:   Date;
  businessEmail: string;
  status:        string;
  statusName:    string;
}

export interface ISuscription {
  id:             number;
  businessName:   string;
  ruc:            string;
  displayName:    string;
  storeUrl:       string;
  storeCategory:  string;
  ubigeoId:       string;
  address:        string;
  departamento:   string;
  provincia:      string;
  distrito:       string;
  businessEmail:  string;
  businessPhone:  string;
  firstName:      string;
  lastName:       string;
  documentType:   string;
  documentNumber: string;
  planId:         number;
  planName:       string;
  status:         string;
  statusName:     string;
  requestDate:    Date;
}

export interface IMeSuscriptionStore {
  id:                       number;
  storeId:                  number;
  storeName:                string;
  planId:                   number;
  planCode:                 string;
  planName:                 string;
  status:                   string;
  statusDisplay:            string;
  startDate:                Date;
  endDate:                  null;
  trialEndDate:             Date;
  nextBillingDate:          Date;
  currentPrice:             number;
  currency:                 string;
  billingCycle:             string;
  billingCycleDisplay:      string;
  autoRenew:                boolean;
  customMaxUsers:           null;
  customMaxProducts:        null;
  customMaxTransactions:    null;
  effectiveMaxUsers:        number;
  effectiveMaxProducts:     number;
  effectiveMaxTransactions: null;
  cancelledAt:              null;
  cancellationReason:       null;
  cancelledByUserId:        null;
  cancelledByUserName:      null;
  createdAt:                Date;
  updatedAt:                Date;
  createdByUserId:          number;
  createdByUserName:        null;
  daysRemaining:            null;
  priceDisplay:             string;
}

export interface ISuscriptionEligibility {
  subscriptionId:  number;
  currentPlanId:   number;
  currentPlanCode: string;
  currentPlanName: string;
  canChange:       boolean;
  reason:          null;
  allowedPlans:    AllowedPlan[];
}

export interface AllowedPlan {
  id:                  number;
  name:                string;
  description:         string;
  currency:            string;
  price:               number;
  billingCycle:        string;
  billingCycleDisplay: string;
  freeTrialMonths:     number;
  promotionalLabel:    null;
  pricePerUse:         number;
  features:            any[];
}
