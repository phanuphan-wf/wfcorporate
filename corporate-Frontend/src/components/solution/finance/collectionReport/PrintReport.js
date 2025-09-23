import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";

function PrintReport({ filter }) {
  const [showReport, setShowReport] = useState(false);
  const bearer = useHeader(); // ✅ เรียกใน component

  const printReport = async () => {
    try {
      const res = await Axios.get(
        process.env.REACT_APP_API_URI + process.env.REACT_APP_clr +"/getReport",
        {
          headers: { Authorization: "Bearer " + bearer },
          params: filter, // ส่ง filter เป็น query string
        }
      );
      console.log("Report data:", res.data);
      setShowReport(true);
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  };


  // ตัวอย่าง data สำหรับแสดงตาราง
  const sampleData = [
    { id: 1, customer: "บริษัท ลา พรีมาเวร่า จำกัด", booth: "A1", qty: 4, amount: 49810, paid: 102170, balance: 0, phone: "086-974-8573" },
    { id: 2, customer: "บริษัท ลา พรีมาเวร่า จำกัด", booth: "B4", qty: 4, amount: 52360, paid: null, balance: null, phone: "086-974-8573" },
  ];

  const total = {
    qty: sampleData.reduce((sum, row) => sum + row.qty, 0),
    amount: sampleData.reduce((sum, row) => sum + row.amount, 0),
    paid: sampleData.reduce((sum, row) => sum + (row.paid || 0), 0),
    balance: sampleData.reduce((sum, row) => sum + (row.balance || 0), 0),
  };

  return (
    <section className="2xl:container">
      {/* ปุ่ม Print Report */}
      <div className="flex justify-end mt-6">
        <button
          className="btn-primary px-2"
          onClick={printReport}
        >
          Print Report
        </button>
      </div>

      {/* ตารางรายงาน */}
      {showReport && (
        <div className="mt-6 border rounded-md p-4">
          <div className="relative flex items-center">
            <h3 className="flex-1 text-left">พนักงานขาย : Sales Development</h3>
            <h3 className="absolute left-1/2 -translate-x-1/2 text-center">โซน : ต้นไม้</h3>
            <h3 className="flex-1 text-right">หน้าที่ : 1</h3>
          </div>

          <table className="w-full border border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">ลำดับ</th>
                <th className="border px-2 py-1">ชื่อลูกค้า</th>
                <th className="border px-2 py-1">หน้า</th>
                <th className="border px-2 py-1">#บูธ</th>
                <th className="border px-2 py-1">จำนวน</th>
                <th className="border px-2 py-1">ยอดเงิน</th>
                <th className="border px-2 py-1">ชำระแล้ว</th>
                <th className="border px-2 py-1">ยอดคงค้าง</th>
                <th className="border px-2 py-1">โทรศัพท์</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1 text-center">{row.id}</td>
                  <td className="border px-2 py-1">{row.customer}</td>
                  <td className="border px-2 py-1 text-center"></td>
                  <td className="border px-2 py-1 text-center">{row.booth}</td>
                  <td className="border px-2 py-1 text-right">{row.qty.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-right">{row.amount.toLocaleString()}</td>
                  <td className="border px-2 py-1 text-right">{row.paid ? row.paid.toLocaleString() : "--------------"}</td>
                  <td className="border px-2 py-1 text-right">{row.balance !== null ? row.balance.toLocaleString() : "--------------"}</td>
                  <td className="border px-2 py-1">{row.phone}</td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-50">
                <td className="border px-2 py-1 text-center" colSpan={4}>รวมยอดทั้งสิ้น</td>
                <td className="border px-2 py-1 text-right">{total.qty.toFixed(2)}</td>
                <td className="border px-2 py-1 text-right">{total.amount.toLocaleString()}</td>
                <td className="border px-2 py-1 text-right">{total.paid.toLocaleString()}</td>
                <td className="border px-2 py-1 text-right">{total.balance.toLocaleString()}</td>
                <td className="border px-2 py-1"></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default PrintReport;
