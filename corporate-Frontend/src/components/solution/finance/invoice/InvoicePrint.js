import { taxBranchLabel } from "./taxBranchLabel";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ThaiBahtText from "thai-baht-text";
import logo from "../../../img/logo-wf.png";
import style from "./invoicePrintStyle";
import { money, totals, usesManualCustomer, formatInvoiceDate } from "./invoiceValues";
const dateText = value => formatInvoiceDate(value, "th-TH");
const draftWatermarkStyle = `
  @media print {
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  }
  .invoice-draft-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-24deg);
    z-index: 1;
    pointer-events: none;
    white-space: nowrap;
    font-size: 26px;
    font-weight: 700;
    color: #b4b9c1;
    opacity: 0.4;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
`;

export function invoiceMarkup(doc, tax, record, copies = [false, true]) {
  const sum = totals(doc);
  const html = renderToStaticMarkup(<html lang="th"><head><meta charSet="utf-8" /><title>Invoice</title><base href={window.location.origin + "/"} /><style dangerouslySetInnerHTML={{ __html: style + draftWatermarkStyle + "header h1,header h2,.right label{color:var(--heading)}.summary .total{display:flex;align-items:center;justify-content:space-between;gap:8px}.summary .total b{float:none;font-size:14px;line-height:1.4;white-space:nowrap}td:nth-child(3){white-space:nowrap}section:last-child{page-break-after:auto}" }} /></head><body>{copies.map(copy => <section key={String(copy)} style={{ "--heading": copy ? "#235c92" : "#b3232c" }}>
    {!record && <div className="invoice-draft-watermark">ตัวอย่างก่อนพิมพ์</div>}
    <header><div><img className="logo" src={new URL(logo, window.location.href).href} alt="World Fair" /><h3>บริษัท เวิลด์ แฟร์ จำกัด</h3><small>1,3,5,7 ซอยลาดพร้าว 128/1 ถนนลาดพร้าว<br />แขวงคลองจั่น เขตบางกะปิ กรุงเทพมหานคร 10240<br />เลขประจำตัวผู้เสียภาษี 0105527012401 • สำนักงานใหญ่<br />02-7311331 · finance@worldfair.co.th</small></div><div className="right"><label>{copy ? "สำเนา / COPY" : "ต้นฉบับ / ORIGINAL"}</label><h1>ใบแจ้งหนี้</h1><h2>INVOICE</h2><p>{record && `IV-${record.book}${record.number}`}</p><small>วันที่ {dateText(doc.date)}</small></div></header>
    <div className="parties"><article><label>ลูกค้า / CUSTOMER</label><h3>{tax.name}</h3><small style={{ whiteSpace: "pre-line" }}>{[tax.street, tax.subDistrict, tax.district, tax.province, tax.postal].filter(Boolean).join(" ")}<br />เลขประจำตัวผู้เสียภาษี {tax.taxId} • {usesManualCustomer(doc) ? tax.branch : taxBranchLabel(tax.branch, tax.subBranch, "th")}</small></article><div className="project"><label>{doc.heading}</label><h2>{doc.project}</h2><div>{dateText(doc.startDate)} – {dateText(doc.endDate)}<span className="sep">|</span>{doc.venue}</div></div></div>
    <table><thead><tr>{["ลำดับ", "รายการ", "จำนวน", "ราคา/หน่วย", doc.priceIncludesVat ? "มูลค่ารวม VAT" : "มูลค่าก่อนภาษี"].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{doc.items.map((item, i) => <tr key={i}><td>{String(i + 1).padStart(2, "0")}</td><td>{item.description}</td><td>{item.quantity} {item.unit}</td><td>{money(item.unitPrice)}</td><td>{money(Number(item.quantity) * Number(item.unitPrice))}</td></tr>)}{Array.from({ length: 6 - doc.items.length }, (_, i) => <tr key={"blank" + i} className="empty"><td /><td /><td /><td /><td /></tr>)}</tbody></table>
    <div className="summary"><div><label>จำนวนเงินตัวอักษร</label><p>{ThaiBahtText(sum.total)}</p><small>สกุลเงิน: บาท (THB)</small></div><div><p>รวมมูลค่าก่อนภาษี <b>{money(sum.subtotal)}</b></p><p>ภาษีมูลค่าเพิ่ม {doc.vatRate}% <b>{money(sum.vat)}</b></p><p className="total">จำนวนเงินทั้งสิ้น <b>{money(sum.total)}</b></p>{Number(doc.withholdingRate) > 0 && <p>ภาษีหัก ณ ที่จ่าย {doc.withholdingRate}% <b>{money(sum.withholding)}</b></p>}<p><strong>ยอดชำระสุทธิ</strong><b>{money(sum.net)}</b></p></div></div>
    <div className="payment"><label>กำหนดการชำระเงิน / PAYMENT SCHEDULE</label>{doc.terms.map((term, i) => <p key={i}>งวดที่ {i + 1}<span>{dateText(term.date)}</span><b>{money(term.amount)} บาท</b></p>)}{doc.cheque && <small>กรณีจ่ายเป็นเช็คล่วงหน้า รับภายในวันที่ {dateText(doc.chequeReceiveBy)}<br /></small>}<small>ช่องทางการชำระเงิน: โอนเงิน · {doc.transferAccount}</small></div>
    <div className="notes">{doc.note && <><label>หมายเหตุ</label><small style={{ whiteSpace: "pre-wrap" }}>{doc.note}</small></>}</div><div className="sign"><div><p>{doc.preparedBy}</p>ผู้จัดทำเอกสาร</div><div><p>{doc.authorizedBy}</p>ผู้มีอำนาจลงนาม</div><div><p>{tax.name}</p>ผู้รับวางบิล</div></div><footer>WORLD FAIR<span>{record ? "" : "แบบร่าง • ยังไม่ออกเอกสาร"}</span>1 / 1</footer>
  </section>)}</body></html>);
  return "<!doctype html>" + html;
}

function fitsPrintArea(page) {
  return [...page.querySelectorAll("section")].every(section => {
    const notes = section.querySelector(".notes");
    const end = Math.max(
      notes.getBoundingClientRect().bottom,
      notes.lastElementChild?.getBoundingClientRect().bottom || 0,
    );
    return end + 5 < section.querySelector(".sign").getBoundingClientRect().top &&
      ![...section.querySelectorAll("td,.project,.right,.sign div,.payment")]
        .some(el => el.scrollWidth > el.clientWidth + 2);
  });
}

export async function printInvoiceMarkup(markup, host = document) {
  const frame = host.createElement("iframe");
  frame.title = "Invoice print document";
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;left:-10000px;top:0;width:210mm;height:297mm;border:0";
  const loaded = new Promise(resolve => { frame.onload = resolve; });
  frame.srcdoc = markup;
  host.body.append(frame);
  try {
    await loaded;
    const printWindow = frame.contentWindow;
    const page = frame.contentDocument;
    await page.fonts.ready;
    if (!fitsPrintArea(page)) throw new Error("The invoice exceeds the print area.");
    printWindow.addEventListener("afterprint", () => frame.remove(), { once: true });
    printWindow.print();
  } catch (error) {
    frame.remove();
    throw error;
  }
}

export async function renderInvoicePreview(previewWindow, markup, printOptions) {
  if (previewWindow.closed) return false;
  const page = previewWindow.document;
  page.open();
  page.write(markup);
  page.close();

  const styles = page.createElement("style");
  styles.textContent = `
    .invoice-preview-actions {
      position: sticky; top: 0; z-index: 1; display: flex; gap: 12px;
      align-items: center; padding: 12px; background: white; border-bottom: 1px solid #ddd;
    }
    @media print { .invoice-preview-actions { display: none; } }
  `;
  page.head.append(styles);

  const toolbar = page.createElement("div");
  toolbar.className = "invoice-preview-actions";
  const options = printOptions || [{ label: "Print / Save PDF" }];
  const printButtons = options.map(option => {
    const button = page.createElement("button");
    button.type = "button";
    button.textContent = option.label;
    button.disabled = true;
    button.onclick = async () => {
      if (!option.markup) {
        previewWindow.print();
        return;
      }
      try {
        await printInvoiceMarkup(option.markup(), page);
      } catch {
        status.textContent = "Unable to print this invoice.";
      }
    };
    return button;
  });
  const close = page.createElement("button");
  close.type = "button";
  close.textContent = "Close";
  close.onclick = () => previewWindow.close();
  const status = page.createElement("span");
  status.setAttribute("role", "status");
  status.textContent = "Preparing preview…";
  toolbar.append(...printButtons, close, status);
  page.body.prepend(toolbar);

  await page.fonts.ready;
  if (previewWindow.closed) return false;
  const fits = fitsPrintArea(page);
  printButtons.forEach(button => { button.disabled = !fits; });
  status.textContent = fits ? "" : "The content exceeds the print area. Please shorten the descriptions or notes.";
  return fits;
}
