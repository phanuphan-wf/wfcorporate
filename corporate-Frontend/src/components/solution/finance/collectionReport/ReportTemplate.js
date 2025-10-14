import { useState, useEffect, createContext, useRef, useCallback, useContext} from "react";

const nfInt = (n) => Number(n ?? 0).toLocaleString();
const nf2 = (n) =>
  new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    Number(n ?? 0)
  );

export default function ReportTemplate({
  header,  // { logoSrc, title, eventName, dateRange, venue, zone, sales, pageNo, printedDate }
  rows,    // Array ของข้อมูลแถว
  totals,  // { qty, volume, amount, balance }
}) {
  return (
    <div className="w-full" style={{ fontFamily: "TH Sarabun New, Tahoma, sans-serif", fontSize: 14 }}>
      {/* Header */}
      <div className="flex items-start justify-between" style={{ marginBottom: 8 }}>
        <div className="flex items-center gap-3">
          {header?.logoSrc && (
            <img src={header.logoSrc} alt="logo" style={{ width: 48, height: 48, objectFit: "contain" }} />
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, textAlign: "left" }}>
              {header?.title ?? "** รายงานการเก็บเงิน **"}
            </div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{header?.eventName ?? ""}</div>
            <div>{header?.dateRange ?? ""}</div>
            <div>{header?.venue ?? ""}</div>
          </div>
        </div>

        <div style={{ textAlign: "right", minWidth: 160 }}>
          <div>ณ วันที่&nbsp;&nbsp;{header?.printedDate ?? ""}</div>
          <div>หน้าที่:&nbsp;{header?.pageNo ?? 1}</div>
        </div>
      </div>

      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <div>พนักงานขาย : <b>{header?.sales ?? "-"}</b></div>
        <div>โซน : <b>{header?.zone ?? "-"}</b></div>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8f8f8" }}>
            <th style={th}>ลำดับ</th>
            <th style={th}>ชื่อลูกค้า</th>
            <th style={th}>หน้า</th>
            <th style={th}>#บูธ</th>
            <th style={th}>จำนวน</th>
            <th style={th}>ยอดเงิน</th>
            <th style={th}>ชำระแล้ว</th>
            <th style={th}>ยอดคงค้าง</th>
            <th style={th}>โทรศัพท์</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r?.name ?? "unk"}-${i}`}>
              <td style={tdCenter}>{i + 1}</td>
              <td style={tdLeft}>{r?.name ?? "-"}</td>
              <td style={tdCenter}>{r?.page ?? "-"}</td>
              <td style={tdCenter}>{r?.booth ?? "-"}</td>
              <td style={tdRight}>{nf2(r?.qty)}</td>
              <td style={tdRight}>{nfInt(r?.volume)}</td>
              <td style={tdRight}>{nfInt(r?.amount)}</td>
              <td style={tdRight}>{nfInt(r?.balance)}</td>
              <td style={{ ...tdLeft, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {wrapEvery(r?.tel ?? "-", 25)}
              </td>
            </tr>
          ))}
          {/* Total row */}
          <tr style={{ background: "#f8f8f8", fontWeight: 700 }}>
            <td style={tdCenter} colSpan={4}>รวมยอดทั้งสิ้น</td>
            <td style={tdRight}>{nf2(totals?.qty)}</td>
            <td style={tdRight}>{nfInt(totals?.volume)}</td>
            <td style={tdRight}>{nfInt(totals?.amount)}</td>
            <td style={tdRight}>{nfInt(totals?.balance)}</td>
            <td style={tdLeft}></td>
          </tr>
        </tbody>
      </table>

      {/* บังคับขึ้นหน้าใหม่ได้ด้วย div นี้ (ถ้ามีหลายเพจ) */}
      {/* <div className="html2pdf__page-break" /> */}
    </div>
  );
}

/* ---------- helpers & styles ---------- */
const border = "1px solid #1f2937";
const pad = "6px 8px";

const th = { border, padding: pad, textAlign: "center" };
const tdLeft = { border, padding: pad, textAlign: "left" };
const tdCenter = { border, padding: pad, textAlign: "center" };
const tdRight = { border, padding: pad, textAlign: "right" };

function wrapEvery(text, size = 25) {
  if (!text) return "-";
  return String(text).match(new RegExp(`.{1,${size}}`, "g")).join("\n");
}
