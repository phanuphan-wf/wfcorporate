import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import { useContext } from "react";
import { dataContext } from "./report";
import PrintButton from "./PrintButton";

export default function PrintReport() {
  const { reportC } = useContext(dataContext);
  const [reportlist] = reportC;

  const handlePrint = async () => {
    // โหลด PDF ต้นแบบ (วางไว้ในโฟลเดอร์ public/)
    const existingPdfBytes = await fetch("./templats/report.pdf").then(res => res.arrayBuffer());

    // โหลดเอกสาร PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = firstPage.getSize();

    // ✅ ตัวอย่าง: เติมข้อมูลจากแถวแรกใน reportlist
    const company = reportlist[0]?.company ?? "";
    const amount = reportlist[0]?.amount?.toLocaleString() ?? "";
    const date = reportlist[0]?.date ?? "";

    // วางข้อความลงในตำแหน่ง (x, y) บนหน้า PDF
    firstPage.drawText(company, { x: 120, y: height - 180, size: 12, font, color: rgb(0, 0, 0) });
    firstPage.drawText(amount,  { x: 380, y: height - 180, size: 12, font });
    firstPage.drawText(date,    { x: 480, y: height - 180, size: 12, font });

    // สร้าง PDF ใหม่และดาวน์โหลด
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "รายงานพร้อมข้อมูล.pdf");
  };

  return (
    <div className="p-4">
      <PrintButton onPrint={handlePrint} />
    </div>
  );
}
