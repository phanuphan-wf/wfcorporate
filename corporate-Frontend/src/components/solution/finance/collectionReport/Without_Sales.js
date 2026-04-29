import { useState, useContext, useMemo, useEffect} from "react";
import Axios from "axios";
import { dataContext } from "./report";


export default function Without_Sales({preview}) {
  const {reportC, filterC, paymentC} = useContext(dataContext);
  const [reportlist] = reportC;
  const [filter] = filterC;
  const [payment] = paymentC;


  useEffect(() => {
     //console.log(filter);
  }, [filter]);


  const normalizedList = useMemo(() => {
    if (!reportlist || reportlist.length === 0) return [];

    const list = [...reportlist]; // Clone ข้อมูล
    const seen = new Map();
    const balanceMap = new Map(); 

    list.forEach((row) => {
      const company = row?.name ?? "ไม่ระบุบริษัท";
      balanceMap.set(company, (balanceMap.get(company) || 0) + Number(row?.volume ?? 0));
    });

    list.forEach((row, idx) => {
      const company = row?.name ?? "ไม่ระบุบริษัท";
      if (!seen.has(company)) {
        seen.set(company, idx);
        row.tempAmount = Number(row?.amount ?? 0);
      } else {
        row.tempAmount = 0;
      } 
    });

    const calculatedResult = list.map((row, idx) => {
      const company = row?.name ?? "ไม่ระบุบริษัท";
      const firstIndex = seen.get(company);
      const balance = idx === firstIndex ? balanceMap.get(company) - row.tempAmount : 0;
      const isTotalDebt = (balanceMap.get(company) - Number(row?.amount ?? 0)) > 0;

      return {
        ...row,
        amount: row.tempAmount,
        balance: balance,
        isTotalDebt: isTotalDebt,
        isFirstRow: idx === firstIndex
      };
    });

    return calculatedResult.filter((row) => {
      const pValue = String(payment);
      if (pValue === "0") return true;
      if (pValue === "1") return !row.isTotalDebt;
      if (pValue === "2") return row.isTotalDebt;
      return true;
    });
  }, [reportlist, payment]);

  // useEffect(() => {
  //   console.log(normalizedList);
  // }, [normalizedList]);

   const groupedByZone = useMemo(() => {
    if (!normalizedList || normalizedList.length === 0) return {};

    return normalizedList.reduce((acc, item) => {
      const zone = item?.zone ?? "ไม่ระบุโซน";
      if (!acc[zone]) {
        acc[zone] = [];
      }

      acc[zone].push(item);
      return acc;
    }, {});
  }, [normalizedList]);

  // useEffect(() => {
  //   console.log(groupedByZone);
  // }, [groupedByZone]);

  const calcTotals = (items) => {
    return items.reduce(
      (acc, item) => {
        acc.qty += Number(item.qty || 0);
        acc.volume += Number(item.volume || 0);
        acc.amount += Number(item.amount || 0);
        acc.balance += Number(item.balance || 0);
        return acc;
      },
      { qty: 0, volume: 0, amount: 0, balance: 0 }
    );
  };

  if (!preview) return null;

  if (reportlist.length === 0) {
    return (
      <div className="mt-8 p-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
        <div className="flex flex-col items-center justify-center">             
          <h3 className="text-lg font-bold text-gray-700">No information found.</h3>         
        </div>
      </div>
    );
  }
    

  return (
    <section className="mt-6 space-y-8">
      {Object.entries(groupedByZone).map(([zone, items]) => {
        const totals = calcTotals(items);
        
        return (
          <div key={zone} className="border rounded-lg bg-white shadow p-4">
          
            <h4 className="font-semibold text-green-600 mb-2 ml-4">
              Zone: {zone}
            </h4>

            <div className="overflow-x-auto">
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
                      <th className="border px-2 py-1">Sales</th>
                    </tr>
                  </thead>
                  
                  <tbody className="text-sm">
                    {items.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 border-b">
                        <td className="border border-l-0  p-2 text-center">{i + 1}</td>
                        <td className="border px-2 py-1">{row.name}</td>
                        <td className="border px-2 py-1 text-center">-</td>
                        <td className="border px-2 py-1 text-center">{row.booth}</td>
                        <td className="border px-2 py-1 text-right">
                          {Number(row.qty).toFixed(2)}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {Number(row.volume ?? 0).toLocaleString()}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {Number(row?.amount ?? 0) === 0 
                          ? "---------"
                          : Number(row?.amount).toLocaleString()}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {row.balance === 0 ? "---------" : row.balance.toLocaleString()}
                        </td>
                        <td className="border px-2 py-1">
                          {row?.tel || "-"}
                        </td>
                        <td className="border px-2 py-1">
                          {row?.sales || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
              
                  <tfoot className="font-semibold text-sm">
                    <tr className="border-l-0 bg-gray-50">
                      <td colSpan="4" className="border border-l-0  p-2 text-center">
                         รวมยอดทั้งสิ้น 
                      </td>
                      <td className="border px-2 py-2 text-right">
                        {totals.qty.toFixed(2)}
                      </td>
                      <td className="border px-2 py-2 text-right">{totals.volume.toLocaleString()}</td>
                      <td className="border px-2 py-2 text-right">{totals.amount.toLocaleString()}</td>
                      <td className="border px-2 py-2 text-right">{totals.balance.toLocaleString()}</td>
                      <td className="border px-2 py-2" colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          );
        })}
    </section>
  );
}
