import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Simulate } from "react-dom/test-utils";
import Axios from "axios";
import { useAuth } from "../../../hook/useAuth";
import { printInvoiceMarkup, renderInvoicePreview } from "../invoice/InvoicePrint";
import TaxInvoice from "./TaxInvoice";
import { taxInvoiceMarkup } from "./TaxInvoicePrint";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
jest.mock("../../../hook/useAuth", () => ({ useAuth: jest.fn() }));
jest.mock("../invoice/InvoicePrint", () => ({ printInvoiceMarkup: jest.fn(), renderInvoicePreview: jest.fn() }));
jest.mock("../invoice/InvoiceSearchModal", () => ({ openInvoice }) =>
  <button type="button" onClick={() => openInvoice(9)}>Use Invoice</button>);

const exhibition = { id: "X1", name: "Furniture Fair", venue: "Venue", startDate: "2026-12-01", endDate: "2026-12-03" };
const tax = { name: "Customer", street: "Address", taxId: "1-2345-67890-12 3", branch: "1" };
const source = {
  id: 9, book: "202611", number: "12F34", taxAddress: tax,
  document: {
    kind: "exhibition", exhibitionId: exhibition.id, customerId: 7, vatRate: 7,
    items: [{ description: "Booth rental" }],
  },
};
const payments = [
  {
    id: 1, method: "transfer", bank: "Bank A", reference: "Transfer123", detail: "Mobile Banking",
    date: "2026-11-05", receivedDate: "2026-11-05", amount: 1000, withholding: 70, receipted: false,
  },
  { id: 2, method: "cheque", bank: "Bank B", reference: "Cheque456", amount: 500, withholding: 0, receipted: true },
  { id: 3, method: "cash", amount: 200, withholding: 0, receipted: false },
];

let root, container, paymentResponse, historyResponse, issuanceVersion;
const button = label => [...container.querySelectorAll("button")].find(item => item.textContent === label);
const click = async label => act(async () => Simulate.click(button(label)));
const field = label => [...container.querySelectorAll("label")]
  .find(item => item.textContent.trim() === label).querySelector("input");
const render = () => act(async () => root.render(<TaxInvoice />));
const loadInvoice = async () => {
  await render();
  await click("Search Invoice");
  await click("Use Invoice");
};

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true, value() { this.setAttribute("open", ""); },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true, value() { this.removeAttribute("open"); },
  });
  Object.defineProperty(global, "crypto", {
    configurable: true, value: { randomUUID: () => "00000000-0000-4000-8000-000000000001" },
  });
  useAuth.mockReturnValue({ user: { Dept: 6, ALevel: 1, accessToken: "mock-token", name: "Preparer" } });
  issuanceVersion = 2;
  paymentResponse = () => Promise.resolve({ data: payments });
  historyResponse = () => Promise.resolve({ data: { results: [], nextBeforeId: null } });
  Axios.get.mockImplementation((url, options) => {
    if (url.endsWith("/tax-invoice/exhibitions")) return Promise.resolve({ data: { active: [exhibition], finished: [], issuanceVersion } });
    if (url.endsWith("/defaults")) return Promise.resolve({ data: { authorizedBy: "Signatory" } });
    if (url.endsWith("/records/9")) return Promise.resolve({ data: source });
    if (url.endsWith("/payments")) return paymentResponse();
    if (url.includes("/tax-invoice/records")) return historyResponse(url, options);
    return Promise.reject(new Error("Unexpected request"));
  });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("uses the invoice customer and exhibition, showing every payment but totaling the unreceipted ones", async () => {
  await loadInvoice();
  expect(Axios.get).toHaveBeenCalledWith(expect.stringContaining("/tax-invoice/payments"),
    expect.objectContaining({ params: { exhibitionId: "X1", customerId: "7" } }));
  expect(container.textContent).toContain("IV-20261112F34");
  expect(container.querySelectorAll("tbody tr")).toHaveLength(3);
  const transfer = container.querySelector("tbody tr");
  expect([...transfer.cells].map(cell => cell.textContent)).toEqual(
    expect.arrayContaining(["Bank A · 5 Nov 2026", "5 Nov 2026"]),
  );
  expect(transfer.textContent).not.toMatch(/Transfer123|Mobile Banking/);
  expect(container.textContent).toContain("Issued");
  expect(container.textContent).not.toContain("1,270.00 THB");
  expect(container.textContent).toContain("1,200.00 THB");
  expect(container.textContent).not.toContain("Withholding");
  expect(container.textContent).not.toContain("New Customer Only");
});

