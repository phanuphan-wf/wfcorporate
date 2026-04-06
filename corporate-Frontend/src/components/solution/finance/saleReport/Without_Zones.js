
import React, { useState, useEffect, useContext, useMemo } from "react";
import { dataContext } from "./salereport";
import Axios from "axios";
import Without_Chart from "./Without_Chart";

export default function Without_Zones() {

    const {filterC} = useContext(dataContext);
    const [filter] = filterC;

   // console.log(filter);

    const isDisabled = !filter.exID || filter.exID === "";  

    //console.log(isDisabled);

    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_srp;
    const [reportList, setReportList] = useState([]);

    //console.log(reportList);


    const getReport = async () => {
       
        const payload = { 
            exID: filter.exID 
        };
       
        if (filter.sales && filter.sales !== "") {
            payload.saleID = filter.sales;
        }

    
        if (filter.zone && filter.zone !== "") {
            payload.zone = filter.zone;
        }

    
        try {
            //console.log(payload);
            const res = await Axios.post(url + "/getReport/", payload);
            
            if (res.status === 200) {
                setReportList(res.data);
            }
        } catch (err) {
            console.error("Fetch Report Error:", err);
        }
    };


    useEffect (() => {
        if (!isDisabled) {
             getReport();
        }       
    }, [isDisabled]);

    

    const groupedData = useMemo(() => {
        if (reportList.length === 0) return []; // คืนค่าเป็น Array เปล่า

        // 1. Group ข้อมูลตาม salesName ก่อน
        const map = reportList.reduce((acc, item) => {
            const salesName = item.sales?.trim() || "ไม่ระบุชื่อขาย";
            
            if (!acc[salesName]) {
                acc[salesName] = {
                    salesName: salesName,
                    customerCount: 0,
                    totalBooth: 0,
                    totalVolume: 0,
                    zones: [] // ถ้ายังอยากเก็บรายละเอียดโซนไว้ข้างใน
                };
            }

            acc[salesName].customerCount += 1;
            acc[salesName].totalBooth += Number(item.booth || 0);
            acc[salesName].totalVolume += Number(item.volume || 0);
            
            return acc;
        }, {});

        // 2. แปลงจาก Object ที่มี Key เป็นชื่อ ให้กลายเป็น Array เพื่อนำไป map แสดงผลในตารางเดียว
        return Object.values(map).map(item => ({
            ...item,
            totalBooth: Number(item.totalBooth.toFixed(2)),
            totalVolume: Number(item.totalVolume.toFixed(2))
        }));
    }, [reportList]);


    const [totalBooth, setTotalBooth] = useState(0);
    const [totalVolume, setTotalVolume] = useState(0);

    
    const getSum = async () => {

        if (!filter.exID) return;

        try {

            const res = await Axios.get(url + "/getSum/" + filter.exID);
            
            if (res.status === 200) {             
                setTotalBooth(Number(res.data.booth) || 0);
                setTotalVolume(Number(res.data.volume) || 0);
            }
        } catch (err) {
            console.error("Fetch Sum Error:", err);
        }
    };

    useEffect(() => {
        if (!isDisabled) {
            getSum();      
        }
    }, [filter.exID]);

    return (
        <section className="mt-5 space-y-5">
            <div className="border border-zinc-300 rounded-md p-4 bg-white mb-4 shadow-sm">
            {groupedData.length > 0 ? (
                <>
                <table className="w-full border-collapse border border-zinc-400 shadow-sm mb-6">
                    <thead>
                    <tr className="bg-gray-100 text-black text-sm">
                        <th className="border border-zinc-400 px-2 py-1 w-16" rowSpan={2}>ลำดับ</th>
                        <th className="border border-zinc-400 px-2 py-1" rowSpan={2}>ชื่อฝ่ายขาย</th>
                        <th colSpan={3} className="border border-zinc-400 px-2 py-1 text-center">ยอดขายรวม</th>
                    </tr>
                    <tr className="bg-gray-100 text-sm">
                        <th className="border border-zinc-400 px-2 py-1 text-black text-center w-28">จำนวนลูกค้า</th>
                        <th className="border border-zinc-400 px-2 py-1 text-black text-center w-28">จำนวนบูธ</th>
                        <th className="border border-zinc-400 px-2 py-1 text-black text-center w-1/5">ยอดเงิน</th>
                    </tr>
                    </thead>

                    <tbody>
                        {groupedData.map((sale, index) => (
                            <tr key={index} className="hover:bg-zinc-50 text-sm">
                                <td className="border border-zinc-400 px-2 py-1 text-center">{index + 1}</td>
                                <td className="border border-zinc-400 px-2 py-1 font-medium">{sale.salesName}</td>
                                <td className="border border-zinc-400 px-2 py-1 text-center">
                                    {sale.customerCount}
                                </td>
                                <td className="border border-zinc-400 px-2 py-1 text-right">
                                    {sale.totalBooth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="border border-zinc-400 px-2 py-1 text-right">
                                    {sale.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}

                    {/* แถวสรุปยอดรวมของทุกคน (Grand Total) */}
                    <tr className="bg-blue-50 font-semibold">
                        <td colSpan={2} className="border border-zinc-400 px-2 py-1 text-left text-blue-800">
                        ยอดรวมทั้งสิ้น
                        </td>
                        <td className="border border-zinc-400 px-2 py-1 text-center text-blue-800">
                        {groupedData.reduce((sum, s) => sum + s.customerCount, 0)} ราย
                        </td>
                        <td className="border border-zinc-400 px-2 py-1 text-right text-blue-800">
                        {groupedData.reduce((sum, s) => sum + s.totalBooth, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} บูธ
                        </td>
                        <td className="border border-zinc-400 px-2 py-1 text-right text-blue-800">
                        {groupedData.reduce((sum, s) => sum + s.totalVolume, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท
                        </td>
                    </tr>
                    </tbody>
                </table>

                {/* ส่วนแสดงกราฟสรุปภาพรวมทั้งหมด */}
                <div className="mt-8 border-t pt-6">
                    <Without_Chart 
                    // ส่งข้อมูลฝ่ายขายแต่ละคนไปทำสัดส่วนในกราฟ Pie
                    data={groupedData.map(s => ({ zoneName: s.salesName, totalVolume: s.totalVolume }))}
                    totalBooth={totalBooth} 
                    totalVolume={totalVolume}
                    />
                </div>
                </>
            ) : (
                <div className="py-10 text-center text-zinc-400 italic">
                -- No information found.--
                </div>
            )}
            </div>
        </section>
    );

}