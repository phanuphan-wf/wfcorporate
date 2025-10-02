// src/components/solution/finance/collectionReport/Without_Zones.jsx
import { useContext, useMemo } from "react";
import { dataContext } from "./report";

export default function Without_Zones() {
  const { reportC } = useContext(dataContext);
  const [reportlist] = reportC;

  const safeList = Array.isArray(reportlist) ? reportlist : [];

  // (ทางเลือก) Normalize: ให้ amount ของบริษัทเดียวกันแสดงเฉพาะแถวแรก
  const normalizedList = useMemo(() => {
    const seen = new Set();
    return safeList.map((row) => {
      const name = row?.name ?? "ไม่ระบุบริษัท";
      if (!seen.has(name)) {
        seen.add(name);
        return { ...row, amount: Number(row?.amount ?? 0) };
      }
      return { ...row, amount: 0 };
    });
  }, [safeList]);

  // Group เฉพาะ Sales
  const groupedBySales = useMemo(() => {
    return normalizedList.reduce((acc, r) => {
      const sales = r?.sales ?? "ไม่ระบุ Sales";
      if (!acc[sales]) acc[sales] = [];
      acc[sales].push(r);
      return acc;
    }, {});
  }, [normalizedList]);

  const calcTotals = (rows) => ({
    qty: rows.reduce((s, r) => s + Number(r?.qty ?? 0), 0),
    volume: rows.reduce((s, r) => s + Number(r?.volume ?? 0), 0),
    amount: rows.reduce((s, r) => s + Number(r?.amount ?? 0), 0),
    balance: rows.reduce((s, r) => s + Number(r?.balance ?? 0), 0),
  });

  const TableHead = () => (
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
        <th className="border px-2 py-1">Zone</th>
      </tr>
    </thead>
  );

  const TableRows = ({ rows }) => (
    <tbody>
      {rows.map((row, i) => (
        <tr key={`${row?.name ?? "unk"}-${i}`}>
          <td className="border px-2 py-1 text-center">{i + 1}</td>
          <td className="border px-2 py-1">{row?.name}</td>
          <td className="border px-2 py-1 text-center">{row?.page ?? "-"}</td>
          <td className="border px-2 py-1 text-center">{row?.booth ?? "-"}</td>
          <td className="border px-2 py-1 text-right">{Number(row?.qty ?? 0).toFixed(2)}</td>
          <td className="border px-2 py-1 text-right">{Number(row?.volume ?? 0).toLocaleString()}</td>
          <td className="border px-2 py-1 text-right">{Number(row?.amount ?? 0).toLocaleString()}</td>
          <td className="border px-2 py-1 text-right">{Number(row?.balance ?? 0).toLocaleString()}</td>
          <td className="border px-2 py-1">{row?.tel ?? "-"}</td>
          <td className="border px-2 py-1">{row?.zone ?? "-"}</td>
        </tr>
      ))}
    </tbody>
  );

  const TotalRow = ({ rows }) => {
    const t = calcTotals(rows);
    return (
      <tfoot>
        <tr className="font-semibold bg-gray-50">
          <td className="border px-2 py-1 text-center" colSpan={4}>ยอดรวมทั้งสิ้น</td>
          <td className="border px-2 py-1 text-right">{t.qty.toFixed(2)}</td>
          <td className="border px-2 py-1 text-right">{t.volume.toLocaleString()}</td>
          <td className="border px-2 py-1 text-right">{t.amount.toLocaleString()}</td>
          <td className="border px-2 py-1 text-right">{t.balance.toLocaleString()}</td>
          <td className="border px-2 py-1"></td>
        </tr>
      </tfoot>
    );
  };

  return (
    <section className="mt-6 space-y-8">
      <div className="border border-zinc-300 rounded-md p-4 bg-white">
        <h3 className="font-semibold text-red-600">Report (Without Zones)</h3>
        <p>Sales ทั้งหมด: {Object.keys(groupedBySales).length} คน</p>
      </div>

      {Object.entries(groupedBySales).map(([sales, rows]) => (
        <div key={`sales-only-${sales}`} className="border border-zinc-300 rounded-md p-4 bg-white mb-4">
          <div className="relative flex items-center mb-2">
             <h4 className="font-semibold text-green-600 mb-2">พนักงานขาย : {sales}</h4>
            <h3 className="flex-1 text-right">หน้าที่ : </h3>
          </div>
          <table className="w-full border-collapse border">
            <TableHead />
            <TableRows rows={rows} />
            <TotalRow rows={rows} />
          </table>
        </div>
      ))}
    </section>
  );
}