test("credit card details show only the bank and card type", async () => {
  paymentResponse = () => Promise.resolve({ data: [{
    id: 5, method: "creditCard", bank: "Bank A", detail: "Visa", reference: "Slip 123", amount: 100,
  }] });
  await loadInvoice();
  const row = container.querySelector("tbody tr");
  expect([...row.cells].map(cell => cell.textContent)).toContain("Bank A · Visa");
  expect(row.textContent).not.toContain("Slip 123");
});

test("offers manual input after an empty result and only after acknowledgment", async () => {
  paymentResponse = () => Promise.resolve({ data: [] });
  await loadInvoice();
  expect(container.querySelector("dialog[open]").textContent).toContain("ไม่พบข้อมูลการชำระเงิน");
  expect(button("Add Payment")).toBeUndefined();
  await click("Enter Manually");
  expect(container.querySelector("dialog[open]")).toBeNull();
  expect(button("Add Payment")).toBeDefined();
});

test("a failed payment lookup shows a retry and does not permit manual fallback", async () => {
  paymentResponse = () => Promise.reject(new Error("offline"));
  await loadInvoice();
  expect(button("Retry Payment Lookup")).toBeDefined();
  expect(button("Enter Manually")).toBeUndefined();
  expect(button("Issue Tax Invoice").disabled).toBe(true);
});

test("a valid customer Tax ID does not trigger a Tax ID warning when the receiver is missing", async () => {
  await loadInvoice();
  expect(field("Received By").value).toBe("Preparer");
  act(() => Simulate.change(field("Received By"), { target: { value: "" } }));
  await click("Issue Tax Invoice");
  const alert = container.querySelector('[role="alert"]');
  expect(alert.textContent).toContain("Received By");
  expect(alert.textContent).not.toContain("Tax ID");
  expect(Axios.post).not.toHaveBeenCalled();
});

test("issuance sends the normalized Tax ID and only unreceipted payments, and reuses the request ID on retry", async () => {
  jest.spyOn(window, "confirm").mockReturnValue(true);
  printInvoiceMarkup.mockResolvedValue(undefined);
  Axios.post.mockRejectedValueOnce(new Error("timeout")).mockImplementationOnce((url, payload) => Promise.resolve({
    data: { id: 13, book: "202611", number: "00001", document: payload.document, payments: payload.payments, tax },
  }));
  await loadInvoice();
  act(() => Simulate.change(field("Received By"), { target: { value: "Cashier" } }));
  await click("Issue Tax Invoice");
  await click("Issue Tax Invoice");
  expect(Axios.post).toHaveBeenCalledTimes(2);
  const first = Axios.post.mock.calls[0][1];
  expect(first.tax.taxId).toBe("1234567890123");
  expect(first.document.receivedBy).toBe("Cashier");
  expect(first.sourceInvoiceId).toBe(9);
  expect(first.document.includesVat).toBe(true);
  expect(first.payments.map(payment => payment.id)).toEqual([1, 3]);
  expect(Axios.post.mock.calls[1][1]).toEqual(first);
  expect(container.textContent).toContain("Issued RT-20261100001");
  expect(button("Issue Tax Invoice").disabled).toBe(true);
  expect(printInvoiceMarkup).toHaveBeenCalledTimes(1);
  expect(printInvoiceMarkup).toHaveBeenCalledWith(expect.stringContaining("RT-20261100001"));
});


test("Acc 2 can see issued Tax Invoices but cannot cancel or prepare a replacement", async () => {
  useAuth.mockReturnValue({ user: { Dept: 6, ALevel: 2, accessToken: "mock-token", name: "Finance" } });
  historyResponse = () => Promise.resolve({ data: { results: [
    { id: 13, book: "202611", number: "00001", canPrint: true, canCancel: true },
    { id: 14, book: "202611", number: "00002", cancelled: true, canReplace: true },
  ] } });
  await render();
  await click("Issued Tax Invoices");
  expect(container.textContent).toContain("RT-20261100001");
  expect(button("Cancel Tax Invoice")).toBeUndefined();
  expect(button("Prepare Replacement")).toBeUndefined();
  expect(Axios.post).not.toHaveBeenCalled();
});

