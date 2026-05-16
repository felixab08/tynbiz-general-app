import { InvoicesPayment, InvoicesResp, IStoresResp } from '@app/interfaces';

export class PaymentsMapper {
  static mapInvoiceToPaymentMethod(
    invoice: InvoicesResp,
    store: IStoresResp,
    type = 'Niubiz',
  ): InvoicesPayment | any {
    if (type === 'Niubiz') {
      return {
        invoiceId: invoice.id,
        antifraud: {
          clientEmail: store.email,
          documentType: 'RUC',
          documentNumber: store.ruc,
          firstName: store.displayName,
          lastName: '',
          phoneNumber: store.phone,
          billingAddress: {
            street: store.address,
            city: store.distrito,
            state: store.departamento,
            postalCode: store.ubigeoId,
            countryCode: store.country,
          },
        },
      };
    }
    if (type === 'MercadoPago') {
      return {
        invoiceId: invoice.id || invoice.invoiceNumber,
      };
    }
    return null as any;
  }
}
