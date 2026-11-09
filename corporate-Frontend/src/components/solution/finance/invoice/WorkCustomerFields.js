import { formatInvoiceDate } from "./invoiceValues";
import InvoiceTaxIdLookup from "./InvoiceTaxIdLookup";
import { taxBranchLabel } from "./taxBranchLabel";
import { MdEdit, MdClose } from "react-icons/md";
import React, { useEffect, useRef, useState } from "react";

export default function WorkCustomerFields({
  doc,
  update,
  exhibition,
  setExhibition,
  exhibitions,
  past,
  setPast,
  loading,
  busy,
  tax,
  customerId,
  searchCustomers,
  selectCustomer,
  switchKind,
  editAddress,
  searchByTaxId,
  saveTaxCustomer,
  chooseTaxCustomer,
}) {
  const [searchBy, setSearchBy] = useState("name");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const searchBox = useRef(null);
  const closeButton = useRef(null);
  useEffect(() => {
    setSearchBy("name");
  }, [doc.kind]);
  const selected = exhibitions.find((e) => e.id === exhibition);
  useEffect(() => {
    generation.current++;
    setOpen(false);
    setRows([]);
    setQuery("");
  }, [exhibition, doc.kind, searchBy]);
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    closeButton.current?.focus();
    const keydown = (e) => {
      if (e.key === "Escape") {
        generation.current++;
        setOpen(false);
      }
      if (e.key === "Tab") {
        const controls = [
          ...dialog.current.querySelectorAll("button:not(:disabled)"),
        ];
        const first = controls[0],
          last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, [open]);
  const dialog = useRef(null);
  const search = async () => {
    if (!exhibition || busy) return;
    const version = ++generation.current;
    setOpen(true);
    setSearching(true);
    setError("");
    setRows([]);
    try {
      const found = await searchCustomers(query.trim(), searchBy);
      if (version === generation.current) setRows(found);
    } catch {
      if (version === generation.current)
        setError("Unable to search customers. Please try again.");
    } finally {
      if (version === generation.current) setSearching(false);
    }
  };
  const close = () => {
    generation.current++;
    setOpen(false);
    searchBox.current?.focus();
  };
  const field = (label, key, type = "text") => (
    <label className="block">
      {label}
      <input
        className="w-full"
        type={type}
        value={doc[key]}
        onChange={(e) => update({ [key]: e.target.value })}
      />
    </label>
  );
  const manual = doc.manualCustomer || {
    name: "",
    street: "",
    taxId: "",
    branch: "",
  };
  const manualFields = (
    <>
      {[
        ["Customer Name", "name"],
        ["Address", "street"],
        ["Tax ID (Optional)", "taxId"],
        ["Branch (Optional)", "branch"],
      ].map(([label, key]) => (
        <label className="block" key={key}>
          {label}
          {key === "street" ? (
            <textarea
              className="w-full"
              maxLength={1000}
              value={manual[key]}
              onChange={(e) =>
                update({ manualCustomer: { ...manual, [key]: e.target.value } })
              }
            />
          ) : (
            <input
              className="w-full"
              maxLength={key === "taxId" ? 13 : 250}
              value={manual[key]}
              onChange={(e) =>
                update({ manualCustomer: { ...manual, [key]: e.target.value } })
              }
            />
          )}
        </label>
      ))}
    </>
  );
  return (
    <>
      <fieldset disabled={busy} className="grid md:grid-cols-2 gap-4">
        <fieldset className="border border-zinc-300 rounded-md p-4 bg-white space-y-3">
          <legend className="text-red-600 px-2">Project Information</legend>
          <label className="block">
            Project Type
            <select
              className="cmb w-full"
              value={doc.kind || "exhibition"}
              onChange={(e) => switchKind(e.target.value)}>
              <option value="exhibition">Exhibition</option>
              <option value="other">Other</option>
            </select>
          </label>
          {doc.kind !== "other" ? (
            <>
              <label className="block">
                Exhibition
                <select
                  className="cmb w-full"
                  disabled={loading}
                  value={exhibition}
                  onChange={(e) => {
                    if (searchBy === "taxId")
                      update({
                        customerInputMode: "manual",
                        manualCustomer: null,
                        taxIdAddressId: null,
                      });
                    setExhibition(e.target.value);
                  }}>
                  <option value="">Select an exhibition</option>
                  {exhibitions.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.id})
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex gap-2 justify-end">
                <input
                  type="checkbox"
                  className="accent-red-500"
                  checked={past}
                  onChange={(e) => setPast(e.target.checked)}
                />
                Show Finished Exhibitions
              </label>
              <div>
                <span className="text-gray-500">Venue: </span>
                {selected?.venue || "—"}
              </div>
              <div>
                <span className="text-gray-500">Dates: </span>
                {selected
                  ? `${formatInvoiceDate(selected.startDate)} – ${formatInvoiceDate(selected.endDate)}`
                  : "—"}
              </div>
            </>
          ) : (
            <>
              {field("Project Name", "project")}
              {field("Venue", "venue")}
              <div className="grid grid-cols-2 gap-3">
                {field("Start Date", "startDate", "date")}
                {field("End Date", "endDate", "date")}
              </div>
            </>
          )}
        </fieldset>
        <fieldset className="border border-zinc-300 rounded-md p-4 bg-white space-y-3">
          <legend className="text-red-600 px-2">Customer Information</legend>
          {doc.kind !== "other" ? (
            <>
              <label className="block">
                Search By
                <select
                  className="cmb w-full"
                  value={searchBy}
                  onChange={(e) => {
                    setSearchBy(e.target.value);
                    selectCustomer("");
                    update({
                      customerInputMode:
                        e.target.value === "manual" ||
                        e.target.value === "taxId"
                          ? "manual"
                          : "lookup",
                      ...(e.target.value === "taxId"
                        ? { manualCustomer: null, taxIdAddressId: null }
                        : {}),
                    });
                  }}>
                  <option value="name">Exhibitor Name</option>
                  <option value="booth">Booth Number</option>
                  {searchByTaxId && (
                    <option value="taxId">Tax ID (New Customer Only)</option>
                  )}
                  <option value="manual">Manual Input</option>
                </select>
              </label>
              {searchBy === "taxId" && (
                <InvoiceTaxIdLookup
                  key={exhibition}
                  disabled={busy || !exhibition}
                  search={searchByTaxId}
                  addCustomer={saveTaxCustomer}
                  onSelectAddress={chooseTaxCustomer}
                />
              )}
              {searchBy === "manual" ||
              (searchBy === "taxId" && doc.customerInputMode === "manual") ? (
                searchBy === "manual" || manual.name ? (
                  manualFields
                ) : null
              ) : (
                <>
                  {searchBy !== "taxId" && (
                    <label className="block">
                      {searchBy === "name" ? "Exhibitor Name" : "Booth Number"}
                      <div className="flex gap-2">
                        <input
                          ref={searchBox}
                          className="w-full disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                          maxLength={100}
                          disabled={!exhibition}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              search();
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="btn-primary px-3 disabled:cursor-not-allowed disabled:!border-gray-400 disabled:!bg-slate-300 disabled:!text-gray-600"
                          disabled={!exhibition}
                          onClick={search}>
                          Search
                        </button>
                      </div>
                    </label>
                  )}
                  {customerId && (
                    <div className="flex items-center justify-between gap-2 text-gray-600">
                      <p>{tax?.name || "Customer Address"}</p>
                      <button
                        type="button"
                        onClick={editAddress}
                        title="Edit Customer Address"
                        aria-label="Edit Customer Address"
                        className="shrink-0 text-red-600 hover:text-red-800 p-1">
                        <MdEdit size={20} />
                      </button>
                    </div>
                  )}
                  {tax && (
                    <div className="text-gray-600 space-y-1">
                      <p>
                        {[
                          tax.street,
                          tax.subDistrict,
                          tax.district,
                          tax.province,
                          tax.postal,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                      <p>
                        Tax ID: {tax.taxId} ·{" "}
                        {taxBranchLabel(tax.branch, tax.subBranch)}
                      </p>
                      <p>Booths: {tax.booths.map((b) => b.booth).join(", ")}</p>
                      <p>
                        Sales:{" "}
                        {[
                          ...new Set(
                            tax.booths.map((b) => b.sales).filter(Boolean),
                          ),
                        ].join(", ")}
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            manualFields
          )}
        </fieldset>
      </fieldset>
      {open && (
        <div
          className="fixed inset-0 z-[80] bg-gray-900 bg-opacity-50 p-4 flex items-start justify-center pt-[100px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}>
          <div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-customer-search-title"
            className="relative bg-white rounded-lg shadow w-full max-w-3xl">
            <header className="p-4 border-b flex justify-between items-center">
              <h2
                id="invoice-customer-search-title"
                className="text-xl font-semibold">
                Customer Search
              </h2>
              <button
                ref={closeButton}
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
                onClick={close}
                aria-label="Close customer search">
                <MdClose size={24} aria-hidden="true" />
              </button>
            </header>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {searching ? (
                <p role="status">Searching…</p>
              ) : error ? (
                <p role="alert">{error}</p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2">Customer Name</th>
                      <th className="p-2">Booth Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={`${row.id}-${row.booth}-${i}`}
                        className="border-b hover:bg-red-50">
                        <td className="p-2">
                          <button
                            className="text-left w-full"
                            type="button"
                            onClick={() => {
                              selectCustomer(String(row.id));
                              close();
                            }}>
                            {row.name}
                          </button>
                        </td>
                        <td className="p-2">{row.booth || "—"}</td>
                      </tr>
                    ))}
                    {!rows.length && (
                      <tr>
                        <td colSpan={2} className="p-3 text-gray-500">
                          No customers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <footer className="p-4 border-t flex justify-end">
              <button
                type="button"
                className="btn-primary px-4"
                onClick={close}>
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
