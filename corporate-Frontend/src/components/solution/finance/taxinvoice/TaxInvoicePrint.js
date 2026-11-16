import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ThaiBahtText from "thai-baht-text";
import logo from "../../../img/logo-wf.png";
import invoiceStyle from "../invoice/invoicePrintStyle";
import { formatInvoiceDate, money, roundMoney } from "../invoice/invoiceValues";
import { paymentMethods, paymentTotals, taxInvoiceVatRate } from "./taxInvoiceValues";

const style = invoiceStyle + `
  @page { size: A5 portrait; margin: 0; }
  html, body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  body { font-size: 9px; }
  section { width: 148mm; height: 210mm; padding: 8mm 9mm; }
  section:last-child { page-break-after: auto; }
  header { min-height: 139px; padding-bottom: 8px; gap: 8px; }
  header h1, header h2, .right label { color: var(--heading); }
  header h1 { font-size: 18px; line-height: 1.45; margin-top: 3px; }
  header h2 { font-size: 8px; margin: 3px 0; }
  header h3 { font-size: 11px; margin: 4px 0; }
  header small { font-size: 8px; line-height: 1.6; }
  header p { margin: 5px 0; }
  .right { min-width: 165px; }
  .logo { width: 75px; height: 40px; }
  label { font-size: 8px; letter-spacing: 0; }
  .parties { gap: 12px; margin: 9px 0; }
  .parties h3 { font-size: 9px; margin: 5px 0; }
  .parties small, .project div { font-size: 8px; line-height: 1.6; }
  .project { padding: 8px; }
  .project h2 { font-size: 11px; margin: 5px 0; }
  table { margin-top: 0; font-size: 9px; }
  th { font-size: 8px; padding: 7px 4px; background: #303943; color: #fff; }
  td { padding: 5px 4px; }
  td, .empty td { border-bottom: 0; }
  tbody tr:last-child td { border-bottom: 1px solid #b8b8b8; }
  .empty td { height: 17px; }
  .summary { font-size: 9px; gap: 16px; margin-top: 8px; }
  .summary p { margin: 4px 0; }
  .summary small { font-size: 8px; }
  .summary .total { display: flex; align-items: center; justify-content: space-between; gap: 8px;
    margin-left: 0; margin-right: 0; padding: 6px 4px; font-size: 9px; }
  .summary .total b { float: none; font-size: 11px; white-space: nowrap; }
  .payment { margin-top: 9px; padding: 8px 10px; font-size: 9px; }
  .payment span { margin-left: 0; overflow-wrap: anywhere; }
  .payment small { display: block; font-size: 8px; line-height: 1.4; overflow-wrap: anywhere; }
  article { overflow-wrap: anywhere; }
  .payment p { margin: 3px 0; display: flex; gap: 6px; justify-content: space-between; }
  .payment p b { float: none; white-space: nowrap; }
  .payment-entry + .payment-entry { border-top: 1px solid #ddd; margin-top: 3px; }
  td:nth-child(2), .notes { overflow-wrap: anywhere; }
  .notes { height: auto; min-height: 20px; margin-top: 8px; white-space: pre-wrap; }
  .sign { position: absolute; bottom: 17mm; left: 9mm; right: 9mm; margin-top: 0; }
  .sign div, .sign p { font-size: 8px; }
  .sign div { width: 30%; padding-top: 5px; }
  footer { left: 9mm; right: 9mm; bottom: 5mm; font-size: 6px; padding-top: 6px; }
  .draft { font-weight: bold; color: #8e2424; }
`;
const dateText = value => formatInvoiceDate(value, "th-TH");

function printedPaymentDetails({ method, bank, branch, reference, detail, date }) {
  const paymentDate = dateText(date);
  switch (method) {
    case "transfer":
      return [
        bank && `เข้าธนาคาร${bank.trim().replace(/^ธนาคาร\s*/, "")}`,
        paymentDate && `วันที่โอนเงิน ${paymentDate}`,
      ];
    case "cheque":
      return [
        bank && `ธนาคารตามเช็ค ${bank}`,
        branch && (branch.startsWith("สาขา") ? branch : `สาขา ${branch}`),
        reference && `เช็คเลขที่ ${reference}`,
        paymentDate && `เช็คลงวันที่ ${paymentDate}`,
      ];
    case "creditCard":
      return [bank && `ธนาคารผู้ออกบัตร ${bank}`, detail && `ประเภทบัตร ${detail}`];
    default:
      return [];
  }
}

const copies = [
  { label: "ต้นฉบับ / ORIGINAL", color: "#b3232c" },
  { label: "สำเนา 1 / COPY 1", color: "#235c92" },
  { label: "สำเนา 2 / COPY 2", color: "#2a6b44" },
];

