export const usesManualCustomer = doc => doc.kind === "other" || doc.customerInputMode === "manual";
export const roundMoney = value => {
  const number = Number(value);
  const cents = Math.abs(number) * 100;
  // Compensate for floating-point multiplication at half-cent boundaries.
  // Match the API's decimal rounding away from zero.
  return Math.sign(number) * Math.round(cents + Number.EPSILON * cents) / 100;
};
export const money = value => Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export function totals(doc) {
  const lineTotal = roundMoney(doc.items.reduce((sum, item) => sum + roundMoney(Number(item.quantity) * Number(item.unitPrice)), 0));
  const vatRate = Number(doc.vatRate);
  const vat = doc.priceIncludesVat
    ? roundMoney(lineTotal * vatRate / (100 + vatRate))
    : roundMoney(lineTotal * vatRate / 100);
  const subtotal = doc.priceIncludesVat ? roundMoney(lineTotal - vat) : lineTotal;
  const total = doc.priceIncludesVat ? lineTotal : roundMoney(subtotal + vat);
  const withholding = roundMoney(subtotal * Number(doc.withholdingRate) / 100);
  return { subtotal, vat, withholding, total, net: roundMoney(total - withholding) };
}
export function validateInvoice(doc) {
  if ((doc.kind !== "other" && !doc.exhibitionId) || (usesManualCustomer(doc) ? !doc.manualCustomer?.name?.trim() || !doc.manualCustomer?.street?.trim() : !doc.customerId)) return "Please select an exhibition and customer, or enter the customer name and address.";
  if (!doc.date || !doc.heading.trim() || !doc.project.trim() || !doc.venue.trim() || !doc.startDate || !doc.endDate || doc.endDate < doc.startDate) return "Please check the invoice and project details.";
  if (!doc.preparedBy.trim() || !doc.authorizedBy.trim() || !doc.transferAccount.trim()) return "Please enter the preparer, authorized signatory and bank account.";
  if (doc.items.length < 1 || doc.items.length > 6 || doc.items.some(i => !i.description.trim() || !i.unit.trim() || Number(i.quantity) <= 0 || Number(i.unitPrice) < 0 || !Number.isFinite(Number(i.quantity) * Number(i.unitPrice)))) return "Please check the items, quantities and prices.";
  if ([doc.vatRate, doc.withholdingRate].some(r => !Number.isFinite(Number(r)) || Number(r) < 0 || Number(r) > 100)) return "Invalid tax rate.";
  const amount = totals(doc);
  if (amount.subtotal <= 0 || amount.subtotal > 99999999.99 || amount.net <= 0) return "The invoice amount is invalid or exceeds the supported limit.";
  if (doc.terms.length < 1 || doc.terms.length > 3 || doc.terms.some(t => !t.date || Number(t.amount) <= 0 || !Number.isFinite(Number(t.amount)) || Number(t.amount) !== roundMoney(t.amount)) || roundMoney(doc.terms.reduce((sum, t) => sum + Number(t.amount), 0)) !== amount.net) return "Please check the due dates. Installments must equal the net payable amount.";
  if (doc.cheque && !doc.chequeReceiveBy) return "Please enter the cheque receipt deadline.";
  return "";
}

function shiftDate(date, days) {
  const value = new Date(date + "T00:00:00Z");
  if (Number.isNaN(value.getTime())) return "";
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function paymentTerms(doc, net) {
  const terms = doc.terms;
  const fixed = terms.reduce((sum, term) => sum + Math.round(Number(term.amount ?? 0) * 100), 0);
  const count = terms.filter(term => term.amount == null).length;
  let remaining = Math.max(0, Math.round(net * 100) - fixed);
  let unassigned = count;
  const dates = [shiftDate(doc.date, 7), shiftDate(doc.startDate, -30), shiftDate(doc.startDate, -15)]
    .slice(3 - terms.length);
  for (let i = dates.length - 1; i >= 0; i--) {
    if (!dates[i] || dates[i] < doc.date || (dates[i + 1] && dates[i] > dates[i + 1])) {
      dates[i] = doc.date;
    }
  }
  return terms.map((term, i) => {
    let amount = term.amount;
    if (amount == null) {
      const cents = Math.floor(remaining / unassigned);
      remaining -= cents;
      unassigned--;
      amount = cents / 100;
    }
    return { date: term.date ?? dates[i], amount };
  });
}

export function formatInvoiceDate(value, locale = "en-GB") {
  if (!value) return "";
  const date = new Date(value.slice(0, 10) + "T00:00:00Z");
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale, {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}
