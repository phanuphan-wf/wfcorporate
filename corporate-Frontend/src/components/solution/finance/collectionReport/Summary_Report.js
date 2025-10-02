// src/components/solution/finance/collectionReport/SummaryReport.jsx
import { useContext, useMemo } from "react";
import { dataContext } from "./report";

export default function SummaryReport() {
  const { reportC } = useContext(dataContext);
  const [reportlist] = reportC;

  const safeList = Array.isArray(reportlist) ? reportlist : [];

  // (ตัวเลือก) Normalize: บริษัทเดียวกันให้ amount โผล่เฉพาะรายการแรก
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

  // (ตัวเลือก) เรียงข้อมูลให้อ่านง่าย: Zone > Sales > Name
  const sortedRows = useMemo(() => {
    return [...normalizedList].sort((a, b) => {
      const za = (a?.zone ?? "ไม่ระบุโซน").localeCompare(b?.zone ?? "ไม่ระบุโซน", "th");
      if (za !== 0) return za;
      const sa = (a?.sales ?? "ไม่ระบุ Sales").localeCompare(b?.sales ?? "ไม่ระบุ Sales", "th");
      if (sa !== 0) return sa;
      return (a?.name ?? "").localeCompare(b?.name ?? "", "th");
    });
  }, [normalizedList]);

  const totals = useMemo(() => ({
    qty: sortedRows.reduce((s, r) => s + Number(r?.qty ?? 0), 0),
    volume: sortedRows.reduce((s, r) => s + Number(r?.volume ?? 0), 0),
    amount: sortedRows.reduce((s, r) => s + Number(r?.amount ?? 0), 0),
    balance: sortedRows.reduce((s, r) => s + Number(r?.balance ?? 0), 0),
  }), [sortedRows]);

  const TableHead = () => (
    <thead>
      <tr className="bg-gray-100">
        <th className="border px-2 py-1">ลำดับ</th>
        <th className="border px-2 py-1">โซน</th>
        <th className="border px-2 py-1">ฝ่ายขาย</th>
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
  );

  const TotalRow = () => (
    <tfoot>
      <tr className="font-semibold bg-gray-50">
        <td className="border px-2 py-1 text-center" colSpan={6}>ยอดรวมทั้งสิ้น</td>
        <td className="border px-2 py-1 text-right">{totals.qty.toFixed(2)}</td>
        <td className="border px-2 py-1 text-right">{totals.volume.toLocaleString()}</td>
        <td className="border px-2 py-1 text-right">{totals.amount.toLocaleString()}</td>
        <td className="border px-2 py-1 text-right">{totals.balance.toLocaleString()}</td>
        <td className="border px-2 py-1"></td>
      </tr>
    </tfoot>
  );

  return (
    <section className="mt-6 space-y-8">
      {/* Summary cards */}
      <div className="border border-zinc-300 rounded-md p-4 bg-white">
        <h3 className="font-semibold text-red-600 mb-3">Summary Report</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded bg-gray-50 border">
            <div className="text-zinc-500 text-sm">จำนวนรวม</div>
            <div className="font-semibold">{totals.qty.toFixed(2)}</div>
          </div>
          <div className="p-3 rounded bg-gray-50 border">
            <div className="text-zinc-500 text-sm">ยอดเงินรวม</div>
            <div className="font-semibold">{totals.volume.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded bg-gray-50 border">
            <div className="text-zinc-500 text-sm">ชำระแล้วรวม</div>
            <div className="font-semibold">{totals.amount.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded bg-gray-50 border">
            <div className="text-zinc-500 text-sm">ยอดคงค้างรวม</div>
            <div className="font-semibold">{totals.balance.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* One big table */}
      <div className="border border-zinc-300 rounded-md p-4 bg-white mb-4">
        <table className="w-full border-collapse border">
          <TableHead />
          <tbody>
            {sortedRows.map((row, i) => (
              <tr key={`${row?.name ?? "unk"}-${i}`}>
                <td className="border px-2 py-1 text-center">{i + 1}</td>
                <td className="border px-2 py-1">{row?.zone ?? "ไม่ระบุโซน"}</td>
                <td className="border px-2 py-1">{row?.sales ?? "ไม่ระบุ Sales"}</td>
                <td className="border px-2 py-1">{row?.name}</td>
                <td className="border px-2 py-1 text-center">{row?.page ?? "-"}</td>
                <td className="border px-2 py-1 text-center">{row?.booth ?? "-"}</td>
                <td className="border px-2 py-1 text-right">{Number(row?.qty ?? 0).toFixed(2)}</td>
                <td className="border px-2 py-1 text-right">{Number(row?.volume ?? 0).toLocaleString()}</td>
                <td className="border px-2 py-1 text-right">{Number(row?.amount ?? 0).toLocaleString()}</td>
                <td className="border px-2 py-1 text-right">{Number(row?.balance ?? 0).toLocaleString()}</td>
   
                <td className="border px-2 py-1 whitespace-pre-wrap break-words">
                  {row?.tel
                    ? row.tel.length > 25
                      ? row.tel.substring(0, 25) + "\n" + row.tel.substring(25)
                      : row.tel
                    : "-"}
                </td>

              </tr>
            ))}
          </tbody>
          <TotalRow />
        </table>
      </div>
    </section>
  );
}
