import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { useAuth } from "../../../hook/useAuth";
import { canIssueDocuments } from "../documentAccess";
import InvoiceSearchModal from "../invoice/InvoiceSearchModal";
import WorkCustomerFields from "../invoice/WorkCustomerFields";
import { addressText, normalizeTaxId } from "../invoice/InvoiceTaxIdLookup";
import { taxBranchLabel } from "../invoice/taxBranchLabel";
import { usesManualCustomer } from "../invoice/invoiceValues";
import { printInvoiceMarkup, renderInvoicePreview } from "../invoice/InvoicePrint";
import TaxInvoiceHistory from "./TaxInvoiceHistory";
import TaxInvoicePayments from "./TaxInvoicePayments";
import { taxInvoiceMarkup } from "./TaxInvoicePrint";
import { bangkokDate, dateInput, emptyPayment, paymentTotals } from "./taxInvoiceValues";

const url = process.env.REACT_APP_API_URI + "/api/invoice";
const taxUrl = url + "/tax-invoice";
const emptyProject = { project: "", venue: "", startDate: "", endDate: "" };
const projectFields = item => ({
  project: item?.name || "", venue: item?.venue || "",
  startDate: dateInput(item?.startDate), endDate: dateInput(item?.endDate),
});
const manualAddress = tax => ({
  name: tax.name || "", street: addressText(tax), taxId: tax.taxId || "",
  branch: taxBranchLabel(tax.branch, tax.subBranch, "th"),
});