export function taxInvoiceMarkup(doc, tax, payments, source, issued = null, replaces = null) {
  const legacy = Boolean(issued) && doc.includesVat == null;
  const vatRate = legacy ? Number(doc.vatRate) : doc.includesVat ? taxInvoiceVatRate : 0;
  const received = paymentTotals(payments, doc.includesVat);
  // Earlier issued snapshots retain their original amounts when reprinted.
  const withholding = legacy ? roundMoney(payments.reduce((sum, payment) => sum + Number(payment.withholding || 0), 0)) : 0;
  const total = roundMoney(received.total + withholding);
  const vat = legacy ? roundMoney(total * vatRate / (100 + vatRate)) : received.vat;
  const subtotal = roundMoney(total - vat);
  const reference = source && `IV-${source.book}${source.number}`;
  const pages = [payments.slice(0, 6)];
  for (let index = 6; index < payments.length; index += 12) {
    pages.push(payments.slice(index, index + 12));
  }

  const html = renderToStaticMarkup(
    <html lang="th"><head><meta charSet="utf-8" /><title>Receipt / Tax Invoice</title>
      <base href={window.location.origin + "/"} />
      <style dangerouslySetInnerHTML={{ __html: style }} /></head>
    <body>{copies.flatMap(copy => pages.map((pagePayments, pageIndex) => (
      <section key={copy.label + pageIndex} style={{ "--heading": copy.color }}>
      <header>
        <div>
          <img className="logo" src={new URL(logo, window.location.href).href} alt="World Fair" />
          <h3>บริษัท เวิลด์ แฟร์ จำกัด</h3>
          <small>1,3,5,7 ซอยลาดพร้าว 128/1 ถนนลาดพร้าว<br />
            แขวงคลองจั่น เขตบางกะปิ กรุงเทพมหานคร 10240<br />
            เลขประจำตัวผู้เสียภาษี 0105527012401 • สำนักงานใหญ่<br />
            02-7311331 · finance@worldfair.co.th</small>
        </div>
        <div className="right">
          <label>{copy.label}</label>
          <h1>ใบเสร็จรับเงิน<br />ใบกำกับภาษี</h1>
          <h2>RECEIPT / TAX INVOICE</h2>
          <p>{issued ? `RT-${issued.book}${issued.number}` : <span className="draft">ตัวอย่างก่อนพิมพ์</span>}</p>
          <small>วันที่ {dateText(doc.date)}{reference && <><br />อ้างอิง {reference}</>}{replaces && <><br />ออกแทน RT-{replaces.book}{replaces.number}</>}</small>
        </div>
      </header>
      {pageIndex === 0 && <>
      <div className="parties">
        <article>
          <label>ลูกค้า / CUSTOMER</label>
          <h3>{tax.name}</h3>
          <small style={{ whiteSpace: "pre-line" }}>{tax.street}
            {tax.taxId && <><br />เลขประจำตัวผู้เสียภาษี {tax.taxId}{tax.branch && " • " + tax.branch}</>}
          </small>
        </article>
        <div className="project">
          <label>{doc.heading}</label><h2>{doc.project}</h2>
          <div>{[dateText(doc.startDate), dateText(doc.endDate)].filter(Boolean).join(" – ")}<br />{doc.venue}</div>
        </div>
      </div>
      <table><thead><tr>{["ลำดับ", "รายการ", "จำนวน", "ราคา/หน่วย", legacy || vatRate > 0 ? "มูลค่าก่อนภาษี" : "มูลค่า"].map(label =>
        <th key={label} scope="col">{label}</th>)}</tr></thead>
        <tbody>
          <tr><td>01</td><td style={{ whiteSpace: "pre-line" }}>{doc.description}</td><td>1 รายการ</td>
            <td>{money(subtotal)}</td><td>{money(subtotal)}</td></tr>
          {Array.from({ length: Math.max(0, 5 - pagePayments.length) }, (_, index) =>
            <tr key={index} className="empty"><td /><td /><td /><td /><td /></tr>)}
        </tbody>
      </table>
      <div className="summary">
        <div><label>จำนวนเงินตัวอักษร</label><p>{ThaiBahtText(total)}</p><small>สกุลเงิน: บาท (THB)</small></div>
        <div>
          {legacy || vatRate > 0 ? <>
            <p>รวมมูลค่าก่อนภาษี <b>{money(subtotal)}</b></p>
            <p>ภาษีมูลค่าเพิ่ม {vatRate}% <b>{money(vat)}</b></p>
          </> : <p>ไม่มี VAT</p>}
          <p className="total">จำนวนเงินทั้งสิ้น <b>{money(total)}</b></p>
          {legacy && <>
            <p>ภาษีหัก ณ ที่จ่าย <b>{money(withholding)}</b></p>
            <p><strong>ยอดรับชำระจริง</strong><b>{money(received.total)}</b></p>
          </>}
        </div>
      </div>
      </>}
      <div className="payment">
        <label>วิธีการชำระเงิน / PAYMENT METHOD</label>
        {pagePayments.map((payment, index) => {
          const details = printedPaymentDetails(payment).filter(Boolean).join(" · ");
          return <div className="payment-entry" key={payment.id ?? index}>
            <p><span>{paymentMethods.find(method => method.value === payment.method)?.thai || "—"}</span>
              <b>{money(payment.amount)} บาท</b></p>
            {details && <small>{details}</small>}
          </div>;
        })}
      </div>
      <div className="notes">{pageIndex === 0 && doc.note && <><label>หมายเหตุ</label><small>{doc.note}</small></>}</div>
      <div className="sign">
        <div><p>{doc.preparedBy}</p>ผู้จัดทำเอกสาร</div>
        <div><p>{doc.receivedBy}</p>ผู้รับเงิน</div>
        <div><p>{doc.authorizedBy}</p>ผู้มีอำนาจลงนาม</div>
      </div>
      <footer>WORLD FAIR <span>{issued ? "" : "แบบร่าง • ยังไม่ออกเอกสาร"}</span> {pageIndex + 1} / {pages.length}</footer>
    </section>)))}</body></html>,
  );
  return "<!doctype html>" + html;
}
