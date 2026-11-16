import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";
import { NumericFormat } from "react-number-format";
import { MdDeleteOutline } from "react-icons/md";
import { addressText } from "./InvoiceTaxIdLookup";
import { taxBranchLabel } from "./taxBranchLabel";
import InvoiceSearchModal from "./InvoiceSearchModal";
import InvoiceAddressModal from "./InvoiceAddressModal";
import WorkCustomerFields from "./WorkCustomerFields";
import { useAuth } from "../../../hook/useAuth";
import { invoiceMarkup, renderInvoicePreview, printInvoiceMarkup } from "./InvoicePrint";
import {
  totals,
  money,
  validateInvoice,
  usesManualCustomer,
  paymentTerms,
} from "./invoiceValues";
import { canIssueDocuments } from "../documentAccess";

const emptyItem = { description: "", quantity: "", unit: "", unitPrice: "" };
const exhibitionItem = {
  ...emptyItem,
  description: "ค่าบริการพื้นที่แสดงสินค้า",
  quantity: 1,
  unit: "รายการ",
};

function InvoiceEditor() {
  const { user } = useAuth();
  const [exhibitions, setExhibitions] = useState([]);
  const [exhibition, setExhibition] = useState("");
  const [past, setPast] = useState(false);
  const [customer, setCustomer] = useState("");
  const [tax, setTax] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Bangkok",
  });
  const saving = useRef(false);
  const [doc, setDoc] = useState({
    requestId: crypto.randomUUID(),
    date: today,
    kind: "exhibition",
    customerInputMode: "lookup",
    heading: "Exhibition",
    manualCustomer: { name: "", street: "", taxId: "", branch: "" },
    project: "",
    venue: "",
    startDate: "",
    endDate: "",
    priceIncludesVat: true,
    vatRate: 7,
    withholdingRate: 0,
    items: [exhibitionItem],
    terms: [{}, {}],
    cheque: false,
    chequeReceiveBy: "",
    note: "",
    preparedBy: user.name || "",
    authorizedBy: "",
    transferAccount:
      "ธนาคารกสิกรไทย · ออมทรัพย์ 100-2-06740-2 · บริษัท เวิลด์ แฟร์ จำกัด",
  });
  const [saved, setSaved] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [addressRevision, setAddressRevision] = useState(0);
  const closeAddress = () => {
    setShowAddress(false);
    setAddressRevision(value => value + 1);
    update({});
  };

  const update = (patch) => {
    setDoc((d) => ({ ...d, ...patch, requestId: crypto.randomUUID() }));
    setSaved(null);
  };
  const sum = totals(doc);
  const terms = paymentTerms(doc, sum.net);
  const chequeDate = doc.chequeReceiveBy || terms[0].date;
  const installmentTotal = terms.reduce(
    (amount, term) => amount + Number(term.amount),
    0,
  );
  const unallocated = Math.round((sum.net - installmentTotal) * 100) / 100;
  const payload = () => ({
    ...doc,
    exhibitionId: exhibition,
    customerId: usesManualCustomer(doc) ? 0 : Number(customer),
    addressId: usesManualCustomer(doc) ? null : tax?.addressId,
    manualCustomer: usesManualCustomer(doc) ? doc.manualCustomer : null,
    vatRate: Number(doc.vatRate),
    withholdingRate: Number(doc.withholdingRate),
    chequeReceiveBy: doc.cheque ? chequeDate : null,
    items: doc.items.map((i) => ({
      ...i,
      quantity: Number(i.quantity),
      unitPrice: Number(i.unitPrice),
    })),
    terms: terms.map((t) => ({ ...t, amount: Number(t.amount) })),
  });
  const url = process.env.REACT_APP_API_URI + "/api/invoice";
  const headers = { Authorization: "Bearer " + user.accessToken };
  useEffect(() => {
    let active = true;
    setExhibition("");
    setCustomer("");
    setTax(null);
    setLoading(true);
    setError("");
    Axios.get(url + "/exhibitions", { headers, params: { past } })
      .then((r) => {
        if (!active) return;
        const dateField = past ? "endDate" : "startDate";
        const ordered = [...r.data].sort((a, b) => {
          const first = a[dateField];
          const second = b[dateField];
          if (!first) return second ? 1 : 0;
          if (!second) return -1;
          return past ? second.localeCompare(first) : first.localeCompare(second);
        });
        setExhibitions(ordered);
      })
      .catch(() => {
        if (active) setError("Unable to load exhibitions. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [url, user.accessToken, past]); // eslint-disable-line react-hooks/exhaustive-deps
  const searchCustomers = async (search, searchBy) => {
    const r = await Axios.get(url + "/customers", {
      headers,
      params: { exhibitionId: exhibition, search, searchBy },
    });
    return r.data;
  };
  const unpackTaxAddress = row => ({
    ...row.address, source: row.source, customerId: row.customerId, addressId: row.addressId, addressKey: row.addressKey,
  });
  const searchByTaxId = async taxId => {
    const { data } = await Axios.get(url + "/customers/tax-id", { headers, params: { taxId } });
    return { ...data, addresses: data.addresses.map(unpackTaxAddress) };
  };
  const saveTaxCustomer = async request => {
    const { data } = await Axios.post(url + "/customers/tax-id", request, { headers });
    return unpackTaxAddress(data);
  };
  const chooseTaxCustomer = (address, added) => {
    setTax(null);
    setCustomer(added ? String(address.customerId) : "");
    update({
      customerInputMode: added ? "taxId" : "manual",
      taxIdAddressId: added ? address.addressId : null,
      manualCustomer: added ? null : {
        name: address.name,
        street: addressText(address),
        taxId: address.taxId,
        branch: taxBranchLabel(address.branch, address.subBranch, "th"),
      },
    });
  };
  const switchKind = (kind) => {
    setExhibition("");
    setCustomer("");
    setTax(null);
    setError("");
    update({
      kind,
      items: [kind === "other" ? emptyItem : exhibitionItem],
      customerInputMode: "lookup",
      heading: kind === "other" ? "Other" : "Exhibition",
      project: "",
      venue: "",
      startDate: "",
      endDate: "",
      manualCustomer: { name: "", street: "", taxId: "", branch: "" },
    });
  };
  const resolvedTax = usesManualCustomer(doc) ? doc.manualCustomer : tax;
  useEffect(() => {
    setTax(null);
    setError("");
    if (!customer || usesManualCustomer(doc)) return undefined;
    let active = true;
    let generation = 0;
    const refreshAddress = () => {
      const current = ++generation;
      setTax(null);
      Axios.get(url + `/customers/${customer}/tax-address`, {
        headers,
        params: doc.customerInputMode === "taxId"
          ? { exhibitionId: exhibition, addressId: doc.taxIdAddressId, fromTaxId: true }
          : { exhibitionId: exhibition },
      })
        .then((r) => {
          if (active && current === generation) {
            setTax(r.data);
            setError("");
            if (r.data.contractAmount != null) {
              setDoc((d) =>
                d.items[0].unitPrice === ""
                  ? {
                      ...d,
                      requestId: crypto.randomUUID(),
                      items: [
                        { ...d.items[0], unitPrice: r.data.contractAmount },
                        ...d.items.slice(1),
                      ],
                    }
                  : d,
              );
            }
          }
        })
        .catch((e) => {
          if (active && current === generation)
            setError(
              typeof e.response?.data === "string"
                ? e.response.data
                : "Unable to load the tax address.",
            );
        });
    };
    refreshAddress();
    window.addEventListener("focus", refreshAddress);
    return () => {
      active = false;
      window.removeEventListener("focus", refreshAddress);
    };
  }, [
    customer,
    exhibition,
    url,
    user.accessToken,
    doc.kind,
    doc.customerInputMode,
    doc.taxIdAddressId,
    addressRevision,
  ]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    setCustomer("");
    setTax(null);
    if (doc.kind === "exhibition") {
      const selected = exhibitions.find((e) => e.id === exhibition);
      update({
        project: selected?.name || "",
        venue: selected?.venue || "",
        startDate: selected?.startDate?.slice(0, 10) || "",
        endDate: selected?.endDate?.slice(0, 10) || "",
      });
    }
  }, [exhibition, exhibitions, doc.kind]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (doc.kind === "exhibition") {
      setDoc((d) => ({
        ...d,
        requestId: crypto.randomUUID(),
        items: [{ ...d.items[0], unitPrice: "" }, ...d.items.slice(1)],
      }));
      setSaved(null);
    }
  }, [customer, exhibition, doc.kind]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    let active = true;
    Axios.get(url + "/defaults", { headers })
      .then(({ data }) => {
        if (active && data.authorizedBy) {
          setDoc((d) =>
            d.authorizedBy
              ? d
              : {
                  ...d,
                  authorizedBy: data.authorizedBy,
                  requestId: crypto.randomUUID(),
                },
          );
        }
      })
      .catch(() => {
        // The signatory can still be entered manually.
      });
    return () => {
      active = false;
    };
  }, [url, user.accessToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = async () => {
    if (saving.current || saved) return;
    const data = payload();
    const taxAddress = resolvedTax;
    const invalid = validateInvoice(data);
    if (invalid || !taxAddress) {
      setError(invalid || "Please check the customer address.");
      return;
    }

    saving.current = true;
    setBusy(true);
    setError("");
    let record;
    try {
      const response = await Axios.post(url + "/records", data, { headers });
      record = response.data;
      setSaved(record);
      await printInvoiceMarkup(invoiceMarkup(data, record.taxAddress || taxAddress, record));
    } catch (e) {
      if (record) {
        setError("Invoice issued. Open it from Search Invoice to print again.");
      } else {
        const response = e.response?.data;
        const validationErrors = e.response?.status === 400 && response?.errors
          ? Object.entries(response.errors)
              .flatMap(([field, messages]) =>
                Array.isArray(messages)
                  ? messages.map(message => `${field}: ${message}`)
                  : [],
              )
              .join(" ")
          : "";
        setError(
          (typeof response === "string" ? response : validationErrors) ||
            "Unable to save. Retry uses the same request to prevent duplicate invoices.",
        );
      }
    } finally {
      saving.current = false;
      setBusy(false);
    }
  };
  const openPreviewWindow = () => {
    const previewWindow = window.open("", "_blank", "popup,width=1000,height=850");
    if (!previewWindow) {
      setError("Allow pop-ups to open the invoice preview.");
      return null;
    }
    previewWindow.opener = null;
    previewWindow.document.title = "Invoice Preview";
    previewWindow.document.body.textContent = "Loading invoice preview…";
    return previewWindow;
  };

  const showPreview = async () => {
    const data = payload();
    const printTax = saved?.taxAddress || resolvedTax;
    const invalid = validateInvoice(data);
    if (invalid || !printTax) {
      setError(invalid || "Please check the customer address.");
      return;
    }
    const previewWindow = openPreviewWindow();
    if (!previewWindow) return;
    setError("");
    try {
      await renderInvoicePreview(previewWindow, invoiceMarkup(data, printTax, saved));
    } catch {
      previewWindow.close();
      setError("Unable to open the invoice preview.");
    }
  };
  const openRecord = async (id) => {
    const previewWindow = openPreviewWindow();
    if (!previewWindow) return "Allow pop-ups to open the invoice preview.";
    setBusy(true);
    setError("");
    try {
      const r = await Axios.get(url + "/records/" + id, { headers });
      const address = r.data.taxAddress
        ? { data: r.data.taxAddress }
        : usesManualCustomer(r.data.document)
        ? { data: r.data.document.manualCustomer }
        : await Axios.get(
            url + `/customers/${r.data.document.customerId}/tax-address`,
            {
              headers,
              params: { exhibitionId: r.data.document.exhibitionId, addressId: r.data.document.addressId },
            },
          );
      const markup = (copies) => invoiceMarkup(r.data.document, address.data, r.data, copies);
      await renderInvoicePreview(previewWindow, markup(), [
        { label: "Print Original", markup: () => markup([false]) },
        { label: "Print Copy", markup: () => markup([true]) },
      ]);
    } catch (e) {
      previewWindow.close();
      return typeof e.response?.data === "string"
        ? e.response.data
        : "Unable to open the invoice.";
    } finally {
      setBusy(false);
    }
  };
  const field = (title, key, type = "text") => (
    <label className="block">
      {title}
      <input
        className="w-full"
        type={type}
        value={doc[key]}
        onChange={(e) => update({ [key]: e.target.value })}
      />
    </label>
  );
  return (
    <section className="pb-10 max-w-6xl">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Invoice</h1>
        <p className="text-gray-500">Issue Invoice</p>
      </div>
      {error && (
        <div role="alert" className="p-3 mb-4 bg-red-50 text-red-700 rounded">
          {error}
          {error.includes("RequestId suffix already exists") && (
            <button
              type="button"
              className="ml-3 underline"
              onClick={() => {
                update({});
                setError("");
              }}>
              Create a New Request
            </button>
          )}
        </div>
      )}
      <WorkCustomerFields
        doc={doc}
        update={update}
        exhibition={exhibition}
        setExhibition={setExhibition}
        exhibitions={exhibitions}
        past={past}
        setPast={setPast}
        loading={loading}
        busy={busy}
        customerId={customer}
        tax={tax}
        searchCustomers={searchCustomers}
        searchByTaxId={searchByTaxId}
        saveTaxCustomer={saveTaxCustomer}
        chooseTaxCustomer={chooseTaxCustomer}
        selectCustomer={setCustomer}
        switchKind={switchKind}
        editAddress={() => setShowAddress(true)}
      />
      <fieldset
        disabled={busy}
        className="mt-5 border rounded-lg p-4 bg-white space-y-4">
        <legend className="text-red-600 px-2">Invoice Details</legend>
        <div className="grid md:grid-cols-3 gap-3">
          {field("Invoice Date", "date", "date")}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left [&_td]:!border-x-0 [&_th]:!border-x-0">
            <thead>
              <tr>
                {[
                  "Item",
                  "Quantity",
                  "Unit",
                  "Unit Price (Incl. VAT)",
                  "Total",
                  "",
                ].map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doc.items.map((item, index) => (
                <tr key={index}>
                  {["description", "quantity", "unit", "unitPrice"].map(
                    (key) => {
                      const changeValue = (value) =>
                        update({
                          items: doc.items.map((entry, i) =>
                            i === index ? { ...entry, [key]: value } : entry,
                          ),
                        });
                      const inputProps = {
                        "aria-label": `${key} Item ${index + 1}`,
                        className: "w-full",
                        value: item[key],
                      };
                      return (
                        <td key={key} className="px-1">
                          {key === "unitPrice" ? (
                            <NumericFormat
                              {...inputProps}
                              thousandSeparator=","
                              decimalScale={2}
                              allowNegative={false}
                              valueIsNumericString
                              inputMode="decimal"
                              onValueChange={({ value }, source) => {
                                if (source.source === "event")
                                  changeValue(value);
                              }}
                            />
                          ) : (
                            <input
                              {...inputProps}
                              type={key === "quantity" ? "number" : "text"}
                              step="0.01"
                              min="0"
                              maxLength={
                                key === "description" ? 250 : undefined
                              }
                              onChange={(e) => changeValue(e.target.value)}
                            />
                          )}
                        </td>
                      );
                    },
                  )}
                  <td className="whitespace-nowrap px-2">
                    {money(Number(item.quantity) * Number(item.unitPrice))}
                  </td>
                  <td>
                    {index > 0 && (
                      <button
                        type="button"
                        aria-label={`Remove item ${index + 1}`}
                        className="p-2 text-red-600 hover:text-red-800"
                        onClick={() =>
                          update({
                            items: doc.items.filter((_, i) => i !== index),
                          })
                        }>
                        <MdDeleteOutline size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {doc.items.length < 6 && (
          <button
            type="button"
            className="border rounded px-3 py-1"
            onClick={() =>
              update({
                items: [...doc.items, emptyItem],
              })
            }>
            + Add Item
          </button>
        )}
        <div className="grid md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <label className="flex gap-2 items-center whitespace-nowrap">
              <input
                type="checkbox"
                checked={doc.withholdingRate > 0}
                onChange={(e) =>
                  update({ withholdingRate: e.target.checked ? 3 : 0 })
                }
              />
              Withholding Tax
            </label>
            {doc.withholdingRate > 0 && (
                <select aria-label="Withholding Rate" className="cmb w-auto shrink-0" value={doc.withholdingRate}
                  onChange={e => update({ withholdingRate: Number(e.target.value) })}>
                  {[1, 2, 3, 5].map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                </select>
            )}
          </div>
          <p>
            Subtotal (Excl. VAT) {money(sum.subtotal)}
            <br />
            VAT {money(sum.vat)}
          </p>
          <p>
            Grand Total {money(sum.total)}
            <br />
            <strong>Net Payable {money(sum.net)}</strong>
          </p>
        </div>
        <label>
          Payment Terms{" "}
          <select
            className="cmb"
            value={doc.terms.length}
            onChange={(e) =>
              update({
                terms: Array.from(
                  { length: Number(e.target.value) },
                  () => ({}),
                ),
              })
            }>
            {[1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n} Installments
              </option>
            ))}
          </select>
        </label>
        {terms.map((term, index) => (
          <div key={index} className="flex flex-wrap gap-3 items-center">
            <span>Installment {index + 1}</span>
            <input
              aria-label={`Installment Date ${index + 1}`}
              type="date"
              value={term.date}
              onChange={(e) =>
                update({
                  terms: doc.terms.map((t, i) =>
                    i === index ? { ...t, date: e.target.value } : t,
                  ),
                })
              }
            />
            <NumericFormat
              aria-label={`Installment Amount ${index + 1}`}
              thousandSeparator=","
              decimalScale={2}
              allowNegative={false}
              valueIsNumericString
              inputMode="decimal"
              value={term.amount}
              onValueChange={({ value }, source) => {
                if (source.source !== "event") return;
                update({
                  terms: doc.terms.map((t, i) =>
                    i === index ? { ...t, amount: value } : t,
                  ),
                });
              }}
            />
            <span>THB</span>
          </div>
        ))}
        <p className="text-gray-500">
          Total Installments {money(installmentTotal)} / Net Payable{" "}
          {money(sum.net)}
          {unallocated !== 0 &&
            ` · ${unallocated > 0 ? "Remaining" : "Overallocated"} ${money(Math.abs(unallocated))}`}
        </p>
        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={doc.cheque}
            onChange={(e) => update({ cheque: e.target.checked })}
          />
          Pay by Post-dated Cheque
        </label>
        {doc.cheque && (
          <label className="block">
            Receive Cheque By
            <input
              className="block"
              type="date"
              value={chequeDate}
              onChange={(e) => update({ chequeReceiveBy: e.target.value })}
            />
          </label>
        )}
        <div className="grid md:grid-cols-2 gap-3">
          {field("Prepared By", "preparedBy")}
          {field("Authorized Signatory", "authorizedBy")}
        </div>
        {field(
          "Bank Transfer — Bank / Account Type / Account Number / Account Name",
          "transferAccount",
        )}
        <label className="block">
          Notes (Optional)
          <textarea
            className="block w-full border border-gray-300 rounded p-2 mt-1"
            rows={3}
            maxLength={1000}
            value={doc.note}
            onChange={(e) => update({ note: e.target.value })}
          />
        </label>
      </fieldset>
      <div className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            className="btn-primary px-3 py-2"
            aria-expanded={showSearch}
            aria-haspopup="dialog"
            onClick={() => setShowSearch(true)}>
            Search Invoice
          </button>
          <fieldset
            disabled={busy}
            className="ml-auto flex flex-wrap justify-end gap-3">
            <button
              type="button"
              className="border rounded px-4 py-2"
              onClick={showPreview}>
              Print Preview
            </button>
            <button
              type="button"
              className="rounded px-4 py-2 bg-red-600 text-white disabled:opacity-50"
              disabled={!resolvedTax || !!saved}
              onClick={save}>
              {saved
                ? `Saved IV-${saved.book}${saved.number}`
                : busy
                  ? "Saving…"
                  : "Issue Invoice"}
            </button>
          </fieldset>
        </div>
        {showSearch && <InvoiceSearchModal url={url} token={user.accessToken}
          close={() => setShowSearch(false)} openInvoice={openRecord} busy={busy} />}
        {showAddress && customer && !usesManualCustomer(doc) && <InvoiceAddressModal
          customerId={customer} close={closeAddress} />}
      </div>
    </section>
  );
}
export default function Invoice() {
  const { user } = useAuth();
  return canIssueDocuments(user) ? (
    <InvoiceEditor />
  ) : (
    <p role="alert">You do not have permission to access this page.</p>
  );
}
