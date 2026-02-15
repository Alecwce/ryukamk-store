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
  // Formato internacional sin +, ej: "51999999999"
  whatsappNumber: "51981314450",
  
  // Número de Yape/Plin
  yapeNumber: "981314450",

  // Nombre del titular de las cuentas
  accountHolder: "Alexander Lazo",

  // QR real alojado en Supabase
  qrImageUrl: "https://suygiakmwizhyjcrsqpg.supabase.co/storage/v1/object/public/products/qr.webp",

  // Cuentas bancarias oficiales
  bankAccounts: [
    {
      bank: "BCP",
      currency: "Soles",
      number: "355-14543077-0-13",
      cci: "00235511454307701363"
    }
  ]
};
