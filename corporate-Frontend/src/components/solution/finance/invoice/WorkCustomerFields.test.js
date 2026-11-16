import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Simulate } from "react-dom/test-utils";
import WorkCustomerFields from "./WorkCustomerFields";
let container, root;
beforeEach(() => { global.IS_REACT_ACT_ENVIRONMENT = true; container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });
const defaults = () => ({ doc: { kind: "exhibition" }, update: jest.fn(), exhibition: "X1", setExhibition: jest.fn(),
  exhibitions: [{ id: "X1", name: "Test Exhibition", venue: "Test Venue", startDate: "2026-11-01", endDate: "2026-11-03" }],
  past: false, setPast: jest.fn(), loading: false, busy: false, tax: null,
  searchCustomers: jest.fn().mockResolvedValue([{ id: 7, name: "Example Customer", booth: "A01" }]), selectCustomer: jest.fn(), switchKind: jest.fn() });
test("uses existing select style and offers exactly two project types", () => {
  const props = defaults(); act(() => root.render(<WorkCustomerFields {...props} />));
  const selects = container.querySelectorAll("select");
  expect([...selects[0].options].map(o => o.text)).toEqual(["Exhibition", "Other"]);
  selects.forEach(s => expect(s.className).toContain("cmb"));
  expect(container.textContent).toContain("Show Finished Exhibitions");
});
test("Enter opens a two-column modal and uses booth search before selecting a customer", async () => {
  const props = defaults(); act(() => root.render(<WorkCustomerFields {...props} />));
  act(() => Simulate.change(container.querySelectorAll("select")[2], { target: { value: "booth" } }));
  const input = container.querySelector('input[type="text"],input:not([type])');
  act(() => Simulate.change(input, { target: { value: "A01" } }));
  expect(props.searchCustomers).not.toHaveBeenCalled();
  await act(async () => { Simulate.keyDown(input, { key: "Enter" }); });
  expect(props.searchCustomers).toHaveBeenCalledWith("A01", "booth");
  const modal = container.querySelector('[role="dialog"]');
  expect([...modal.querySelectorAll("th")].map(h => h.textContent)).toEqual(["Customer Name", "Booth Number"]);
  expect(modal.textContent).toContain("A01");
  act(() => Simulate.click([...modal.querySelectorAll("button")].find(b => b.textContent === "Example Customer")));
  expect(props.selectCustomer).toHaveBeenCalledWith("7");
  expect(container.querySelector('[role="dialog"]')).toBeNull();
});
test("Other accepts manual project and customer data without exhibition lookup controls", () => {
  const props = defaults(); props.doc = { kind: "other", project: "", venue: "", startDate: "", endDate: "", manualCustomer: { name: "", street: "", taxId: "", branch: "" } };
  act(() => root.render(<WorkCustomerFields {...props} />));
  expect(container.querySelectorAll("select")).toHaveLength(1);
  expect(container.querySelectorAll('input[type="date"]')).toHaveLength(2);
  expect(container.textContent).toContain("Customer Name");
  expect(container.textContent).toContain("Address");
  expect(container.textContent).not.toContain("Search By");
  const nameLabel = [...container.querySelectorAll("label")].find(l => l.textContent === "Customer Name");
  act(() => Simulate.change(nameLabel.querySelector("input"), { target: { value: "Manual Customer" } }));
  expect(props.update).toHaveBeenCalledWith({ manualCustomer: { name: "Manual Customer", street: "", taxId: "", branch: "" } });
});
test("selected customers open the address editor instead of navigating to Customer Detail", () => {
  const props = defaults(); props.customerId = "7";
  props.editAddress = jest.fn();
  props.tax = { name: "Example Customer", street: "Address", taxId: "123", branch: "1", booths: [] };
  act(() => root.render(<WorkCustomerFields {...props} />));
  const edit = container.querySelector('button[aria-label="Edit Customer Address"]');
  act(() => Simulate.click(edit));
  expect(props.editAddress).toHaveBeenCalledTimes(1);
  expect(container.querySelector('a[href*="customerDetail"]')).toBeNull();
});
test("a missing or ambiguous tax address can still be corrected through the address editor", () => {
  const props = defaults(); props.customerId = "7"; props.editAddress = jest.fn();
  act(() => root.render(<WorkCustomerFields {...props} />));
  act(() => Simulate.click(container.querySelector('button[aria-label="Edit Customer Address"]')));
  expect(props.editAddress).toHaveBeenCalledTimes(1);
});
test("Manual Input bypasses customer lookup and clears previously selected customer", () => {
  const props = defaults(); act(() => root.render(<WorkCustomerFields {...props} />));
  act(() => Simulate.change(container.querySelectorAll("select")[2], { target: { value: "manual" } }));
  expect(props.update).toHaveBeenCalledWith({ customerInputMode: "manual" });
  expect(props.selectCustomer).toHaveBeenCalledWith("");
  expect(container.textContent).toContain("Customer Name");
  expect(container.textContent).toContain("Address");
  expect(container.querySelector('button.btn-primary')).toBeNull();
  expect(props.searchCustomers).not.toHaveBeenCalled();
});
