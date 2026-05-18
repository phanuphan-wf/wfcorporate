import React,{useState, useEffect, useContext,useMemo} from "react";

import { dataContext } from "./salereport";
import Axios from "axios";

import Sale_Chart from "./Sale_Chart";

export default function SaleSum() {
  const { filterC, eventC, salesC} = useContext(dataContext);
  const [filter] = filterC;
  const [event] = eventC; 
  const [sales] = salesC;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_srp;
  const [reportList, setReportList] = useState([]);


    const getReport = async () => {

        const payload = {
            exID: filter.exID,
            saleID: sales.salesID,
            zone:"0"
        };        

        console.log(payload);
        try {
            const res = await Axios.post(url + "/getReport/" , payload);

            if (res.status === 200) {
                setReportList(res.data);
            }
        } catch (err) {
          console.error(err);
        }
    };

    useEffect(() => {
        if (sales.salesID) {
            getReport();
        }
    },[sales.salesID]);

    useEffect(() => {
        console.log(reportList);
    }, [reportList]);


    const groupZone = useMemo(() => {
        if (reportList.length === 0) return [];

        const map = reportList.reduce((acc, item) => {
            const zone = item.zone?.trim() || "ไม่ระบุโซน";
            if (!acc[zone]) {
                acc[zone] = {
                    zone: zone,
                    customerSet: new Set(),
                    boothCount: 0,
                    totalAmount: 0
                };
            }

            acc[zone].customerSet.add(item.customer?.trim() || "ไม่ระบุลูกค้า");
            acc[zone].boothCount += Number(item.booth || 0);
            acc[zone].totalAmount += Number(item.volume || 0);

            return acc;
        }, {});

        return Object.values(map).map(({ customerSet, ...rest }) => ({
            ...rest,
            customerCount: customerSet.size
        }));
    }, [reportList]);

    useEffect(() => {
        console.log(groupZone);
    }, [groupZone]);

    return (
        <section className="SaleSum mt-4">
            <div className="border border-zinc-300 reunded-md p-4 bg-white mb-2">
                <div className="relative flex items-center mb-2">
                    <h3 className="flex-1 text-left font-bold text-sm text-zinc-800">
                        ชื่อฝ่ายขาย : {sales.salesName}
                    </h3>
                </div>

                <table className="w-full border-collapse border border-zinc-400 shadow-sm">
                    <thead>
                        <tr className="bg-gray-100 text-black">
                            <th className="border border-zinc-400 px-2 py-1 w-16" rowSpan={2}>ลำดับ</th>
                            <th className="border border-zinc-400 px-2 py-1 " rowSpan={2}>โซนแสดงสินค้า</th>
                            <th colSpan={3} className="border border-zinc-400 px-2 py-1 text-center">ยอดขาย</th>
                        </tr>
                        <tr className="bg-gray-100">
                            <th className="border border-zinc-400 px-2 py-1 text-black text-center w-28">จำนวนลูกค้า</th>
                            <th className="border border-zinc-400 px-2 py-1 text-black text-center w-28">จำนวนบูธ</th>
                            <th className="border border-zinc-400 px-2 py-1 text-black text-center w-1/5">ยอดเงิน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupZone.map((zone, index) => (
                            <tr key={zone.zone} className="hover:bg-zinc-50 text-sm">
                                <td className="border border-zinc-400 px-2 py-1 text-center">{index + 1}</td>
                                <td className="border border-zinc-400 px-2 py-1">{zone.zone}</td>
                                <td className="border border-zinc-400 px-2 py-1 text-center">{zone.customerCount}</td>
                                <td className="border border-zinc-400 px-2 py-1 text-right">{zone.boothCount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="border border-zinc-400 px-2 py-1 text-right">{zone.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-blue-50 font-semibold">
                            <td colSpan={2} className="border border-zinc-400 px-2 py-1 text-left text-blue-800">
                                ยอดรวมทั้งสิ้น
                            </td>
                            <td className="border border-zinc-400 px-2 py-1 text-center text-blue-800">
                                {groupZone.reduce((sum, z) => sum + z.customerCount, 0)} ราย
                            </td>
                            <td className="border border-zinc-400 px-2 py-1 text-right text-blue-800">
                                {groupZone.reduce((sum, z) => sum + z.boothCount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} บูธ
                            </td>
                            <td className="border border-zinc-400 px-2 py-1 text-right text-blue-800">
                                {groupZone.reduce((sum, z) => sum + z.totalAmount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <div>
                     <Sale_Chart 
                        data={groupZone}                        
                        boothCount={groupZone.reduce((sum, z) => sum + z.boothCount, 0)}
                        totalAmount={groupZone.reduce((sum, z) => sum + z.totalAmount, 0)}                                           
                     />
                </div>
            </div>
        </section>
    );


}