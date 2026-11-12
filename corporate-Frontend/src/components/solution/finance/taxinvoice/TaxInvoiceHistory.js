import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { formatInvoiceDate, money } from "../invoice/invoiceValues";

export default function TaxInvoiceHistory({ url, token, close, openRecord, cancelRecord }) {
  const dialog = useRef(null);
  const request = useRef(null);
  const [number, setNumber] = useState("");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [next, setNext] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const load = React.useCallback(async (term, beforeId = null) => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setStatus("loading");
    setError("");
    setQuery(term);
    if (!beforeId) {
      setRows([]);
      setNext(null);
    }
    try {
      const { data } = await Axios.get(url, {
        headers: { Authorization: "Bearer " + token },
        params: { number: term, beforeId },
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      setRows(existing => beforeId ? [...existing, ...data.results] : data.results);
      setNext(data.nextBeforeId);
      setStatus("ready");
    } catch {
      if (controller.signal.aborted) return;
      setStatus("ready");
      setError("Unable to load issued Tax Invoices.");
    }
  }, [url, token]);

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    load("");
    return () => {
      request.current?.abort();
      element.close();
    };
  }, [load]);

  const action = async (run, reload = false) => {
    setStatus("opening");
    setError("");
    const message = await run();
    if (message) setError(message);
    if (reload && !message) await load(query);
    else setStatus("ready");
  };

  return (
    <dialog ref={dialog} aria-labelledby="tax-invoice-history" onCancel={event => { event.preventDefault(); close(); }}
      className="m-auto max-h-[85vh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-lg bg-white p-4 shadow-lg backdrop:bg-black/50">
      <div className="flex items-center justify-between gap-2">
        <h2 id="tax-invoice-history" className="m-0 text-xl font-semibold">Issued Tax Invoices</h2>
        <button type="button" className="rounded border px-3 py-1" onClick={close}>Close</button>
      </div>
      <form className="my-4 flex flex-wrap items-end gap-2" onSubmit={event => { event.preventDefault(); load(number.trim()); }}>
        <label>Tax Invoice Number
          <input className="block" value={number} maxLength={15} onChange={event => setNumber(event.target.value)} />
        </label>
        <button type="submit" className="btn-primary px-3 py-1" disabled={status !== "ready"}>Search</button>
      </form>
      {status === "loading" && <p role="status">Loading issued Tax Invoices…</p>}
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {!rows.length && status === "ready" && !error && <p>No issued Tax Invoices found.</p>}
      {rows.length > 0 && <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr>{["Tax Invoice Number", "Issue Date", "Project", "Customer", "Total (THB)", ...(cancelRecord ? ["Actions"] : [])].map(label =>
            <th key={label} scope="col" className="p-2">{label}</th>)}</tr></thead>
          <tbody>{rows.map(row => <tr key={row.id} className="border-t">
            <td className="whitespace-nowrap p-2">
              {row.canPrint ? <button type="button" className="underline" disabled={status !== "ready"}
                title="Print Tax Invoice" onClick={() => action(() => openRecord(row.id))}>RT-{row.book}{row.number}</button> : <>
                RT-{row.book}{row.number} <span className="text-xs text-gray-600">{row.cancelled ? "Cancelled" : "Legacy"}</span>
              </>}
              {row.replacedBy && <div className="whitespace-nowrap text-xs">Replaced by RT-{row.replacedBy.book}{row.replacedBy.number}</div>}
            </td>
            <td className="p-2">{formatInvoiceDate(row.date)}</td>
            <td className="p-2">{row.project || "—"}</td>
            <td className="p-2">{row.customer || "—"}</td>
            <td className="p-2">{row.total == null ? "—" : money(row.total)}</td>
            {cancelRecord && <td className="p-2">
              {row.canCancel && <button type="button" className="whitespace-nowrap text-red-700 underline"
                disabled={status !== "ready"} onClick={() => {
                  if (window.confirm(`Cancel RT-${row.book}${row.number} and release its linked payments?`)) {
                    action(() => cancelRecord(row.id), true);
                  }
                }}>Cancel Tax Invoice</button>}
            </td>}
          </tr>)}</tbody>
        </table>
      </div>}
      {next && <button type="button" className="mt-3 rounded border px-3 py-1" disabled={status !== "ready"}
        onClick={() => load(query, next)}>Load More</button>}
    </dialog>
  );
}
