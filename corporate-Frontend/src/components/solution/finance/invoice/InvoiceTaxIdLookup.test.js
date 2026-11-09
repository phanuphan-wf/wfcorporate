import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Simulate } from "react-dom/test-utils";
import InvoiceTaxIdLookup from "./InvoiceTaxIdLookup";

test.each([false, true])("Tax ID confirmation writes to the register only when chosen (%s)", async add => {
  const address = {
    name: "บริษัท ตัวอย่าง จำกัด", street: "123 Main Road", postal: "10110",
    taxId: "0123456789012", branch: "1", source: "dbd", addressKey: "address-key",
  };
  const saved = { ...address, customerId: 42, addressId: 15 };
  const search = jest.fn().mockResolvedValue({
    addresses: [address], customers: [], types: [{ id: 7, name: "บริษัท", suffix: "จำกัด" }],
  });
  const addCustomer = jest.fn().mockResolvedValue(saved);
  const onSelectAddress = jest.fn();
  const showModal = HTMLDialogElement.prototype.showModal;
  const close = HTMLDialogElement.prototype.close;
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const button = label => [...container.querySelectorAll("button")].find(element => element.textContent.includes(label));
  global.IS_REACT_ACT_ENVIRONMENT = true;
  try {
    act(() => root.render(<InvoiceTaxIdLookup search={search} onSelectAddress={onSelectAddress} addCustomer={addCustomer} />));
    act(() => Simulate.change(container.querySelector("input"), { target: { value: "0-1234 56789-01-2" } }));
    await act(async () => Simulate.submit(container.querySelector("form")));
    expect(search).toHaveBeenCalledWith(address.taxId);
    act(() => Simulate.click(button(address.name)));
    expect(container.querySelector("h2").textContent).toBe("Confirm Customer Address");
    expect(addCustomer).not.toHaveBeenCalled();

    if (add) {
      expect(button("Add to our database").disabled).toBe(true);
      act(() => Simulate.change(container.querySelector("select"), { target: { value: "7" } }));
      await act(async () => Simulate.click(button("Add to our database")));
      expect(addCustomer).toHaveBeenCalledWith(expect.objectContaining({
        taxId: address.taxId, typeId: 7, name: "ตัวอย่าง", postal: "10110",
      }));
      expect(onSelectAddress).toHaveBeenCalledWith(saved, true);
    } else {
      await act(async () => Simulate.click(button("Use for Invoice Only")));
      expect(onSelectAddress).toHaveBeenCalledWith(address, false);
      expect(addCustomer).not.toHaveBeenCalled();
    }
    expect(container.querySelector("dialog")).toBeNull();
  } finally {
    act(() => root.unmount());
    container.remove();
    HTMLDialogElement.prototype.showModal = showModal;
    HTMLDialogElement.prototype.close = close;
  }
});