test("Acc 1 can cancel a receipt and history offers no replacement shortcut", async () => {
  let cancelled = false;
  const original = { id: 13, book: "202611", number: "00001" };
  jest.spyOn(window, "confirm").mockReturnValue(true);
  Axios.post.mockImplementationOnce(() => { cancelled = true; return Promise.resolve(); });
  historyResponse = () => Promise.resolve({ data: {
    results: [{ ...original, canPrint: !cancelled, canCancel: !cancelled, cancelled, canReplace: cancelled }],
  } });
  await render();
  await click("Issued Tax Invoices");
  await click("Cancel Tax Invoice");
  expect(Axios.post).toHaveBeenCalledWith(expect.stringContaining("/records/13/cancel"), null, expect.any(Object));
  expect(container.querySelector("dialog[open]").textContent).toContain("Cancelled");
  expect(button("Prepare Replacement")).toBeUndefined();
});

test("the A5 print markup preserves colors, three copy types and every payment", () => {
  const entries = Array.from({ length: 19 }, (_, i) => ({ ...payments[0], id: i, amount: i + 1001 }));
  const html = taxInvoiceMarkup({
    project: "Test project", heading: "Exhibition", description: "Booth rental", includesVat: true, date: "2026-11-09",
  }, tax, entries, source, { book: "202611", number: "00003" }, { book: "202611", number: "00001" });
  const page = new DOMParser().parseFromString(html, "text/html");
  expect(page.querySelector("style").textContent).toContain("@page { size: A5 portrait;");
  expect(page.querySelector("style").textContent).toContain("print-color-adjust: exact");
  expect(page.querySelectorAll("section")).toHaveLength(9);
  expect(page.querySelectorAll(".payment-entry")).toHaveLength(57);
  expect([...page.querySelectorAll(".payment-entry b")].filter(value => value.textContent === "1,019.00 บาท"))
    .toHaveLength(3);
  expect(page.body.textContent).toContain("ออกแทน RT-20261100001");
  expect([...new Set([...page.querySelectorAll("section")].map(section => section.style.getPropertyValue("--heading")))])
    .toEqual(["#b3232c", "#235c92", "#2a6b44"]);
});

test("the printed payment methods include the relevant details with formal Thai labels", () => {
  const entries = [
    payments[2],
    { ...payments[0], bank: "ธนาคารกสิกรไทย", label: "Detailed transfer" },
    { ...payments[1], bank: "Bank B", branch: "สาขาสีลม", date: "2026-11-06" },
    { id: 4, method: "creditCard", bank: "Bank C", detail: "Visa", reference: "Slip 123", amount: 200 },
  ];
  const markup = taxInvoiceMarkup({ includesVat: true }, tax, entries);
  const page = new DOMParser().parseFromString(markup, "text/html");
  const paymentSection = page.querySelector(".payment");
  expect([...paymentSection.querySelectorAll(".payment-entry span")].map(span => span.textContent))
    .toEqual(["เงินสด", "โอนเงิน", "เช็ค", "บัตรเครดิต"]);
  const details = [...paymentSection.querySelectorAll(".payment-entry")]
    .map(row => row.querySelector("small")?.textContent);
  expect(details).toEqual([
    undefined,
    expect.stringMatching(/^เข้าธนาคารกสิกรไทย · วันที่โอนเงิน .+2569$/),
    expect.stringMatching(/^ธนาคารตามเช็ค Bank B · สาขาสีลม · เช็คเลขที่ Cheque456 · เช็คลงวันที่ .+2569$/),
    "ธนาคารผู้ออกบัตร Bank C · ประเภทบัตร Visa",
  ]);
  expect(paymentSection.textContent).not.toMatch(/Detailed transfer|Transfer123|Mobile Banking|Slip 123/);
});

test("the receipt summary starts with VAT included and unchecking it preserves the received amount", async () => {
  await loadInvoice();
  const checkbox = field("Amount includes VAT 7%");
  expect(checkbox.checked).toBe(true);
  expect(container.textContent).toContain("78.50 THB");
  expect(container.textContent).toContain("1,121.50 THB");

  act(() => Simulate.change(checkbox, { target: { checked: false } }));
  expect(container.textContent).toContain("No VAT");
  expect(container.textContent).toContain("1,200.00 THB");
  expect(container.textContent).not.toContain("78.50 THB");
});

test.each([true, false])("print summary keeps the amount received with VAT included: %s", includesVat => {
  const markup = taxInvoiceMarkup({
    project: "Test project", heading: "Exhibition", description: "Booth rental", includesVat,
  }, tax, [{ method: "cash", amount: 107, withholding: 3 }]);
  const summary = new DOMParser().parseFromString(markup, "text/html").querySelector(".summary");
  expect(summary.querySelector(".total b").textContent).toBe("107.00");
  expect(summary.textContent).not.toContain("ภาษีหัก ณ ที่จ่าย");
  expect(summary.textContent).toContain(includesVat ? "ภาษีมูลค่าเพิ่ม 7%" : "ไม่มี VAT");
  if (includesVat) {
    expect([...summary.querySelectorAll("b")].map(value => value.textContent)).toEqual(["100.00", "7.00", "107.00"]);
  }
});


