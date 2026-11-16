import React, { useEffect, useId, useRef, useState } from "react";
import Axios from "axios";
import { MdClose } from "react-icons/md";
import { formatInvoiceDate, money } from "./invoiceValues";

function SearchDialog({ title, close, wide = false, children }) {
  const dialog = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);

  return (
    <dialog ref={dialog} aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); close(); }}
      className={`m-auto w-[calc(100%-2rem)] ${wide ? "max-w-6xl" : "max-w-xl"} max-h-[85vh] overflow-y-auto rounded-lg bg-white p-0 shadow-lg backdrop:bg-black/50`}>
      <header className="flex items-center justify-between border-b p-4">
        <h2 id={titleId} className="m-0 text-xl font-semibold">{title}</h2>
        <button type="button" aria-label="Close" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500" onClick={close}><MdClose size={24} aria-hidden="true" /></button>
      </header>
      <div className="p-4">{children}</div>
    </dialog>
  );
}

export default function InvoiceSearchModal({ url, token, close, openInvoice, busy }) {
  const [number, setNumber] = useState("");
  const [filterDate, setFilterDate] = useState(false);
  const [filters, setFilters] = useState({ from: "", to: "", exhibitionId: "" });
  const [exhibitions, setExhibitions] = useState([]);
  const [exhibitionError, setExhibitionError] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [showCustomers, setShowCustomers] = useState(false);
  const [query, setQuery] = useState(null);
  const [results, setResults] = useState([]);
  const [nextBeforeId, setNextBeforeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const headers = { Authorization: "Bearer " + token };

  useEffect(() => {
    const request = new AbortController();
    Axios.get(url + "/exhibitions", {
      headers: { Authorization: "Bearer " + token },
      params: { forSearch: true },
      signal: request.signal,
    }).then(response => setExhibitions(response.data))
      .catch(() => { if (!request.signal.aborted) setExhibitionError(true); });
    return () => request.abort();
  }, [url, token]);

  const search = async (params, cursor = null) => {
    setLoading(true);
    setError("");
    if (cursor == null) {
      setQuery(params);
      setResults([]);
      setNextBeforeId(null);
    }
    try {
      const { data } = await Axios.get(url + "/records", {
        headers, params: { ...params, beforeId: cursor },
      });
      setResults(previous => cursor == null ? data.results : [...previous, ...data.results]);
      setNextBeforeId(data.nextBeforeId);
    } catch (error) {
      setError(typeof error.response?.data === "string" ? error.response.data : "Unable to search invoices.");
    } finally {
      setLoading(false);
    }
  };

  const searchByFilters = event => {
    event.preventDefault();
    search({
      exhibitionId: filters.exhibitionId,
      from: filterDate ? filters.from : undefined,
      to: filterDate ? filters.to : undefined,
      customerId: customer?.id,
      manualCustomer: customer && customer.id == null ? customer.name : undefined,
    });
  };

  return (
    <SearchDialog title="Search Invoice" close={close} wide>
        <form className="flex flex-wrap items-end gap-3 border-b pb-4" onSubmit={event => {
          event.preventDefault();
          if (number.trim()) search({ number: number.trim() });
        }}>
          <label className="block">
            Invoice Number
            <input className="block" maxLength={12} value={number} placeholder="20261100123"
              onChange={event => setNumber(event.target.value.replace(/^IV[-\s]*/i, ""))} />
          </label>
          <button type="submit" className="btn-primary px-3 py-1" disabled={loading || !number.trim()}>
            Search Number
          </button>
        </form>

        <form className="mt-4 flex flex-wrap gap-3 items-end" onSubmit={searchByFilters}>
          <div>
            <div>Customer</div>
            <button type="button" className="border rounded px-2 py-1" onClick={() => setShowCustomers(true)}>
              {customer?.name || "Find Customer"}
            </button>
            {customer && <button type="button" className="ml-2 underline" onClick={() => setCustomer(null)}>Clear</button>}
          </div>
          <label>
            Exhibition
            <select className="cmb block max-w-xs" value={filters.exhibitionId}
              onChange={event => setFilters({ ...filters, exhibitionId: event.target.value })}>
              <option value="">All Exhibitions</option>
              {exhibitions.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <fieldset className="flex flex-wrap items-end gap-3">
            <legend className="text-base mb-1">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={filterDate}
                  onChange={event => setFilterDate(event.target.checked)} />
                Filter by Date
              </label>
            </legend>
          <label>
            From
            <input className="block disabled:bg-gray-200 disabled:text-gray-400" type="date" disabled={!filterDate} value={filters.from}
              onChange={event => setFilters({ ...filters, from: event.target.value })} />
          </label>
          <label>
            To
            <input className="block disabled:bg-gray-200 disabled:text-gray-400" type="date" disabled={!filterDate} value={filters.to}
              onChange={event => setFilters({ ...filters, to: event.target.value })} />
          </label>
          </fieldset>
          <button type="submit" className="btn-primary px-3 py-1"
            disabled={loading || !((filterDate && (filters.from || filters.to)) || filters.exhibitionId || customer)}>
            Search by Filters
          </button>
        </form>
        {exhibitionError && <p role="alert" className="mt-2 text-red-700">Unable to load exhibitions.</p>}
        {error && <p role="alert" className="mt-2 text-red-700">{error}</p>}
        {loading && <p role="status" className="mt-2">Searching…</p>}
        {query && !loading && !error && results.length === 0 && <p className="mt-3">No invoices found.</p>}
        {results.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left [&_td]:!border-x-0">
              <thead>
                <tr className="border-b">
                  {["Invoice Number", "Issue Date", "Project", "Customer Name", "Total Payable"].map(label =>
                    <th key={label} className="p-2">{label}</th>)}
                </tr>
              </thead>
              <tbody>
                {results.map(record => (
                  <tr key={record.id} className="border-b hover:bg-gray-50"
                    onClick={record.canPrint && !busy ? async () => {
                      const message = await openInvoice(record.id);
                      if (message) setError(message);
                    } : undefined}>
                    <td className="p-2">
                      <button type="button" className="whitespace-nowrap enabled:underline"
                        disabled={busy || !record.canPrint}>
                        IV-{record.book}{record.number}
                      </button>
                      {record.cancelled && <span className="ml-1 text-xs">Cancelled</span>}
                    </td>
                    <td className="p-2 whitespace-nowrap">{formatInvoiceDate(record.date) || "—"}</td>
                    <td className="p-2">{record.project || "—"}</td>
                    <td className="p-2">{record.customer || "—"}</td>
                    <td className="p-2 text-right whitespace-nowrap">{record.totalPayable == null ? "—" : money(record.totalPayable)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {nextBeforeId && <button type="button" className="mt-3 border rounded px-3 py-1"
          disabled={loading} onClick={() => search(query, nextBeforeId)}>Load More</button>}
      {showCustomers && <InvoiceCustomerSearch url={url} headers={headers}
        close={() => setShowCustomers(false)}
        select={item => { setCustomer(item); setShowCustomers(false); }} />}
    </SearchDialog>
  );
}

function InvoiceCustomerSearch({ url, headers, close, select }) {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [status, setStatus] = useState("idle");

  const find = async event => {
    event.preventDefault();
    if (!search.trim() || status === "loading") return;
    setStatus("loading");
    setCustomers([]);
    try {
      const { data } = await Axios.get(url + "/invoice-customers", { headers, params: { search: search.trim() } });
      setCustomers(data);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <SearchDialog title="Find Customer" close={close}>
        <form className="flex gap-2 items-end" onSubmit={find}>
          <label className="flex-1">
            Customer Name
            <input className="block w-full" value={search} maxLength={100}
              onChange={event => setSearch(event.target.value)} />
          </label>
          <button type="submit" className="btn-primary px-3 py-1"
            disabled={!search.trim() || status === "loading"}>Search</button>
        </form>
        {status === "loading" && <p role="status">Searching…</p>}
        {status === "error" && <p role="alert">Unable to search customers.</p>}
        {status === "done" && customers.length === 0 && <p>No customers found.</p>}
        <ul className="mt-3 p-0">
          {customers.map(item => (
            <li className="border-b" key={item.id == null ? "manual:" + item.name : item.id}>
              <button type="button" className="w-full text-left p-2 hover:bg-gray-50" onClick={() => select(item)}>
                {item.name}{item.id == null && <span className="ml-2 text-xs text-gray-500">Manual</span>}
              </button>
            </li>
          ))}
        </ul>
    </SearchDialog>
  );
}
