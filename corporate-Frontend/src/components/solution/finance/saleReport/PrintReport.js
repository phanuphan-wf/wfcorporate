
import React, { useCallback, useContext } from "react";
import { dataContext } from "./salereport";


export default function PrintReport({ pdfRef }) {
  const {filterC, eventC} = useContext(dataContext);
  const [filter] = filterC;
  const [event] = eventC;
  
  //console.log(event);

  const isDisabled = !filter.exID || filter.exID === ""; 


  const handlePrint = useCallback(() => {
     
      if (!pdfRef?.current) return;
  
      // ✅ ดึงเนื้อหาหลักจากหน้าแสดงผล
      let content = pdfRef.current.cloneNode(true);
  
      // ✅ ซ่อนส่วนที่ไม่ต้องการพิมพ์ เช่น ปุ่ม
      content.querySelectorAll("button, .no-print").forEach((el) => el.remove());   
     

     // ✅ 1. ปรับแต่ง Element หัวข้อ (เช่น ขยับมาตรงกลาง ปรับขนาด)
        content.querySelectorAll("h2, p").forEach((el) => {
            if (el.innerText.includes("สรุปเปอร์เซ็นต์ยอดขาย")) {
                el.style.fontSize = "12px";      // ขนาดที่เหมาะสมสำหรับหัวข้อรายงาน
                el.style.fontWeight = "bold";    // ทำตัวหนา
                el.style.color = "#000";         // สีดำเข้มชัดเจน
                el.style.textAlign = "center";   // ✅ ขยับมาตรงกลาง
                el.style.width = "100%";         // ✅ ขยายเต็มพื้นที่เพื่อให้ Alignment ทำงาน
                el.style.display = "block";      // เปลี่ยนเป็น block เพื่อให้กินพื้นที่ทั้งบรรทัด
                el.style.marginBottom = "10px";  // เพิ่มระยะห่างด้านล่างเล็กน้อย
                
                // หากต้องการลบ tag <p> ที่เป็นชื่อโซนใต้หัวข้อ (ถ้ามี)
                const nextEl = el.nextElementSibling;
                if (nextEl && nextEl.tagName === "P") {
                    nextEl.style.textAlign = "center"; // ให้ชื่อโซนอยู่กลางด้วย
                    nextEl.style.fontSize = "12px";
                }
            }
        });

        // ✅ 2. ปรับแต่งโครงสร้าง Flexbox ของหน้าเว็บให้เป็น Layout สำหรับพิมพ์
        // ปกติในหน้าเว็บอาจจะเป็น flex-row แต่ตอนพิมพ์เราอาจจะอยากจัดระเบียบใหม่
        content.querySelectorAll(".flex").forEach((flexContainer) => {
            flexContainer.style.display = "flex";
            flexContainer.style.flexDirection = "row"; // บังคับให้เป็นแนวนอน
            flexContainer.style.alignItems = "center";
            flexContainer.style.justifyContent = "space-between";
        });

        // ✅ 3. ปรับแต่ง div ที่หุ้มตารางสรุปยอด (ตัวที่เราอยากให้ชิดขวาและเล็กลง)
        const summaryDiv = content.querySelector(".print\\:ml-auto");
        if (summaryDiv) {
            summaryDiv.style.width = "40%"; // บังคับความกว้าง 40%
            summaryDiv.style.marginLeft = "auto"; // ชิดขวา
            summaryDiv.style.paddingLeft = "0"; 
        }

        // ✅ 4. ปรับแต่งกราฟ (Chart)
        // ปกติ Google Charts ใน clone อาจจะดูขนาดเพี้ยน เราสามารถบังคับขนาด div ของกราฟได้
        const chartContainer = content.querySelector(".w-full.md\\:w-\\[50\\%\\]");
        if (chartContainer) {
            chartContainer.style.width = "55%"; // ให้กราฟใหญ่กว่าตารางสรุปเล็กน้อย
        }


  
      const printContents = content.innerHTML;
  
      // ✅ วันที่ไทย + ข้อมูลงาน
      const thaiDate =  event.date;
  
      const eventName = event.exName;
      const eventVenue = event.venue;
      const eventDateRange = event.exDate;
  
      // ✅ เปิดหน้าต่างใหม่สำหรับพิมพ์
      const printWindow = window.open("", "_blank");
  
      printWindow.document.write(`
        <html>
          <head>
            <title>รายงานยอดขายงานแสดงสินค้า</title>
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
                  font-size: 14px;
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
              <div class="header-title">** รายงานยอดขายงานแสดงสินค้า **</div>
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
    }, [pdfRef, event]);
  
    return(
            <button
                disabled={isDisabled}
                onClick={handlePrint}
                className={`px-4 py-1.5 rounded-md transition-colors font-medium ${
                    isDisabled 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                    : "btn-primary active:scale-95"
                }`}
                >
                    Print Report
            </button> 
    );    
}

