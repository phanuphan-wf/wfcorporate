import { taxBranchLabel } from "./taxBranchLabel";
import { totals, validateInvoice, paymentTerms, roundMoney } from "./invoiceValues";
import { canIssueDocuments } from "../documentAccess";
const doc = {
  exhibitionId: "X1", customerId: 1, date: "2026-11-02", heading: "งาน", project: "งาน",
  venue: "สถานที่", startDate: "2026-11-01", endDate: "2026-11-03", preparedBy: "ผู้จัดทำ",
  authorizedBy: "ผู้ลงนาม", transferAccount: "บัญชี", vatRate: 7, withholdingRate: 3,
  items: [{ description: "บริการ", unit: "รายการ", quantity: 1, unitPrice: 70000 }],
  terms: [{ date: "2026-11-03", amount: 72800 }], cheque: false,
};
test("VAT and withholding remain separate from the service base", () => {
  expect(totals(doc)).toEqual({ subtotal: 70000, vat: 4900, withholding: 2100, total: 74900, net: 72800 });
});
test.each([1, 2, 3, 5])("calculates %s%% withholding from the VAT-exclusive base", rate => {
  const result = totals({ ...doc, withholdingRate: rate, priceIncludesVat: true,
    items: [{ ...doc.items[0], unitPrice: 74900 }] });
  expect(result.withholding).toBe(70000 * rate / 100);
  expect(result.net).toBe(74900 - result.withholding);
});
test.each([{ amounts: [72800] }, { amounts: [36400, 36400] }, { amounts: [20000, 20000, 32800] }])("accepts valid payment allocation $amounts", ({ amounts }) => {
  expect(validateInvoice({ ...doc, terms: amounts.map(amount => ({ date: doc.date, amount })) })).toBe("");
});
test("rejects mismatched installments and missing cheque deadline", () => {
  expect(validateInvoice({ ...doc, terms: [{ date: doc.date, amount: 70000 }] })).not.toBe("");
  expect(validateInvoice({ ...doc, cheque: true })).not.toBe("");
  expect(validateInvoice({ ...doc, cheque: true, chequeReceiveBy: doc.date })).toBe("");
});
test("rejects empty or invalid service amounts", () => {
  expect(validateInvoice({ ...doc, items: [] })).not.toBe("");
  expect(validateInvoice({ ...doc, items: [{ ...doc.items[0], unitPrice: Infinity }] })).not.toBe("");
});
test("only agreed department/access combinations can issue documents", () => {
  for (let dept = 0; dept <= 8; dept++) for (let access = 0; access <= 4; access++) {
    expect(canIssueDocuments({ Dept: String(dept), ALevel: String(access) }))
      .toBe((dept === 1 && access === 1) || (dept === 6 && [1, 2].includes(access)));
  }
  expect(canIssueDocuments(null)).toBe(false);
});
test("Other projects use manually entered customer details and do not require exhibition membership", () => {
  const manual = { ...doc, kind: "other", exhibitionId: "", customerId: 0, manualCustomer: { name: "Manual Customer", street: "Manual Address" } };
  expect(validateInvoice(manual)).toBe("");
  expect(validateInvoice({ ...manual, manualCustomer: { name: "", street: "Manual Address" } })).not.toBe("");
  expect(validateInvoice({ ...manual, manualCustomer: { name: "Manual Customer", street: "" } })).not.toBe("");
});

test("head office hides branch numbers and other location types display branch numbers", () => {
  expect(taxBranchLabel("1", "00000")).toBe("Head Office");
  expect(taxBranchLabel(1, "12345", "th")).toBe("สำนักงานใหญ่");
  expect(taxBranchLabel("2", "00003")).toBe("Branch 00003");
  expect(taxBranchLabel("0", "00003", "th")).toBe("สาขา 00003");
});
test("Exhibition supports manual customers but still requires the exhibition", () => {
  const manual = { ...doc, kind: "exhibition", customerInputMode: "manual", customerId: 0,
    manualCustomer: { name: "Manual Customer", street: "Manual Address" } };
  expect(validateInvoice(manual)).toBe("");
  expect(validateInvoice({ ...manual, exhibitionId: "" })).not.toBe("");
  expect(validateInvoice({ ...manual, customerInputMode: "lookup" })).not.toBe("");
});

test("splits net payable to the cent and redistributes only unedited installments", () => {
  const draft = { date: "2026-10-01", startDate: "2026-12-01", terms: [{}, {}, {}] };
  expect(paymentTerms(draft, 100).map(term => term.amount)).toEqual([33.33, 33.33, 33.34]);
  expect(paymentTerms({ ...draft, terms: [{ amount: 40 }, {}, {}] }, 100).map(term => term.amount))
    .toEqual([40, 30, 30]);
});

test("assigns installment dates from the final term and falls back to invoice date for short lead times", () => {
  const draft = { date: "2026-10-01", startDate: "2026-12-01", terms: [{}, {}, {}] };
  expect(paymentTerms(draft, 100).map(term => term.date))
    .toEqual(["2026-10-08", "2026-11-01", "2026-11-16"]);
  expect(paymentTerms({ ...draft, startDate: "2026-10-20" }, 100).map(term => term.date))
    .toEqual(["2026-10-01", "2026-10-01", "2026-10-05"]);
  expect(paymentTerms({ ...draft, startDate: "", terms: [{ date: "2026-10-12" }] }, 100))
    .toEqual([{ date: "2026-10-12", amount: 100 }]);
});

test("VAT-inclusive history amounts retain their gross total and apply withholding to the extracted base", () => {
  const invoice = {
    ...doc,
    priceIncludesVat: true,
    items: [{ ...doc.items[0], unitPrice: 74900 }],
  };
  expect(totals(invoice)).toEqual({ subtotal: 70000, vat: 4900, withholding: 2100, total: 74900, net: 72800 });
  expect(validateInvoice(invoice)).toBe("");
});

test("VAT-inclusive totals stay balanced at the cent", () => {
  const invoice = {
    ...doc,
    priceIncludesVat: true,
    withholdingRate: 0,
    items: [{ ...doc.items[0], quantity: 3, unitPrice: 33.33 }],
  };
  expect(totals(invoice)).toEqual({ subtotal: 93.45, vat: 6.54, withholding: 0, total: 99.99, net: 99.99 });
});

test.each([[10.075, 10.08], [1.005, 1.01], [-10.075, -10.08], [10.074, 10.07]])(
  "rounds %s consistently with the API to %s", (input, expected) => {
    expect(roundMoney(input)).toBe(expected);
  }
);

test("fractional quantities keep installment validation consistent with decimal API totals", () => {
  const invoice = {
    ...doc, priceIncludesVat: true, withholdingRate: 0,
    items: [{ ...doc.items[0], quantity: 0.5, unitPrice: 20.15 }],
    terms: [{ date: doc.date, amount: 10.08 }],
  };
  expect(totals(invoice)).toEqual({ subtotal: 9.42, vat: 0.66, withholding: 0, total: 10.08, net: 10.08 });
  expect(validateInvoice(invoice)).toBe("");
});
