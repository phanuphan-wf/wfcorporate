
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

    console.log(reportList);


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
    if (reportList.length === 0) return {};

    const result = reportList.reduce((acc, item) => {
        const salesName = item.sales?.trim() || "ไม่ระบุชื่อขาย";
        const zoneName = item.zone?.trim() || "ไม่ระบุโซน";

        // สร้างโครงสร้างตามชื่อพนักงานก่อน
        if (!acc[salesName]) acc[salesName] = {};
        
        // ภายใต้พนักงานคนนั้น ให้แบ่งตามโซน
        if (!acc[salesName][zoneName]) {
        acc[salesName][zoneName] = {
            zoneName: zoneName, // เก็บชื่อโซนไว้ใน Object ด้วยเพื่อนำไป map
            customerCount: 0,
            totalBooth: 0,
            totalVolume: 0
        };
        }

        acc[salesName][zoneName].customerCount += 1;
        acc[salesName][zoneName].totalBooth += Number(item.booth || 0);
        acc[salesName][zoneName].totalVolume += Number(item.volume || 0);

        return acc;
    }, {});

    // ปรับทศนิยม 2 ตำแหน่ง
    Object.keys(result).forEach((sales) => {
        Object.values(result[sales]).forEach((zoneData) => {
        zoneData.totalBooth = Number(zoneData.totalBooth.toFixed(2));
        zoneData.totalVolume = Number(zoneData.totalVolume.toFixed(2));
        });
    });

    return result;
    }, [reportList]);


    const { totalBooth, totalVolume } = useMemo(() => {
        
            if (reportList.length === 0) return { totalBooth: 0, totalVolume: 0 };
    
            return reportList.reduce((acc, item) => {
                // ใช้ Number() เพื่อแปลงค่า (เช่น 1.5) และป้องกัน Error หากค่ามาเป็น String
                acc.totalBooth += Number(item.booth || 0);
                acc.totalVolume += Number(item.volume || 0);
                return acc;
            }, { totalBooth: 0, totalVolume: 0 });
    }, [reportList]);

    return (
        <section className="mt-5 space-y-5">
            <div className="border border-zinc-300 rounded-md p-4 bg-white mb-4">
            {Object.keys(groupedData).length > 0 ? (
                Object.keys(groupedData).map((salesName) => {
                // ดึงรายการโซนทั้งหมดที่พนักงานคนนี้ขายได้
                const zonesForThisSale = Object.values(groupedData[salesName]);                
                const subTotalCustomers = zonesForThisSale.reduce((sum, z) => sum + z.customerCount, 0);
                const subTotalBooths = zonesForThisSale.reduce((sum, z) => sum + z.totalBooth, 0);
                const subTotalVolume = zonesForThisSale.reduce((sum, z) => sum + z.totalVolume, 0);

                return (
                    <div key={salesName} className="mb-8 last:mb-0">
                    <div className="relative flex items-center mb-2">
                        <h3 className="flex-1 text-left font-bold text-zinc-800">
                        ชื่อฝ่ายขาย : {salesName}
                        </h3>
                    </div>

                        <table className="w-full border-collapse border border-zinc-400 shadow-sm">
                            <thead>
                            <tr className="bg-gray-100 text-black text-sm">
                                <th className="border border-zinc-400 px-2 py-1 w-16" rowSpan={2}>ลำดับ</th>
                                <th className="border border-zinc-400 px-2 py-1" rowSpan={2}>โซนแสดงสินค้า</th>
                                <th colSpan={3} className="border border-zinc-400 px-2 py-1 text-center">ยอดขาย</th>
                            </tr>
                            <tr className="bg-gray-100 text-sm">
                                <th className="border border-zinc-400 px-2 py-1 text-black text-center w-28">จำนวนลูกค้า</th>
                                <th className="border border-zinc-400 px-2 py-1 text-black text-center w-28">จำนวนบูธ</th>
                                <th className="border border-zinc-400 px-2 py-1 text-black text-center w-1/5">ยอดเงิน</th>
                            </tr>
                            </thead>
                            <tbody>
                            {zonesForThisSale.map((zoneData, index) => (
                                <tr key={`${salesName}-${zoneData.zoneName}`} className="hover:bg-gray-50">
                                <td className="border border-zinc-400 px-2 py-1 text-center">{index + 1}</td>
                                <td className="border border-zinc-400 px-2 py-1">{zoneData.zoneName}</td>
                                <td className="border border-zinc-400 px-2 py-1 text-center">
                                    {zoneData.customerCount} ราย
                                </td>
                                <td className="border border-zinc-400 px-2 py-1 text-right">
                                    {zoneData.totalBooth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="border border-zinc-400 px-2 py-1 text-right">
                                    {zoneData.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                </tr>
                            ))}

                            {/* แถวสรุปยอดรวมของพนักงานคนนี้ */}
                            <tr className="bg-blue-50 font-semibold">
                                <td colSpan={2} className="border border-zinc-400 px-2 py-1 text-left text-blue-800">
                                ยอดรวมทั้งสิ้น
                                </td>
                                <td className="border border-zinc-400 px-2 py-1 text-center text-blue-800">
                                {subTotalCustomers} ราย
                                </td>
                                <td className="border border-zinc-400 px-2 py-1 text-right text-blue-800">
                                {subTotalBooths.toLocaleString(undefined, { minimumFractionDigits: 2 })} บูธ
                                </td>
                                <td className="border border-zinc-400 px-2 py-1 text-right text-blue-800">
                                {subTotalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <div className="p-4 border border-zinc-200 shadow-inner">
                            <Without_Chart 
                                data={zonesForThisSale} 
                                salesName={salesName} 
                                totalBooth={totalBooth} 
                                totalVolume={totalVolume}
                            />
                        </div>
                    </div>
                );
                })
            ) : (
                <div className="py-10 text-center text-zinc-400 italic">
                -- No information found. --
                </div>
            )}
            </div>
        </section>
    );

}