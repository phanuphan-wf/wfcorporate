import { useContext, useMemo } from "react";
import { dataContext } from "./report";

function PrintReport() {
  const { reportC } = useContext(dataContext);
  const [reportlist] = reportC;

  // ✅ 0) ปรับข้อมูลให้ amount แสดงเฉพาะแถวแรกของแต่ละบริษัท (แถวถัดไป = 0)
  const normalizedList = useMemo(() => {
    const list = Array.isArray(reportlist) ? reportlist : [];
    const seen = new Set(); // เก็บชื่อบริษัทที่เคยเจอแล้ว

    return list.map((row) => {
      const company = row?.name ?? "ไม่ระบุบริษัท";
      if (!seen.has(company)) {
        // ครั้งแรกของบริษัทนี้ → คง amount เดิม
        seen.add(company);
        return {
          ...row,
          amount: Number(row?.amount ?? 0),
        };
      }
      // ไม่ใช่ครั้งแรก → amount = 0
      return {
        ...row,
        amount: 0,
      };
    });
  }, [reportlist]);

  // ✅ 1) Group ซ้อนกัน: Zone → Sales (ใช้ normalizedList)
  const groupedByZoneAndSales = useMemo(() => {
    return normalizedList.reduce((acc, item) => {
      const zone = item?.zone ?? "ไม่ระบุโซน";
      const sales = item?.sales ?? "ไม่ระบุ Sales";

      if (!acc[zone]) acc[zone] = {};
      if (!acc[zone][sales]) acc[zone][sales] = [];
      acc[zone][sales].push(item);

      return acc;
    }, {});
  }, [normalizedList]);

  // ✅ 2) ฟังก์ชันรวมยอด (เมื่อ amount ในแถวถัด ๆ ไปเป็น 0 แล้ว การรวมจะถูกต้องเอง)
  const calcTotals = (rows) => ({
    qty: rows.reduce((sum, r) => sum + Number(r?.qty ?? 0), 0),
    volume: rows.reduce((sum, r) => sum + Number(r?.volume ?? 0), 0),
    amount: rows.reduce((sum, r) => sum + Number(r?.amount ?? 0), 0),
    balance: rows.reduce((sum, r) => sum + Number(r?.balance ?? 0), 0),
  });

  return (
    <section className="mt-6 space-y-8">
      {/* ✅ Summary */}
      <div className="border border-zinc-300 rounded-md p-4 bg-white">
        <h3 className="font-semibold text-red-600">Report (Print All)</h3>
        <p>Zone ทั้งหมด: {Object.keys(groupedByZoneAndSales).length} โซน</p>
        <p>
          Sales ทั้งหมด:{" "}
          {
            new Set(
              (Array.isArray(reportlist) ? reportlist : []).map(
                (item) => item?.sales ?? "ไม่ระบุ Sales"
              )
            ).size
          }{" "}
          คน
        </p>
      </div>

      {/* ✅ ตาราง Zone > Sales */}
      {Object.entries(groupedByZoneAndSales).map(([zone, salesObj], idx) => (
        <div
          key={`zone-${idx}`}
          className="border border-zinc-300 rounded-md p-4 bg-white mb-4"
        >
          <h4 className="font-semibold text-green-600 mb-2">Zone: {zone}</h4>

          {Object.entries(salesObj).map(([sales, rows], sIdx) => {
            const total = calcTotals(rows);

            return (
              <div key={`sales-${sIdx}`} className="mb-6">
                <div className="relative flex items-center mb-2">
                  <h3 className="flex-1 text-left">พนักงานขาย : {sales}</h3>
                  <h3 className="absolute left-1/2 -translate-x-1/2 text-center">
                    โซน : {zone}
                  </h3>
                  <h3 className="flex-1 text-right">หน้าที่ : </h3>
                </div>

                <table className="w-full border-collapse border">
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
                    {rows.map((row, i) => (
                      <tr key={`${row?.name ?? "unknown"}-${i}`}>
                        <td className="border px-2 py-1 text-center">{i + 1}</td>
                        <td className="border px-2 py-1">{row?.name}</td>
                        <td className="border px-2 py-1 text-center">
                          {row?.page ?? "-"}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {row?.booth ?? "-"}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {Number(row?.qty ?? 0).toFixed(2)}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {Number(row?.volume ?? 0).toLocaleString()}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {Number(row?.amount ?? 0).toLocaleString()}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {Number(row?.balance ?? 0).toLocaleString()}
                        </td>
                        <td className="border px-2 py-1">{row?.tel ?? "-"}</td>
                      </tr>
                    ))}

                    {/* ✅ Total row */}
                    <tr className="font-semibold bg-gray-50">
                      <td className="border px-2 py-1 text-center" colSpan={4}>
                        ยอดรวมทั้งสิ้น
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {total.qty.toFixed(2)}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {total.volume.toLocaleString()}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {total.amount.toLocaleString()}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {total.balance.toLocaleString()}
                      </td>
                      <td className="border px-2 py-1"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}

export default PrintReport;
