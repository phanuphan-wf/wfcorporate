import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { taxBranchLabel } from "./taxBranchLabel";

export const normalizeTaxId = value => value.replace(/[\s-]/g, "");
export const addressText = address => [address.street, address.subDistrict, address.district,
  address.province, address.postal].filter(Boolean).join(" ");

export default function InvoiceTaxIdLookup({ disabled, search, onSelectAddress, addCustomer }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [selected, setSelected] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [name, setName] = useState("");
  const [postal, setPostal] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef(null);

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, [open]);

  const close = () => {
    if (!busy) setOpen(false);
  };

  const lookup = async event => {
    event.preventDefault();
    if (disabled || busy) return;
    const taxId = normalizeTaxId(input);
    setError("");
    if (!/^[0-9]{13}$/.test(taxId)) {
      setError("Enter a 13-digit Tax ID.");
      return;
    }

    setResult(null);
    setSelected(null);
    setBusy(true);
    setOpen(true);
    try {
      const data = await search(taxId);
      const addresses = [
        ...data.addresses.filter(address => address.source === "dbd"),
        ...data.addresses.filter(address => address.source !== "dbd"),
      ];
      setResult({ ...data, addresses });
    } catch (exception) {
      setError(typeof exception.response?.data === "string"
        ? exception.response.data : "Unable to search for this Tax ID.");
    } finally {
      setBusy(false);
    }
  };

  const choose = address => {
    setSelected(address);
    setPostal(address.postal || "");
    setCustomerId(String(address.customerId || (result.customers.length === 1 ? result.customers[0].id : "")));
    setTypeId("");
    setName(address.name);
  };

  const needsCustomer = selected?.source === "dbd" && result?.customers.length === 0;
  const needsTarget = selected?.source === "dbd" && result?.customers.length > 1;
  const addBlocked = selected?.source === "dbd" &&
    (!/^[0-9]{5}$/.test(postal) || (needsCustomer && (!typeId || !name.trim())) || (needsTarget && !customerId));

  const chooseType = value => {
    setTypeId(value);
    const type = result.types.find(item => String(item.id) === value);
    let customerName = selected.name.trim();
    const typeName = type?.name?.trim();
    const fullPrefixes = { "หจก.": "ห้างหุ้นส่วนจำกัด", "หสม.": "ห้างหุ้นส่วนสามัญนิติบุคคล" };
    const fullPrefix = fullPrefixes[typeName];
    const prefix = fullPrefix && customerName.startsWith(fullPrefix) ? fullPrefix : typeName;
    const suffix = type?.suffix?.trim();
    if (prefix && customerName.startsWith(prefix)) customerName = customerName.slice(prefix.length).trim();
    if (suffix && customerName.endsWith(suffix)) customerName = customerName.slice(0, -suffix.length).trim();
    setName(customerName);
  };

  const confirm = async add => {
    if (busy || !selected || (add && addBlocked)) return;
    setError("");
    setBusy(true);
    try {
      const address = add ? await addCustomer({
        taxId: selected.taxId,
        addressId: selected.addressId,
        addressKey: selected.addressKey,
        customerId: customerId ? Number(customerId) : null,
        typeId: typeId ? Number(typeId) : null,
        name: needsCustomer ? name.trim() : null,
        postal: selected.source === "dbd" ? postal : null,
      }) : { ...selected, postal };
      onSelectAddress(address, add);
      setOpen(false);
    } catch (exception) {
      setError(typeof exception.response?.data === "string"
        ? exception.response.data : "Unable to save the customer.");
    } finally {
      setBusy(false);
    }
  };

  return <>
    <form onSubmit={lookup}>
      <label className="block" htmlFor="invoice-tax-id-search">Tax ID</label>
      <div className="flex gap-2">
        <input id="invoice-tax-id-search" className="w-full disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500" inputMode="numeric"
          maxLength={40} disabled={disabled || busy} value={input} onChange={event => setInput(event.target.value)} />
        <button type="submit"
          className="btn-primary px-3 disabled:cursor-not-allowed disabled:!border-gray-400 disabled:!bg-slate-300 disabled:!text-gray-600"
          disabled={disabled || busy}>Search</button>
      </div>
      {!open && error && <p role="alert" className="text-red-600">{error}</p>}
    </form>
    {open && <dialog ref={dialog} aria-labelledby="invoice-tax-id-title"
      onCancel={event => { event.preventDefault(); close(); }}
      className="m-auto w-[calc(100%-2rem)] max-w-3xl max-h-[85vh] overflow-y-auto rounded-lg bg-white p-0 shadow-lg backdrop:bg-black/50">
      <header className="flex items-center justify-between border-b p-4">
        <h2 id="invoice-tax-id-title" className="m-0 text-xl font-semibold">
          {selected ? "Confirm Customer Address" : "Tax ID Search"}
        </h2>
        <button type="button" aria-label="Close Tax ID search" disabled={busy} onClick={close}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200">
          <MdClose size={24} aria-hidden="true" />
        </button>
      </header>
      <div className="p-4">
        {error && <p role="alert" className="text-red-600">{error}</p>}
        {busy && <p role="status">{selected ? "Saving customer…" : "Searching…"}</p>}
        {selected ? <div className="space-y-2">
          <p className="font-semibold">{selected.name}</p>
          <p>{addressText(selected)}</p>
          <p>{selected.taxId} · {taxBranchLabel(selected.branch, selected.subBranch)}</p>
          <p>{selected.addressId
            ? "Use the saved customer from our database or use this address for this invoice only."
            : "Add this address to our database or use it for this invoice only."}</p>
          {needsTarget && <label className="block">Existing Customer
            <select className="cmb w-full" value={customerId} disabled={busy} onChange={event => setCustomerId(event.target.value)}>
              <option value="">Select a customer</option>
              {result.customers.map(item => <option key={item.id} value={item.id}>{item.name} ({item.id})</option>)}
            </select>
          </label>}
          {needsCustomer && <>
            <label className="block">Customer Type
              <select className="cmb w-full" value={typeId} disabled={busy} onChange={event => chooseType(event.target.value)}>
                <option value="">Select a customer type</option>
              {result.types.map(type => <option key={type.id} value={type.id}>
                {[type.name, type.suffix].filter(Boolean).join(" ") || "No prefix or suffix"}
              </option>)}
              </select>
            </label>
            <label className="block">Customer Name (without prefix or suffix)
              <input className="w-full" value={name} maxLength={150} disabled={busy} onChange={event => setName(event.target.value)} />
            </label>
          </>}
          {selected.source === "dbd" && <label className="block">Postal Code
            <input className="w-full" inputMode="numeric" value={postal} maxLength={5}
              disabled={busy} onChange={event => setPostal(event.target.value)} />
          </label>}
          <div className="flex flex-wrap justify-end gap-2 pt-4">
            <button type="button" className="px-3 py-1" disabled={busy}
              onClick={() => { setSelected(null); setError(""); }}>Back</button>
            <button type="button" className="border rounded px-3 py-1" disabled={busy}
              onClick={() => confirm(false)}>Use for Invoice Only</button>
            <button type="button" className="btn-primary px-3 py-1" disabled={busy || addBlocked}
              onClick={() => confirm(true)}>{selected.addressId ? "Use Saved Customer" : "Add to our database"}</button>
          </div>
        </div> : result && <>
          {result.warning && <p role="status" className="mb-3">{result.warning}</p>}
          {result.addresses.length ? <table className="w-full text-left">
            <thead><tr className="border-b">
              <th className="p-2">Customer and Address</th>
              <th className="p-2">Source</th>
            </tr></thead>
            <tbody>{result.addresses.map((address, index) => <tr key={index}
              className={address.source === "dbd" ? "border-b bg-green-50" : "border-b"}>
              <td className="p-2">
                <button type="button" className="w-full text-left hover:text-red-600"
                  disabled={!address.name || !address.street} onClick={() => choose(address)}>
                  <span className="block font-medium">{address.name}</span>
                  <span className="block">{addressText(address)}</span>
                  <span className="block text-gray-500">{taxBranchLabel(address.branch, address.subBranch)}</span>
                </button>
              </td>
              <td className="p-2">{address.source === "dbd" ? "DBD" : "In our database"}</td>
            </tr>)}</tbody>
          </table> : <p>No customer addresses found.</p>}
        </>}
      </div>
    </dialog>}
  </>;
}
