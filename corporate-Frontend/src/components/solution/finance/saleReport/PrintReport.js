import React, { useCallback, useContext } from "react";
import { dataContext } from "./salereport";

export default function PrintReport({ pdfRef}) {
  const {eventC,filterC} = useContext(dataContext); 
  const [event] = eventC;
  const [filter] = filterC;

  const isDisabled = false;

  const handlePrint = useCallback(() => {
    if (!pdfRef?.current) return;

    let content = pdfRef.current.cloneNode(true);

    // ❌ ลบปุ่ม
    content.querySelectorAll("button, .no-print").forEach((el) => el.remove());

    // ✅ หัวข้อ
    content.querySelectorAll("h2, p").forEach((el) => {
      if (el.innerText.includes("สรุปเปอร์เซ็นต์ยอดขาย")) {
        el.style.fontSize = "12px";
        el.style.fontWeight = "bold";
        el.style.textAlign = "center";
        el.style.display = "block";
        el.style.marginBottom = "10px";
      }
    });

    // =========================
    // ✅ FIX LAYOUT (สำคัญสุด)
    // =========================
    content.querySelectorAll(".flex").forEach((flexContainer) => {
      flexContainer.style.display = "flex";
      flexContainer.style.flexDirection = "column";
      flexContainer.style.alignItems = "flex-start";
      flexContainer.style.justifyContent = "space-between";
      flexContainer.style.gap = "10px";
      flexContainer.style.flexWrap = "nowrap";
      flexContainer.style.breakInside = "avoid";
    });

    content.querySelectorAll(".bg-white.p-4").forEach((zone) => {

      // ✅ Chart ใน zone นี้
      const chartDiv = zone.querySelector(".w-full.md\\:w-\\[50\\%\\]");
      if (chartDiv) {
        chartDiv.style.width = "100%";
        chartDiv.style.maxWidth = "100%";
        chartDiv.style.display = "block";
        chartDiv.style.marginBottom = "10px";
        chartDiv.style.breakInside = "avoid";
      }

      // ✅ Table ใน zone นี้
      const summaryDiv = zone.querySelector(".pl-2");
      if (summaryDiv) {
        summaryDiv.style.width = "35%";
        summaryDiv.style.maxWidth = "35%";
        summaryDiv.style.flex = "0 0 35%";
        summaryDiv.style.marginLeft = "auto";   // ✅ ชิดขวาทุก zone
        summaryDiv.style.display = "block";
        summaryDiv.style.boxSizing = "border-box";
        summaryDiv.style.overflow = "hidden";
        summaryDiv.style.breakInside = "avoid";
      }

    });
  
    // ✅ scale กันล้น
    content.style.zoom = "0.95";

    const printContents = content.innerHTML;

    const thaiDate = event.date;
    const eventName = event.exName;
    const eventVenue = event.venue;
    const eventDateRange = event.exDate;
    const Exid = filter.exID;

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
  <html>
    <head>
      <title>รายงานยอดขายงานแสดงสินค้า</title>

      <style>
        @font-face {
          font-family: "Sarabun";
          src: url("/fonts/Sarabun-Regular.ttf");
        }

        @font-face {
          font-family: "Sarabun";
          src: url("/fonts/Sarabun-Bold.ttf");
          font-weight: bold;
        }

        body {
          font-family: 'Sarabun', sans-serif;
          font-size: 12px;
          margin: 0;
          padding: 0;
          color: #000;
        }

        /* =========================
           HEADER
        ========================== */

        .print-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;

          background: #fff;
          z-index: 9999;

          padding: 10px 15px 5px 15px;
          border-bottom: 1px solid #ccc;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }

        .header img {
          width: 60px;
          height: 60px;
        }

        .header-title {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-weight: bold;
          font-size: 14px;
          white-space: nowrap;
        }

        .event-info {
          text-align: center;
          font-weight: bold;
          margin-top: 8px;
          line-height: 1.5;
        }

        /* =========================
           CONTENT
        ========================== */

        .print-wrapper {
          width: 100%;
          margin-top: 100px; 
          padding: 0 10px 10px 10px;
          box-sizing: border-box;
        }

        /* =========================
           TABLE
        ========================== */

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          margin-top: 10px;
        }

        th,
        td {
          border: 1px solid #000;
          padding: 4px 6px;
          vertical-align: middle;
        }

        th {
          font-weight: bold;
          text-align: center;
        }

        /* =========================
           ALIGN
        ========================== */

        .text-left {
          text-align: left !important;
        }

        .text-right {
          text-align: right !important;
        }

        .text-center {
          text-align: center !important;
        }

        /* =========================
           ZONE PAGE BREAK
        ========================== */

        .print-zone-block {
          page-break-inside: avoid;
          break-inside: avoid;
          margin-bottom: 20px;
        }

        /* ✅ โซนใหม่ขึ้นหน้าใหม่ */
        .print-zone-block:not(:first-child) {
            page-break-before: always;
            break-before: page;
            padding-top: 140px;
        }

        /* =========================
           CHART
        ========================== */

        canvas,
        svg {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* =========================
           SALES HEADER
        ========================== */

        .sales-row {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          min-height: 24px;
        }

        .sales-left {
          flex: 1;
          text-align: left;
          font-weight: bold;
        }

        .sales-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-weight: bold;
          white-space: nowrap;
        }

        /* =========================
           PRINT
        ========================== */

        @media print {

          @page {
            size: A4 portrait;
            margin: 5mm;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .print-hide {
            display: none !important;
          }

          .print-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;

            background: #fff;
            z-index: 9999;

            padding: 10px 15px 5px 15px;

            border-bottom: none;
          }

          .print-wrapper {
              margin-top: 140px;
          }
        }

      </style>
    </head>

    <body>

      <!-- =========================
           HEADER
      ========================== -->

      <div class="print-header">

        <div class="header">

          <img src="/android-chrome-192x192.png" />

          <div class="header-title">
            รายงานยอดขายงานแสดงสินค้า
          </div>

          <div>
            ${thaiDate}
          </div>

        </div>

        <div class="event-info">
          <div>${eventName} (${Exid})</div>
          <div>${eventDateRange}</div>
          <div>${eventVenue}</div>
        </div>

      </div>

      <!-- =========================
           CONTENT
      ========================== -->

      <div class="print-wrapper">
        ${printContents}
      </div>

      <!-- =========================
           SCRIPT
      ========================== -->

      <script>

        window.onload = function() {

          // ✅ text align จาก class React/Tailwind
          document.querySelectorAll(".text-left").forEach(el => {
            el.style.textAlign = "left";
          });

          document.querySelectorAll(".text-right").forEach(el => {
            el.style.textAlign = "right";
          });

          document.querySelectorAll(".text-center").forEach(el => {
            el.style.textAlign = "center";
          });

          // ✅ sales row
          document.querySelectorAll("[data-sales]").forEach(el => {
            el.classList.add("sales-left");
          });

          document.querySelectorAll("[data-zone]").forEach(el => {
            el.classList.add("sales-center");
          });

          setTimeout(() => {
            window.print();
          }, 500);

          window.onafterprint = function() {
            window.close();
          };

        };

      </script>

    </body>
  </html>
`);
    printWindow.document.close();
  }, [pdfRef, event]);

  return (
    <button
      disabled={isDisabled}
      onClick={handlePrint}
      className={`px-4 py-1.5 rounded-md font-medium ${
        isDisabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "btn-primary active:scale-95"
      }`}
    >
      Print Report
    </button>
  );
}