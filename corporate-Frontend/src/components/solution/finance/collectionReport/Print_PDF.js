import React, { useCallback, useContext } from "react";
import { dataContext } from "./report";

export default function Print_PDF({ pdfRef }) {
  const { eventC, filterC } = useContext(dataContext);
  const [selectedEvent] = eventC;
  const [filter] = filterC;

  // 📅 แปลงวันที่เป็นแบบไทย
  const formatThaiDateJob = useCallback((date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  // 🖨️ ฟังก์ชัน Print
 // 🖨️ ฟังก์ชันพิมพ์
  const handlePrint = useCallback(() => {
    if (!filter || filter.exID === "0") {
      alert("กรุณาเลือกงานจัดแสดง (Exhibition)");
      return;
    }
    if (!pdfRef?.current) return;

    // ✅ ดึงเนื้อหาหลักจากหน้าแสดงผล
    let content = pdfRef.current.cloneNode(true);

    // ✅ ซ่อนส่วนที่ไม่ต้องการพิมพ์ เช่น ปุ่ม
    content.querySelectorAll("button, .no-print").forEach((el) => el.remove());

    // ✅ ปรับสไตล์ตารางให้กว้างเท่ากัน
    content.querySelectorAll("table").forEach((table) => {
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.querySelectorAll("th, td").forEach((cell) => {
        cell.style.width = "auto";
        cell.style.border = "1px solid #000";
        cell.style.padding = "4px 6px";
        cell.style.textAlign = "center";
        cell.style.verticalAlign = "middle";
      });
    });

    const printContents = content.innerHTML;

    // ✅ วันที่ไทย + ข้อมูลงาน
    const thaiDate = new Date().toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const eventName = selectedEvent?.name || "-";
    const eventVenue = selectedEvent?.venue || "-";
    const eventDateRange = selectedEvent
      ? `${formatThaiDateJob(selectedEvent.sDate)} - ${formatThaiDateJob(selectedEvent.eDate)}`
      : "-";

    // ✅ เปิดหน้าต่างใหม่สำหรับพิมพ์
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>รายงานการเก็บเงิน</title>
          <style>
            
            @font-face {
                font-family: "Sarabun";
                src: url("/fonts/Sarabun-Regular.ttf") format("truetype");
                font-weight: 400;
                font-style: normal;
            }
            @font-face {
                font-family: "Sarabun";
                src: url("/fonts/Sarabun-Bold.ttf") format("truetype");
                font-weight: 700;
                font-style: normal;
            }
            @font-face {
                font-family: "Sarabun";
                src: url("/fonts/Sarabun-Italic.ttf") format("truetype");
                font-weight: 400;
                font-style: italic;
            }
            @font-face {
                font-family: "Sarabun";
                src: url("/fonts/Sarabun-ThinItalic.ttf") format("truetype");
                font-weight: 100;
                font-style: italic;
            }

            body {
              font-family: 'Sarabun', sans-serif;
              font-size: 12px;
              margin: 10px;
              color: #000;
            }

            .event-info {
                text-align: center;
                margin-top: 5px;
                line-height: 1.4;
                font-size: 12px;
                font-weight: bold; /* ✅ ทำตัวอักษรหนา */
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: relative;
              margin-bottom: 10px;
            }

            .header img {
              width: 70px;
              height: 70px;
            }

            .header-title {
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              text-align: center;
              font-size: 16px;
              font-weight: bold;
            }

            .event-info {
              text-align: center;
              margin-top: 8px;
              line-height: 1.5;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }

            th {
                border: 1px solid #000;
                font-weight: 700; /* หนากว่า td */
                text-align: center;
                padding: 4px 6px;
            }

            td {
                border: 1px solid #000;
                font-weight: 400; /* ตัวอักษรบางกว่า th */
                text-align: center;
                padding: 4px 6px;
            }

            hr {
              border-top: 1px dashed #aaa;
              margin: 15px 0;
            }

            footer {
              text-align: right;
              font-size: 12px;
              margin-top: 10px;
            }

            @media print {
              @page {
                size: A4 landscape;
                margin: 5mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/android-chrome-192x192.png" alt="Logo" />
            <div class="header-title">** รายงานการเก็บเงิน **</div>
            <div style="text-align:right;">ณ วันที่ ${thaiDate}</div>
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
  }, [pdfRef, filter, selectedEvent, formatThaiDateJob]);

  return (
    <div className="flex justify-end mt-4">
      <button
        className="btn-primary px-3 py-1 rounded"
        onClick={handlePrint}
      >
        Print Report
      </button>
    </div>
  );
}
