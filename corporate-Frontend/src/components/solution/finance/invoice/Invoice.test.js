import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Simulate } from "react-dom/test-utils";
import Axios from "axios";
import { useAuth } from "../../../hook/useAuth";
import Invoice from "./Invoice";
import { invoiceMarkup } from "./InvoicePrint";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
jest.mock("../../../hook/useAuth", () => ({ useAuth: jest.fn() }));
jest.mock("./InvoicePrint", () => ({
  invoiceMarkup: jest.fn(), renderInvoicePreview: jest.fn(), printInvoiceMarkup: jest.fn(),
}));
jest.mock("./InvoiceAddressModal", () => ({ customerId, close }) =>
  <button type="button" onClick={close}>Done address {customerId}</button>);
jest.mock("./InvoiceSearchModal", () => ({ openInvoice }) =>
  <button type="button" onClick={() => openInvoice(9)}>Open existing invoice</button>);

let container, root;
const button = text => [...container.querySelectorAll("button")].find(b => b.textContent === text);
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  Object.defineProperty(global, "crypto", { configurable: true, value: { randomUUID: () => "00000000-0000-4000-8000-000000000001" } });
  useAuth.mockReturnValue({ user: { Dept: "6", ALevel: "1", name: "Finance", accessToken: "mock-token" } });
  Axios.get.mockImplementation(url => Promise.resolve({ data: url.endsWith("/defaults") ? { authorizedBy: "Signatory" } : [] }));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.clearAllMocks();
});
const render = async () => { await act(async () => { root.render(<Invoice />); }); };

test("direct route access is denied before fetching invoice data", async () => {
  useAuth.mockReturnValue({ user: { Dept: "6", ALevel: "3" } });
  await render();
  expect(container.querySelector('[role="alert"]').textContent).toContain("do not have permission");
  expect(Axios.get).not.toHaveBeenCalled();
  expect(Axios.post).not.toHaveBeenCalled();
});

test("allows six items, protects the first item and restores Add after removal", async () => {
  await render();
  for (let i = 0; i < 5; i++) act(() => Simulate.click(button("+ Add Item")));
  expect(container.querySelectorAll('input[aria-label^="description Item"]')).toHaveLength(6);
  expect(button("+ Add Item")).toBeUndefined();
  expect(container.querySelector('[aria-label="Remove item 1"]')).toBeNull();
  act(() => Simulate.click(container.querySelector('[aria-label="Remove item 3"]')));
  expect(container.querySelectorAll('input[aria-label^="description Item"]')).toHaveLength(5);
  expect(button("+ Add Item")).toBeDefined();
});

test("Other clears item defaults and blocks issuance while manual information is incomplete", async () => {
  await render();
  act(() => Simulate.change(container.querySelector("select"), { target: { value: "other" } }));
  for (const field of ["description", "quantity", "unit", "unitPrice"]) {
    expect(container.querySelector(`[aria-label="${field} Item 1"]`).value).toBe("");
  }
  expect(container.textContent).toContain("Customer Name");
  act(() => Simulate.click(button("Issue Invoice")));
  expect(container.querySelector('[role="alert"]').textContent).toContain("customer name and address");
  expect(Axios.post).not.toHaveBeenCalled();
});

test("enabling withholding defaults to 3%, keeps other rates enabled and resets on rechecking", async () => {
  await render();
  const checkbox = [...container.querySelectorAll("label")]
    .find(label => label.textContent.trim() === "Withholding Tax").querySelector("input");
  const rateSelect = () => container.querySelector('select[aria-label="Withholding Rate"]');
  expect(rateSelect()).toBeNull();
  act(() => Simulate.change(checkbox, { target: { checked: true } }));
  expect(rateSelect().value).toBe("3");
  expect(rateSelect().className).toContain("cmb");
  expect([...rateSelect().options].map(option => option.value)).toEqual(["1", "2", "3", "5"]);
  act(() => Simulate.change(rateSelect(), { target: { value: "5" } }));
  expect(rateSelect().value).toBe("5");
  expect(checkbox.checked).toBe(true);
  act(() => Simulate.change(checkbox, { target: { checked: false } }));
  expect(rateSelect()).toBeNull();
  act(() => Simulate.change(checkbox, { target: { checked: true } }));
  expect(rateSelect().value).toBe("3");
});

