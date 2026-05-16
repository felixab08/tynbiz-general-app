export interface InvoicesResp {
  id:             number;
  invoiceNumber:  string;
  storeId:        number;
  storeName:      string;
  subscriptionId: number;
  status:         string;
  statusDisplay:  string;
  issueDate:      Date;
  dueDate:        Date;
  paidAt:         null;
  subtotal:       number;
  taxRate:        number;
  taxAmount:      number;
  discountAmount: number;
  totalAmount:    number;
  currency:       string;
  billingDetails: BillingDetails;
  lineItems:      LineItem[];
  notes:          string;
  createdAt:      Date;
  updatedAt:      Date;
  isOverdue:      boolean;
  isPaid:         boolean;
  daysUntilDue:   number;
}

export interface BillingDetails {
  ruc:          string;
  name:         string;
  email:        string;
  phone:        string;
  address:      string;
  distrito:     string;
  provincia:    string;
  tradeName:    string;
  departamento: string;
}

export interface LineItem {
  amount:      number;
  quantity:    number;
  unitPrice:   number;
  description: string;
}

// para el momento de pagar
export interface InvoicesPayment {
  invoiceId: number;
  antifraud: Antifraud;
}

export interface Antifraud {
  clientEmail:    string;
  documentType:   string;
  documentNumber: string;
  firstName:      string;
  lastName:       string;
  phoneNumber:    string;
  billingAddress: BillingAddress;
}

export interface BillingAddress {
  street:      string;
  city:        string;
  state:       string;
  postalCode:  string;
  countryCode: string;
}


export interface InvoicesPayResp {
  sessionKey:        string;
  purchaseNumber:    string;
  paymentId:         number;
  merchantId:        string;
  amount:            number;
  checkoutJsUrl:     string;
  expirationMinutes: number;
}
