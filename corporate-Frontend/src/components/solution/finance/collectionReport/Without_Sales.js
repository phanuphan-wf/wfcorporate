// src/components/solution/finance/collectionReport/Without_Sales.jsx
import { useContext, useMemo } from "react";
import { dataContext } from "./report";

export default function Without_Sales() {
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

  // Group เฉพาะ Zone
  const groupedByZone = useMemo(() => {
    return normalizedList.reduce((acc, r) => {
      const zone = r?.zone ?? "ไม่ระบุโซน";
      if (!acc[zone]) acc[zone] = [];
      acc[zone].push(r);
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
        <th className="border px-2 py-1">Sales</th>
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
          <td className="border px-2 py-1">{row?.sales ?? "-"}</td>
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
        <h3 className="font-semibold text-red-600">Report (Without Sales)</h3>
        <p>Zone ทั้งหมด: {Object.keys(groupedByZone).length} โซน</p>
      </div>

      {Object.entries(groupedByZone).map(([zone, rows]) => (
        <div key={`zone-only-${zone}`} className="border border-zinc-300 rounded-md p-4 bg-white mb-4">
          <h4 className="font-semibold text-green-600 mb-2">Zone: {zone}</h4>
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
