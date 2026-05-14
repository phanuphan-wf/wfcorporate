import { useCallback,useContext, useEffect } from "react";
import { dataContext } from "./report";


export default function PrintReport({pdfRef}) {

  const {reportC, eventC, filterC} = useContext(dataContext); 
  const [reportlist] = reportC;
  const [event] = eventC;    
  const [filter] = filterC;

  // ถ้า reportlist เป็น Array ว่าง [] หรือ String ว่าง "" ค่า isDisabled จะเป็น true
  const isDisabled = !reportlist || reportlist.length === 0;
  
  // console.log(reportlist);

  // useEffect(() => {
  //     console.log(isDisabled);
  // },[isDisabled]);

  const handlePrint = useCallback(() => {     
      if (!pdfRef?.current) return;
  
      // ✅ ดึงเนื้อหาหลักจากหน้าแสดงผล
      let content = pdfRef.current.cloneNode(true);
  
      // ✅ ซ่อนส่วนที่ไม่ต้องการพิมพ์ เช่น ปุ่ม
      content.querySelectorAll("button, .no-print").forEach((el) => el.remove());   
      
      
      // โค้ดส่วนนี้ใส่ไว้ก่อนบรรทัด const printContents = content.innerHTML;

      content.querySelectorAll(".relative.flex.items-center.mb-2").forEach((el) => {
          // ใส่ class สำหรับหน้าพิมพ์ที่เราเขียน CSS รอไว้
          el.className = "sales-row"; 
          
          // จัดการลูกๆ ข้างใน
          const children = el.querySelectorAll("h3");

          if (children[0]) children[0].className = "sales-name";
          if (children[1]) children[1].className = "zone-name";
          if (children[2]) children[2].className = "duty-name";     
      });
  
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
      const Exid = filter.exID;
      // ✅ เปิดหน้าต่างใหม่สำหรับพิมพ์
      const printWindow = window.open("", "_blank");
  
      printWindow.document.write(`
        <html>
          <head>
            <title>รายงานการเก็บเงิน</title>
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
                font-size: 10px;
                margin: 0;
                padding: 10mm 5mm 5mm 5mm;
                color: #000;
                box-sizing: border-box;
              }

              .print-fixed-header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #fff;
                padding: 10mm 5mm 0 5mm;
                z-index: 9999;
                border-bottom: none;
                box-sizing: border-box;
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
                text-align: center;
                font-size: 16px;
                font-weight: bold;
              }

              .event-info {
                text-align: center;
                line-height: 1.4;
                font-size: 12px;
                font-weight: bold;
                margin-top: 3px;
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
                font-weight: 700;
              }

              .print-contents td {
                font-weight: 400;
              }

              .print-contents {
                padding-top: 0;
                font-size: 10px;
                line-height: 1.25;
              }

              hr {
                border-top: 1px dashed #aaa;
                margin: 15px 0;
              }

              .sales-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-bottom: 2px;
                position: relative;
              }

              .sales-name {
                flex: 1;
                text-align: left;
                font-weight: bold;
              }

              .zone-name {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                font-weight: bold;
              }

              .duty-name {
                flex: 1;
                text-align: right;
              }

              .print-page {
                page-break-after: always;
                break-after: page;
                padding-top: 180px;
              }

              .print-page:not(:first-child) {
                page-break-before: always;
                break-before: page;
                padding-top: 180px;
              }

              .print-page:last-child {
                page-break-after: auto;
              }

              .print-hide {
                display: block;
              }

              .print-only {
                display: none;
              }

              @media print {
                .print-hide {
                  display: none !important;
                }
                .print-only {
                  display: table-row !important;
                }
              }

              table {
                page-break-inside: avoid;
                break-inside: avoid;
              }

              .print-header {
                width: 100%;
                margin-bottom: 10px;
              }

              .sales-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-bottom: 5px;
                position: relative;
              }

              .sales-name {
                flex: 1;
                text-align: left;
                font-weight: bold;
              }

              .zone-name {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                font-weight: bold;
                white-space: nowrap;
              }

              .duty-name {
                flex: 1;
                text-align: right;
                font-weight: bold;
              }

              .print-zone-page {
                page-break-before: always;
                break-before: page;
              }

              .print-zone-page:first-child {
                page-break-before: auto;
                break-before: auto;
              }

              @media print {
                @page {
                  size: A4 portrait;
                  margin: 0;
                }

                body {
                  padding: 10mm 5mm 5mm 5mm;
                }

                .print-fixed-header {
                  position: fixed;
                  top: 0;
                }
              }

            </style>
          </head>
          <body>
            <!-- ✅ HEADER FIXED -->
              <div class="print-fixed-header">

                <div class="header">
                  <img src="/android-chrome-192x192.png" />

                  <div class="header-title">
                    **รายงานการเก็บเงิน**
                  </div>

                  <div>
                    ณ วันที่ ${thaiDate}
                  </div>
                </div>

                <div class="event-info">
                  <div>${eventName} (${Exid})</div>
                  <div>${eventDateRange}</div>
                  <div>${eventVenue}</div>
                </div>

              </div>

              <!-- ✅ CONTENT -->
              <div class="print-contents">
                ${printContents}
              </div>
           
  
            <script>
              window.onload = function() {            
                setTimeout(() => {
                  window.print();
                }, 500);
              
                window.onafterprint = function() {
                  window.close(); // ปิด Tab อัตโนมัติ
                };
              }
            </script>

          </body>
        </html>
      `);
  
      printWindow.document.close();
  }, [pdfRef,event]);
  
  
  return(
            <button
              disabled={isDisabled}
              className={`px-3 py-1 rounded ${
                isDisabled 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "btn-primary"
              }`}
              onClick={handlePrint}
            >
              Print Report
            </button>
  );

}