test("select all and individual payment choices update the amount and only issue the selected rows", async () => {
  jest.spyOn(window, "confirm").mockReturnValue(true);
  const open = jest.spyOn(window, "open").mockImplementation(() => null);
  printInvoiceMarkup.mockResolvedValue(undefined);
  Axios.post.mockImplementation((url, payload) => Promise.resolve({
    data: { id: 13, book: "202611", number: "00001", document: payload.document, payments: payload.payments, tax },
  }));
  await loadInvoice();
  const all = field("Select all");
  const first = container.querySelector('[aria-label="Select payment 1"]');
  const issued = container.querySelector('[aria-label="Select payment 2"]');
  expect(all.checked).toBe(true);
  expect(issued.disabled).toBe(true);
  expect(button("Print Preview").disabled).toBe(false);
  expect(button("Issued Tax Invoices").closest("fieldset")).toBeNull();

  act(() => Simulate.change(all, { target: { checked: false } }));
  expect(button("Issue Tax Invoice").disabled).toBe(true);
  act(() => Simulate.change(first, { target: { checked: true } }));
  expect(all.indeterminate).toBe(true);
  expect(container.textContent).toContain("1,000.00 THB");
  expect(container.textContent).not.toContain("1,200.00 THB");

  await click("Issue Tax Invoice");
  expect(Axios.post.mock.calls[0][1].payments).toEqual([payments[0]]);
  expect(container.querySelector('[aria-label="Select payment 3"]').closest("tr").textContent).not.toContain("Issued");
  expect(printInvoiceMarkup).toHaveBeenCalledTimes(1);
  expect(printInvoiceMarkup).toHaveBeenCalledWith(expect.stringContaining("RT-20261100001"));
  expect(renderInvoicePreview).not.toHaveBeenCalled();
  expect(open).not.toHaveBeenCalled();
});

test("Print Preview opens a draft only when explicitly requested", async () => {
  const popup = { close: jest.fn(), print: jest.fn() };
  jest.spyOn(window, "open").mockReturnValue(popup);
  renderInvoicePreview.mockResolvedValue(true);
  await loadInvoice();
  await click("Print Preview");
  expect(renderInvoicePreview).toHaveBeenCalledWith(popup, expect.stringContaining("ตัวอย่างก่อนพิมพ์"));
  expect(popup.print).not.toHaveBeenCalled();
  expect(printInvoiceMarkup).not.toHaveBeenCalled();
  expect(Axios.post).not.toHaveBeenCalled();
});

test("printing from issued history opens the print dialog without a preview window", async () => {
  const open = jest.spyOn(window, "open").mockImplementation(() => null);
  printInvoiceMarkup.mockResolvedValue(undefined);
  const record = {
    id: 13, book: "202611", number: "00001", canPrint: true, tax, payments: [payments[0]],
    document: { project: "Fair", includesVat: true },
  };
  historyResponse = url => Promise.resolve({ data: url.endsWith("/13") ? record : { results: [record] } });
  await render();
  await click("Issued Tax Invoices");
  await click("RT-20261100001");
  expect(printInvoiceMarkup).toHaveBeenCalledTimes(1);
  expect(printInvoiceMarkup.mock.calls[0][0]).toContain("RT-20261100001");
  expect(renderInvoicePreview).not.toHaveBeenCalled();
  expect(open).not.toHaveBeenCalled();
});


test("an older backend is blocked before saving or printing", async () => {
  issuanceVersion = undefined;
  await loadInvoice();
  await click("Issue Tax Invoice");
  expect(container.querySelector('[role="alert"]').textContent).toContain("backend is out of date");
  expect(Axios.post).not.toHaveBeenCalled();
  expect(printInvoiceMarkup).not.toHaveBeenCalled();
});

test("a rejected issue shows the server validation error and does not print", async () => {
  jest.spyOn(window, "confirm").mockReturnValue(true);
  Axios.post.mockRejectedValueOnce({
    response: { status: 400, data: { errors: { "Document.Date": ["Enter a valid issue date."] } } },
  });
  await loadInvoice();
  await click("Issue Tax Invoice");
  expect(container.querySelector('[role="alert"]').textContent).toContain("Enter a valid issue date.");
  expect(printInvoiceMarkup).not.toHaveBeenCalled();
});
