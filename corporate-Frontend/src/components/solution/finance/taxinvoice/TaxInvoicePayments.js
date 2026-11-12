import React from "react";
import { money, formatInvoiceDate } from "../invoice/invoiceValues";
import { emptyPayment, paymentLabel, paymentMethods, paymentTotals, taxInvoiceVatRate } from "./taxInvoiceValues";

function paymentDetails(row) {
  const date = formatInvoiceDate(row.date);
  const details = {
    transfer: [row.bank, date],
    creditCard: [row.bank, row.detail],
  }[row.method] || [row.bank, row.branch, row.reference, row.detail, date];
  return details.filter(Boolean).join(" · ") || "—";
}

export default function TaxInvoicePayments({
  payments, setPayments, manual, selectedPayments, selectedIds, setSelectedIds,
  includesVat, setIncludesVat, busy,
}) {
  const available = payments.filter(row => !row.receipted);
  const selectableIds = available.filter(row => row.id != null).map(row => row.id);
  const selectedCount = selectableIds.filter(id => selectedIds.has(id)).length;
  const allSelected = selectableIds.length > 0 && selectedCount === selectableIds.length;
  const showSelection = payments.some(row => row.id != null);
  const sum = paymentTotals(selectedPayments, includesVat);
  const selectPayment = (id, checked) => setSelectedIds(previous => {
    const next = new Set(previous);
    if (checked) next.add(id);
    else next.delete(id);
    return next;
  });
  const update = (index, patch) => setPayments(rows => rows.map((row, i) => i === index ? { ...row, ...patch } : row));
  const input = (row, index, label, key, type = "text") => (
    <label key={key}>{label}
      <input className="block w-full" type={type} value={row[key]}
        min={type === "number" ? "0" : undefined} step={type === "number" ? "0.01" : undefined}
        onChange={event => update(index, { [key]: event.target.value })} />
    </label>
  );

  return (
    <fieldset disabled={busy} className="mt-5 border rounded-lg p-4 bg-white">
      <legend className="px-2 text-red-700">Payment Details</legend>
      {manual && payments.map((row, index) => (
        <fieldset key={index} className="mb-3 rounded border p-3">
          <legend className="px-2 text-sm font-semibold">Payment {index + 1}</legend>
          <div className="grid gap-3 md:grid-cols-3">
            <label>Method
              <select className="cmb block w-full" value={row.method}
                onChange={event => update(index, {
                  ...emptyPayment(), method: event.target.value, amount: row.amount,
                  receivedDate: row.receivedDate,
                })}>
                {paymentMethods.map(method => <option key={method.value} value={method.value}>{method.label}</option>)}
              </select>
            </label>
            {input(row, index, "Amount Received", "amount", "number")}
            {input(row, index, "Received Date", "receivedDate", "date")}
            {row.method !== "cash" && input(row, index, "Bank", "bank")}
            {row.method === "cheque" && input(row, index, "Branch", "branch")}
            {row.method !== "cash" && input(row, index, {
              transfer: "Transfer Reference", cheque: "Cheque Number", creditCard: "Slip Reference",
            }[row.method], "reference")}
            {row.method === "cheque" && input(row, index, "Cheque Date", "date", "date")}
          </div>
          <button type="button" className="mt-2 text-red-700 underline"
            onClick={() => setPayments(rows => rows.filter((_, i) => i !== index))}>Remove Payment {index + 1}</button>
        </fieldset>
      ))}
      {manual && <button type="button" className="rounded border px-3 py-1"
        onClick={() => setPayments(rows => [...rows, emptyPayment()])}>Add Payment</button>}
      {!manual && payments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr>
              {showSelection && <th scope="col" className="p-2">
                <label className="flex items-center gap-2 whitespace-nowrap">
                  <input type="checkbox" checked={allSelected} disabled={!selectableIds.length}
                    ref={element => {
                      if (element) element.indeterminate = selectedCount > 0 && !allSelected;
                    }}
                    onChange={event => setSelectedIds(new Set(event.target.checked ? selectableIds : []))} />
                  Select all
                </label>
              </th>}
              {["Method", "Details", "Received Date", "Received (THB)", "Receipt"].map(label =>
              <th key={label} scope="col" className="p-2">{label}</th>)}</tr></thead>
            <tbody>{payments.map((row, index) => (
              <tr key={row.id ?? index} className="border-t">
                {showSelection && <td className="p-2">
                  {row.id != null && <input type="checkbox" aria-label={`Select payment ${index + 1}`}
                    checked={!row.receipted && selectedIds.has(row.id)}
                    disabled={row.receipted}
                    onChange={event => selectPayment(row.id, event.target.checked)} />}
                </td>}
                <td className="p-2">{paymentLabel(row)}</td>
                <td className="p-2">{paymentDetails(row)}</td>
                <td className="p-2">{formatInvoiceDate(row.receivedDate) || "—"}</td>
                <td className="p-2">{money(row.amount)}</td>
                <td className="p-2">{row.receipted ? "Issued" : "—"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {!manual && payments.length > 0 && !available.length && <p className="mt-3">All listed payments have already been receipted.</p>}
      {!manual && available.length > 0 && selectedPayments.length === 0 &&
        <p className="mt-3">Select the payments to include in this Tax Invoice.</p>}
      {selectedPayments.length > 0 && <div className="mt-4 rounded bg-gray-100 p-3 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={includesVat} onChange={event => setIncludesVat(event.target.checked)} />
          Amount includes VAT {taxInvoiceVatRate}%
        </label>
        <dl className="mb-0 mt-3 grid gap-2 sm:grid-cols-3">
          {includesVat && <div><dt>Amount Before VAT</dt><dd className="font-semibold">{money(sum.subtotal)} THB</dd></div>}
          <div><dt>{includesVat ? `VAT ${taxInvoiceVatRate}%` : "No VAT"}</dt><dd className="font-semibold">{money(sum.vat)} THB</dd></div>
          <div><dt>Amount Received</dt><dd className="font-semibold">{money(sum.total)} THB</dd></div>
        </dl>
      </div>}
    </fieldset>
  );
}
