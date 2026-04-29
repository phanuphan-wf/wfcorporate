import { useCallback,useContext } from "react";
import { dataContext } from "./report";


export default function PrintReport({pdfRef}) {

    const { filterC,eventC } = useContext(dataContext);
    const [event] = eventC;
    const [filter] = filterC;
  

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
    
      const thaiDate = event.date;
      const eventName = event.exName;
      const eventVenue = event.venue;
      const eventDateRange = event.exDate;
    
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
                font-size: 10px;
                margin: 10px;
                color: #000;
              }
  
              .event-info {
                  text-align: center;               
                  line-height: 1.4;
                  font-size: 12px;
                  font-weight: bold;
              }
  
              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                margin-bottom: 4px;
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
                margin-top: 1px;
                line-height: 1.3;
                margin-top: 1px;
              }
  
              .print-contents table {
                font-size: 10px;
              }

              .print-contents th,
              .print-contents td {
                  border: 1px solid #000;
                  padding: 3px 5px;
                  text-align: center;
              }

              .print-contents th {
                  font-weight: 700; /* หนากว่า td */
              }

              .print-contents td {
                  font-weight: 400; /* ตัวอักษรบางกว่า th */
              }
  
              .print-contents {
                font-size: 10px;
                line-height: 1.25;
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
  
              @page {
                size: A4 portrait;
                margin: 10mm;
              }
            </style>
          </head>
          <body>
          
              <div class="header">
                <img src="/android-chrome-192x192.png" />
                <div class="header-title">**รายงานการเก็บเงิน**</div>
                <div>ณ วันที่ ${thaiDate}</div>
              </div>

              <div class="event-info">
                <div>${eventName}</div>
                <div>${eventDateRange}</div>
                <div>${eventVenue}</div>
              </div>
  
            <div class="print-contents">
              ${printContents}
            </div>
  
           
  
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
    }, [pdfRef,event]);
  
  
  return(
            <button
              className="btn-primary px-3 py-1 rounded"
              onClick={handlePrint}
            >
              Print Report
            </button>
  );

}
