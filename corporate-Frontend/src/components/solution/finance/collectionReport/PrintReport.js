import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";


function PrintReport({ filter }) {
  const [showFilter, setShowFilter] = useState(false);

  const [showReport, setShowReport] = useState(false);
  const bearer = useHeader(); 
  
  const [reportData, setReportData] = useState([]);

  const printReport = () => {
    console.log("ค่า filter ที่ได้รับ:", filter); // ✅ ดูใน Console
    setShowFilter(true); // ✅ กดแล้วให้แสดงบนหน้า
  };

   
  const DataFilter = async () => {
      try {
        const params = {         
          customer: '0',
          exID: filter.exID,
          payment: "0",
          sales: "0",
          zone: "0"
        };
  
        console.log("📤 ค่าที่ส่งออกไป:", params);
  
        const res = await Axios.post(
          process.env.REACT_APP_API_URI + process.env.REACT_APP_clr + "/getReport",
          params
        ).then((r) => {
          console.log("📥 ค่าที่ API ส่งกลับมา:", r.data); // <--- ดูตรงนี้
          setReportData(r.data);
          setShowReport(true);
          return r; // เผื่ออยากใช้งานต่อ
        });
  
      } catch (err) {
        console.error("❌ Error fetching report:", err);
      }
    };
  



  return (
    <section className="p-4">
      {/* ปุ่ม Print Report */}
      <div className="flex justify-end mt-6">
        <button className="btn-primary px-2" onClick={printReport}>
          Print Report
        </button>
      </div>

      {/* แสดงค่า filter */}
      {showFilter && (
        <div className="mt-4 border p-3 rounded bg-gray-50">
          <h3 className="font-bold mb-2">ค่าที่ได้รับจาก filter:</h3>
          <pre className="text-sm bg-white p-2 rounded border">
            {JSON.stringify(filter, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}

export default PrintReport;