import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";



function PrintReport({ reportlist = [], showReport, onPrint }) {
  // รวมยอด
  const total = {
    qty: reportlist.reduce((sum, row) => sum + (row.qty ?? 0), 0),
    volume: reportlist.reduce((sum, row) => sum + (row.volume ?? 0), 0),
    amount: reportlist.reduce((sum, row) => sum + (row.amount ?? 0), 0),
    paid: reportlist.reduce((sum, row) => sum + (row.paid ?? 0), 0),
    balance: reportlist.reduce((sum, row) => sum + (row.balance ?? 0), 0),    
  };

  if (!showReport) return null; // ซ่อนตารางตอนแรก

  return (
    <section className="2xl:container">
      {/* ปุ่ม Print Report */}
      {/* <div className="flex justify-end mt-6">
        <button className="btn-primary px-2" onClick={onPrint}>
          Print Report
        </button>
      </div> */}

      {/* ตารางรายงาน */}
      <div className="mt-6 border rounded-md p-4">
        <div className="relative flex items-center">
          <h3 className="flex-1 text-left">
            พนักงานขาย : {reportlist.length > 0 ? reportlist[0].sales : "-"}
          </h3>
          <h3 className="absolute left-1/2 -translate-x-1/2 text-center">
            โซน : {reportlist.length > 0 ? reportlist[0].zone : "-"}
          </h3>
          <h3 className="flex-1 text-right">หน้าที่ : 1</h3>
        </div>   

        {reportlist.length === 0 ? (
          <p className="text-center mt-4 text-gray-500">ไม่มีข้อมูลรายงาน</p>
        ) : (
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
              {reportlist.map((row, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1 text-center">{i + 1}</td>
                  <td className="border px-2 py-1">{row.name ?? "-"}</td>
                  <td className="border px-2 py-1 text-center">{row.page ?? "-"}</td>
                  <td className="border px-2 py-1 text-center">{row.booth ?? "-"}</td>
                  <td className="border px-2 py-1 text-right">{(row.qty ?? 0).toFixed(2)}</td>
                  <td className="border px-2 py-1 text-right">{(row.volume ?? 0).toLocaleString()}</td>
                  <td className="border px-2 py-1 text-right">
                    {i === 0 && row.amount != null
                      ? row.amount.toLocaleString()
                      : "-------"}
                  </td>
                  <td className="border px-2 py-1 text-right">{row.balance != null ? row.balance.toLocaleString() : "-------"}</td>
                  <td className="border px-2 py-1">{row.tel ?? "-"}</td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-50">
                <td className="border px-2 py-1 text-center" colSpan={4}>รวมยอดทั้งสิ้น</td>
                <td className="border px-2 py-1 text-right">{total.qty.toFixed(2)}</td>
                <td className="border px-2 py-1 text-right">{total.volume.toLocaleString()}</td>
                <td className="border px-2 py-1 text-right">{reportlist[0].amount?.toLocaleString()}</td>
                <td className="border px-2 py-1 text-right">{total.balance.toLocaleString()}</td>
                <td className="border px-2 py-1"></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default PrintReport;
