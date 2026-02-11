export interface BankAccount {
  bank: string;
  currency: string;
  number: string;
  cci?: string;
}

export interface PaymentConfig {
  whatsappNumber: string;
  yapeNumber: string;
  bankAccounts: BankAccount[];
  qrImageUrl: string;
  accountHolder: string;
}

export const PAYMENT_CONFIG: PaymentConfig = {
  // CHANGE_ME: Formato internacional sin +, ej: "51999999999"
  whatsappNumber: "51981314450",
  
  // CHANGE_ME: Número de Yape/Plin
  yapeNumber: "51981314450",

  // CHANGE_ME: Nombre del titular de las cuentas
  accountHolder: "RYŪKAMI STORE",

  // CHANGE_ME: URL de la imagen del QR de Yape/Plin
  qrImageUrl: "https://via.placeholder.com/300x300.png?text=QR+YAPE+RYUKAMI",

  bankAccounts: [
    {
      bank: "BCP Soles",
      currency: "PEN",
      number: "191-XXXXXXXX-X-XX",
      cci: "002-XXXXXXXXXXXXXXXX-XX"
    },
    {
      bank: "Interbank Soles",
      currency: "PEN",
      number: "200-XXXXXXXXXX"
    }
  ]
};
