import { roundMoney } from "../invoice/invoiceValues";

export const bangkokDate = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
export const dateInput = value => value?.slice(0, 10) || "";

export const taxInvoiceVatRate = 7;

export function paymentTotals(payments, includesVat) {
  const total = roundMoney(payments.reduce((sum, payment) => sum + Number(payment.amount), 0));
  const vat = includesVat ? roundMoney(total * taxInvoiceVatRate / (100 + taxInvoiceVatRate)) : 0;
  return { total, vat, subtotal: roundMoney(total - vat) };
}

export const paymentMethods = [
  { value: "cash", label: "Cash", thai: "เงินสด" },
  { value: "transfer", label: "Transfer", thai: "โอนเงิน" },
  { value: "cheque", label: "Cheque", thai: "เช็ค" },
  { value: "creditCard", label: "Credit Card", thai: "บัตรเครดิต" },
];

export const emptyPayment = () => ({
  method: "cash", label: "", bank: "", branch: "", reference: "",
  date: "", receivedDate: "", amount: "",
});

export function paymentLabel(payment) {
  const method = paymentMethods.find(option => option.value === payment.method);
  return payment.label?.trim() || method?.label || "—";
}