test("closing the customer address editor reloads the tax branch without resetting invoice amounts", async () => {
  let branch = "1";
  Axios.get.mockImplementation(url => Promise.resolve({ data:
    url.endsWith("/defaults") ? { authorizedBy: "Signatory" } :
    url.endsWith("/exhibitions") ? [{ id: "X1", name: "Exhibition", venue: "Venue", startDate: "2026-12-01", endDate: "2026-12-03" }] :
    url.endsWith("/customers") ? [{ id: 7, name: "Customer", booth: "A1" }] :
    { addressId: branch === "1" ? 12 : 34, name: "Tax Customer", street: "Address", taxId: "1234567890123", branch, subBranch: "00002", booths: [], contractAmount: 10700 }
  }));
  await render();
  await act(async () => Simulate.change(container.querySelectorAll("select")[1], { target: { value: "X1" } }));
  await act(async () => Simulate.click(button("Search")));
  await act(async () => Simulate.click(button("Customer")));
  const price = container.querySelector('[aria-label="unitPrice Item 1"]');
  expect(price.value).toBe("10,700");
  const amount = container.querySelector('[aria-label="Installment Amount 1"]').value;
  act(() => Simulate.click(container.querySelector('[aria-label="Edit Customer Address"]')));
  expect(button("Done address 7")).toBeDefined();
  branch = "2";
  await act(async () => Simulate.click(button("Done address 7")));
  expect(container.textContent).toContain("Branch 00002");
  expect(price.value).toBe("10,700");
  expect(container.querySelector('[aria-label="Installment Amount 1"]').value).toBe(amount);
  expect(Axios.post).not.toHaveBeenCalled();
  Axios.post.mockResolvedValue({ data: { id: 9, book: "202611", number: "00009", taxAddress: { name: "Issued Tax Customer" } } });
  await act(async () => Simulate.click(button("Issue Invoice")));
  expect(Axios.post).toHaveBeenCalledWith(expect.stringContaining("/records"),
    expect.objectContaining({ customerId: 7, addressId: 34 }), expect.any(Object));
  expect(invoiceMarkup).toHaveBeenCalledWith(expect.any(Object), { name: "Issued Tax Customer" }, expect.any(Object));
});

test.each([false, true])("reprinting uses the saved address, snapshot available: %s", async useSnapshot => {
  const preview = { closed: false, document: { body: {} }, close: jest.fn() };
  const open = jest.spyOn(window, "open").mockReturnValue(preview);
  Axios.get.mockImplementation(url => Promise.resolve({ data:
    url.endsWith("/records/9") ? { id: 9, book: "202611", number: "00009", taxAddress: useSnapshot ? { name: "Original Branch" } : null, document: { kind: "exhibition", customerId: 7, exhibitionId: "X1", addressId: 12 } } :
    url.endsWith("/tax-address") ? { name: "Original Branch", addressId: 12 } :
    url.endsWith("/defaults") ? {} : []
  }));
  await render();
  act(() => Simulate.click(button("Search Invoice")));
  await act(async () => Simulate.click(button("Open existing invoice")));
  if (useSnapshot) {
    expect(Axios.get.mock.calls.some(([url]) => url.endsWith("/tax-address"))).toBe(false);
  } else {
    expect(Axios.get).toHaveBeenCalledWith(expect.stringContaining("/customers/7/tax-address"),
      expect.objectContaining({ params: { exhibitionId: "X1", addressId: 12 } }));
  }
  expect(invoiceMarkup).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({ name: "Original Branch" }), expect.any(Object), undefined);
  open.mockRestore();
});