function TaxInvoiceEditor({ user }) {
  const [doc, setDoc] = useState(() => ({
    ...emptyProject, kind: "exhibition", heading: "งานแสดงสินค้า / Exhibition",
    customerInputMode: "lookup", manualCustomer: null,
    date: bangkokDate(), description: "ค่าบริการพื้นที่แสดงสินค้า", note: "",
    includesVat: true, preparedBy: user.name || "", receivedBy: user.name || "", authorizedBy: "",
  }));
  const [exhibitions, setExhibitions] = useState(null);
  const [past, setPast] = useState(false);
  const [exhibition, setExhibition] = useState("");
  const [customer, setCustomer] = useState("");
  const [tax, setTax] = useState(null);
  const [source, setSource] = useState(null);
  const [search, setSearch] = useState(false);
  const [history, setHistory] = useState(false);
  const [issued, setIssued] = useState(null);
  const [paymentRefresh, setPaymentRefresh] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [payments, setPayments] = useState([]);
  const [selectedPaymentIds, setSelectedPaymentIds] = useState(new Set());
  const noPaymentDialog = useRef(null);
  const searchRequest = useRef(null);
  const issueRequest = useRef(null);
  const issuing = useRef(false);
  const token = user.accessToken;
  const canManage = [1, 6].includes(Number(user.Dept)) && Number(user.ALevel) === 1;
  const headers = { Authorization: "Bearer " + token };
  const update = patch => setDoc(value => ({ ...value, ...patch }));

  useEffect(() => {
    const controller = new AbortController();
    const options = { headers: { Authorization: "Bearer " + token }, signal: controller.signal };
    Axios.get(taxUrl + "/exhibitions", options)
      .then(({ data }) => setExhibitions(data))
      .catch(() => {
        if (!controller.signal.aborted) {
          setExhibitions({ active: [], finished: [] });
          setError("Unable to load exhibitions.");
        }
      });
    Axios.get(url + "/defaults", options)
      .then(({ data }) => setDoc(value => ({
        ...value, authorizedBy: value.authorizedBy || data.authorizedBy || "",
      }))).catch(() => {});
    return () => controller.abort();
  }, [token]);

  useEffect(() => {
    if (!exhibition || !customer) return undefined;
    const controller = new AbortController();
    setPaymentStatus("loading");
    Axios.get(taxUrl + "/payments", {
      headers: { Authorization: "Bearer " + token },
      params: { exhibitionId: exhibition, customerId: customer },
      signal: controller.signal,
    }).then(({ data }) => {
      if (controller.signal.aborted) return;
      setPayments(data);
      setSelectedPaymentIds(new Set(data.filter(payment => !payment.receipted).map(payment => payment.id)));
      setPaymentStatus(data.length ? "found" : "missing");
    }).catch(() => {
      if (!controller.signal.aborted) setPaymentStatus("error");
    });
    return () => controller.abort();
  }, [exhibition, customer, token, paymentRefresh]);

  useEffect(() => {
    if (paymentStatus !== "missing") return undefined;
    const dialog = noPaymentDialog.current;
    dialog.showModal();
    return () => dialog.close();
  }, [paymentStatus]);

  useEffect(() => () => searchRequest.current?.abort(), []);

  const clearPayment = () => {
    setPayments([]);
    setSelectedPaymentIds(new Set());
    setPaymentStatus("idle");
  };

  const selectExhibition = id => {
    setExhibition(id);
    setCustomer("");
    setTax(null);
    setSource(null);
    setIssued(null);
    clearPayment();
    update({
      ...projectFields(exhibitions?.[past ? "finished" : "active"].find(item => item.id === id)),
      heading: "งานแสดงสินค้า / Exhibition", manualCustomer: null,
      description: "ค่าบริการพื้นที่แสดงสินค้า", includesVat: true, note: "",
    });
  };

  const switchKind = kind => {
    selectExhibition("");
    update({
      kind, heading: kind === "exhibition" ? "งานแสดงสินค้า / Exhibition" : "โครงการ / Project",
      customerInputMode: kind === "exhibition" ? "lookup" : "manual",
      ...(kind === "other" && { description: "" }),
    });
  };

  const selectCustomer = async id => {
    setError("");
    if (!id) {
      setSource(null);
      setCustomer("");
      setTax(null);
      setIssued(null);
      clearPayment();
      return;
    }
    setBusy(true);
    try {
      const { data } = await Axios.get(url + `/customers/${id}/tax-address`, {
        headers, params: { exhibitionId: exhibition },
      });
      setTax(data);
      setSource(null);
      setIssued(null);
      clearPayment();
      setCustomer(id);
      setPaymentRefresh(revision => revision + 1);
      update({
        customerInputMode: "lookup",
        ...(source && { description: "ค่าบริการพื้นที่แสดงสินค้า", includesVat: true, note: "" }),
      });
    } catch {
      setError("Unable to load the selected customer's tax address.");
    } finally {
      setBusy(false);
    }
  };

  const closeSearch = () => {
    searchRequest.current?.abort();
    setSearch(false);
  };

  const openInvoice = async id => {
    if (searchRequest.current && !searchRequest.current.signal.aborted) return;
    const request = new AbortController();
    searchRequest.current = request;
    setBusy(true);
    setError("");
    try {
      const options = { headers, signal: request.signal };
      const { data: record } = await Axios.get(url + "/records/" + id, options);
      const original = record.document;
      const registered = Boolean(original.exhibitionId && original.customerId);
      const finished = exhibitions.finished.find(item => item.id === original.exhibitionId);
      const event = finished || exhibitions.active.find(item => item.id === original.exhibitionId);
      if (original.kind === "exhibition" && !event) return "This exhibition is outside the Tax Invoice issuance window.";

      let address = record.taxAddress || original.manualCustomer;
      if (!address && !usesManualCustomer(original) && registered) {
        const response = await Axios.get(url + `/customers/${original.customerId}/tax-address`, {
          ...options, params: { exhibitionId: original.exhibitionId, addressId: original.addressId },
        });
        address = response.data;
      }
      if (request.signal.aborted) return;
      if (!address) return "The invoice has no customer tax address.";

      const idForPayments = registered ? String(original.customerId) : "";
      clearPayment();
      setIssued(null);
      if (registered) setPaymentRefresh(revision => revision + 1);
      setExhibition(original.exhibitionId || "");
      setPast(Boolean(finished));
      setCustomer(idForPayments);
      setTax(registered ? { ...address, booths: address.booths || [] } : null);
      setSource(record);
      update({
        ...(event ? projectFields(event) : {
          project: original.project || "", venue: original.venue || "",
          startDate: dateInput(original.startDate), endDate: dateInput(original.endDate),
        }),
        kind: original.kind,
        heading: original.kind === "exhibition" ? "งานแสดงสินค้า / Exhibition" : original.heading || "โครงการ / Project",
        customerInputMode: registered ? "lookup" : "manual",
        manualCustomer: registered ? null : {
          name: address.name || "", street: addressText(address), taxId: address.taxId || "", branch: address.branch || "",
        },
        description: original.items.map(item => item.description).join("\n"),
        includesVat: true,
        note: original.note || "",
      });
      if (!registered) setPaymentStatus("missing");
      setSearch(false);
    } catch (exception) {
      if (!request.signal.aborted) return typeof exception.response?.data === "string"
        ? exception.response.data : "Unable to open the invoice.";
    } finally {
      searchRequest.current = null;
      setBusy(false);
    }
  };

  const beginManual = () => {
    setIssued(null);
    setPayments([emptyPayment()]);
    setPaymentStatus("manual");
  };
  const effectiveTax = usesManualCustomer(doc) ? doc.manualCustomer : tax && manualAddress(tax);
  const selectedPayments = payments.filter(payment =>
    !payment.receipted && (payment.id == null || selectedPaymentIds.has(payment.id)));
  const printMarkup = record => taxInvoiceMarkup(record.document, record.tax, record.payments, record.source, record, record.replaces);
  const checkDraft = () => {
    const sum = paymentTotals(selectedPayments, doc.includesVat);
    if (!effectiveTax?.name?.trim() || !effectiveTax.street?.trim() || !doc.date || !doc.project.trim() ||
        !doc.heading.trim() || !doc.description.trim() || !Number.isFinite(sum.total) || sum.total <= 0 ||
        selectedPayments.some(row => Number(row.amount) < 0 ||
          (paymentStatus === "manual" && Number(row.amount) === 0))) {
      return "Check the customer, project, description and payment amounts.";
    }
    return "";
  };

  const preview = async () => {
    const invalid = issued ? "" : checkDraft();
    setError(invalid);
    if (invalid) return;

    const previewWindow = window.open("", "_blank");
    if (!previewWindow) {
      setError("Allow pop-ups to open the Tax Invoice preview.");
      return;
    }
    try {
      await renderInvoicePreview(previewWindow, issued
        ? printMarkup(issued)
        : taxInvoiceMarkup(doc, effectiveTax, selectedPayments, source));
    } catch {
      previewWindow.close();
      setError("Unable to open the Tax Invoice preview.");
    }
  };

  const printIssued = async () => {
    setError("");
    setBusy(true);
    try {
      await printInvoiceMarkup(printMarkup(issued));
    } catch {
      setError("Unable to print the issued Tax Invoice.");
    } finally {
      setBusy(false);
    }
  };

  const openIssued = async id => {
    try {
      const { data } = await Axios.get(taxUrl + "/records/" + id, { headers });
      await printInvoiceMarkup(printMarkup(data));
    } catch {
      return "Unable to print the issued Tax Invoice.";
    }
  };

  const cancelIssued = async id => {
    try {
      await Axios.post(taxUrl + "/records/" + id + "/cancel", null, { headers });
      if (issued?.id === id) {
        setIssued(null);
        if (!customer) {
          clearPayment();
          setPaymentStatus("empty");
        }
      }
      if (customer) {
        clearPayment();
        setPaymentRefresh(revision => revision + 1);
      }
    } catch (exception) {
      const message = exception.response?.data;
      return typeof message === "string" ? message : "Unable to cancel the Tax Invoice.";
    }
  };

  const issue = async () => {
    if (issuing.current || issued) return;
    if (exhibitions?.issuanceVersion !== 2) {
      setError("The Tax Invoice backend is out of date. Update and restart it before issuing.");
      return;
    }
    setError("");
    const invalid = checkDraft();
    if (invalid) {
      setError(invalid);
      return;
    }
    const taxId = normalizeTaxId(effectiveTax.taxId || "");
    if (!/^[0-9]{13}$/.test(taxId)) {
      setError("The customer's Tax ID must contain 13 digits.");
      return;
    }
    const missingSignatories = [
      ["Prepared By", doc.preparedBy], ["Received By", doc.receivedBy], ["Authorized By", doc.authorizedBy],
    ].filter(([, name]) => !name?.trim()).map(([label]) => label);
    if (missingSignatories.length) {
      setError(`Enter the missing signatory names (${missingSignatories.join(", ")}).`);
      return;
    }
    if (!window.confirm("Issue this Receipt / Tax Invoice? The document number and payment status will be saved.")) return;
    issuing.current = true;
    setBusy(true);
    let saved;
    try {
      const { kind, customerInputMode, manualCustomer, ...details } = doc;
      const payload = {
        exhibitionId: exhibition || null,
        customerId: customer ? Number(customer) : null,
        sourceInvoiceId: source?.id || null,
        document: {
          ...details, startDate: doc.startDate || null, endDate: doc.endDate || null,
        },
        tax: { ...effectiveTax, taxId },
        payments: paymentStatus === "manual" ? selectedPayments.map(row => ({
          ...row, amount: Number(row.amount),
          date: row.date || null, receivedDate: row.receivedDate || null,
        })) : selectedPayments,
      };
      const signature = JSON.stringify(payload);
      if (issueRequest.current?.signature !== signature) {
        issueRequest.current = { signature, id: crypto.randomUUID() };
      }
      const { data } = await Axios.post(taxUrl + "/records", { ...payload, requestId: issueRequest.current.id }, { headers });
      saved = data;
      setIssued(data);
      const issuedIds = new Set(data.payments.map(payment => payment.id ?? null));
      setPayments(rows => rows.map(row => issuedIds.has(row.id ?? null) ? { ...row, receipted: true } : row));
      await printInvoiceMarkup(printMarkup(data));
    } catch (exception) {
      const message = exception.response?.data;
      if (message === "This document number is already in use. Start a new Tax Invoice request.") issueRequest.current = null;
      const validation = exception.response?.status === 400 && message?.errors
        ? Object.values(message.errors).flat().join(" ")
        : "";
      setError(saved ? "Tax Invoice issued, but printing could not start. Use Print Tax Invoice to retry." :
        (typeof message === "string" ? message : validation) ||
          "Unable to issue the Tax Invoice. Retry with the same details.");
    } finally {
      issuing.current = false;
      setBusy(false);
    }
  };

  const field = (label, key, type = "text") => (
    <label>{label}
      <input className="block w-full" type={type} value={doc[key]} onChange={event => update({ [key]: event.target.value })} />
    </label>
  );

  return (
    <section className="max-w-6xl pb-10">
      <h1 className="mb-4 text-2xl font-semibold">Receipt / Tax Invoice</h1>
      <fieldset className="mb-5 rounded-lg border bg-white p-4">
        <legend className="px-2 text-red-700">Search Invoice</legend>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn-primary px-3 py-1" disabled={!exhibitions || busy}
            onClick={() => setSearch(true)}>Search Invoice</button>
          {source && <span>Reference: <strong>IV-{source.book}{source.number}</strong></span>}
        </div>
        <p className="mb-0 mt-2 text-sm text-gray-600">Use an existing invoice to fill the project and customer details.</p>
      </fieldset>
      <WorkCustomerFields key={source?.id || doc.kind} doc={doc} update={update} tax={tax}
        exhibition={exhibition} setExhibition={selectExhibition} customerId={customer}
        exhibitions={exhibitions?.[past ? "finished" : "active"] || []}
        past={past} setPast={value => { setPast(value); selectExhibition(""); }}
        loading={!exhibitions} busy={busy} switchKind={switchKind} selectCustomer={selectCustomer}
        editAddress={() => {
          setTax(current => current && ({ ...current, editing: !current.editing }));
        }}
        searchCustomers={async (search, searchBy) => {
          const { data } = await Axios.get(url + "/customers", { headers, params: { exhibitionId: exhibition, search, searchBy } });
          return data;
        }} />
      {tax?.editing && (
        <label className="mt-2 block">Tax Invoice Address
          <textarea className="block w-full" value={addressText(tax)}
            onChange={event => setTax({ ...tax, street: event.target.value, subDistrict: "", district: "", province: "", postal: "" })} />
        </label>
      )}
      <fieldset disabled={busy || Boolean(issued)} className="mt-5 space-y-3 rounded-lg border bg-white p-4">
        <legend className="px-2 text-red-700">Tax Invoice Details</legend>
        <div className="grid gap-3 md:grid-cols-2">
          {field("Issue Date", "date", "date")}
          {field("Project Heading", "heading")}
          <label className="md:col-span-2">Description
            <textarea className="block w-full" rows={2} maxLength={1000} value={doc.description}
              onChange={event => update({ description: event.target.value })} />
          </label>
          <label className="md:col-span-2">Notes
            <textarea className="block w-full" rows={2} maxLength={1000} value={doc.note}
              onChange={event => update({ note: event.target.value })} />
          </label>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {field("Prepared By", "preparedBy")}
          {field("Received By", "receivedBy")}
          {field("Authorized By", "authorizedBy")}
        </div>
      </fieldset>
      {paymentStatus === "loading" && <p className="mt-4" role="status">Loading payment records…</p>}
      {paymentStatus === "error" && <div className="mt-4">
        <p className="text-red-700" role="alert">Unable to load payment records.</p>
        <button type="button" className="rounded border px-3 py-1"
          onClick={() => setPaymentRefresh(revision => revision + 1)}>Retry Payment Lookup</button>
      </div>}
      {(paymentStatus === "empty" || (paymentStatus === "idle" &&
        (doc.kind === "other" || doc.customerInputMode === "manual"))) &&
        <button type="button" className="mt-4 rounded border px-3 py-1" onClick={() => setPaymentStatus("missing")}>Enter Payment Details</button>}
      {(paymentStatus === "found" || paymentStatus === "manual") &&
        <TaxInvoicePayments payments={payments} setPayments={setPayments} manual={paymentStatus === "manual" && !issued}
          selectedPayments={selectedPayments} selectedIds={selectedPaymentIds} setSelectedIds={setSelectedPaymentIds}
          includesVat={doc.includesVat} setIncludesVat={value => update({ includesVat: value })}
          busy={busy || Boolean(issued)} />}
      {error && <p className="mt-4 text-red-700" role="alert">{error}</p>}
      {issued && <p className="mt-4 font-semibold" role="status">Issued RT-{issued.book}{issued.number}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" className="rounded border px-3 py-1" disabled={busy}
          aria-haspopup="dialog" onClick={() => setHistory(true)}>Issued Tax Invoices</button>
        <div className="ml-auto flex gap-2">
          <button type="button" className="rounded border px-4 py-1"
            disabled={busy || (!issued && !selectedPayments.length)} onClick={preview}>Print Preview</button>
          {issued && <button type="button" className="rounded border px-4 py-1" disabled={busy}
            onClick={printIssued}>Print Tax Invoice</button>}
          <button type="button" className="btn-primary px-4 py-1 disabled:!bg-gray-200 disabled:!text-gray-600"
            disabled={busy || Boolean(issued) || !selectedPayments.length} onClick={issue}>Issue Tax Invoice</button>
        </div>
      </div>
      {search && <InvoiceSearchModal url={url} token={token} close={closeSearch} openInvoice={openInvoice} busy={busy} />}
      {history && <TaxInvoiceHistory url={taxUrl + "/records"} token={token}
        close={() => setHistory(false)} openRecord={openIssued}
        cancelRecord={canManage ? cancelIssued : undefined} />}
      {paymentStatus === "missing" && <dialog ref={noPaymentDialog} aria-labelledby="missing-payment-title"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg bg-white p-4 shadow-lg backdrop:bg-black/50"
        onCancel={event => { event.preventDefault(); setPaymentStatus("empty"); }}>
        <h2 id="missing-payment-title" className="text-lg font-semibold">ไม่พบข้อมูลการชำระเงิน</h2>
        <p>ต้องการกรอกรายละเอียดการชำระเงินด้วยตนเองหรือไม่?</p>
        <div className="flex justify-end gap-2">
          <button type="button" className="rounded border px-3 py-1" onClick={() => setPaymentStatus("empty")}>Cancel</button>
          <button type="button" className="btn-primary px-3 py-1" onClick={beginManual}>Enter Manually</button>
        </div>
      </dialog>}
    </section>
  );
}

export default function TaxInvoice() {
  const { user } = useAuth();
  return canIssueDocuments(user) ? <TaxInvoiceEditor user={user} /> : <p role="alert">คุณไม่มีสิทธิ์เข้าหน้านี้</p>;
}
