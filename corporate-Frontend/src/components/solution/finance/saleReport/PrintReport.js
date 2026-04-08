import React, { useCallback, useContext } from "react";
import { dataContext } from "./salereport";

export default function PrintReport({ pdfRef, showPreview}) {
  const {eventC } = useContext(dataContext); 
  const [event] = eventC;

  const isDisabled = !showPreview;

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
              margin: 10px;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: relative;
            }

            .header img {
              width: 60px;
            }

            .header-title {
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              font-weight: bold;
              font-size: 16px;
            }

            .event-info {
              text-align: center;
              font-weight: bold;
              margin-top: 10px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
            }

            th, td {
              border: 1px solid #000;
              padding: 4px;
              text-align: center;
            }

            th {
              font-weight: bold;
            }

            @media print {
              @page {
                size: A4 portrait;
                margin: 5mm;
              }
            }
          </style>
        </head>
        <body>

          <div class="header">
            <img src="/android-chrome-192x192.png" />
            <div class="header-title">รายงานยอดขายงานแสดงสินค้า</div>
            <div>${thaiDate}</div>
          </div>

          <div class="event-info">
            <div>${eventName}</div>
            <div>${eventDateRange}</div>
            <div>${eventVenue}</div>
          </div>

          ${printContents}

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
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