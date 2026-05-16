export interface IMercadoPagoResp {
  paymentId:        number;
  preferenceId:     string;
  initPoint:        string;
  sandboxInitPoint: string;
  checkoutUrl:      string;
  publicKey:        string;
  environment:      string;
  purchaseNumber:   string;
  expiresAt:        Date;
}
