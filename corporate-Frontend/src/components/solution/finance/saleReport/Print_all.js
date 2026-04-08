import React, { useState, useEffect, useContext, useMemo } from "react";
import { dataContext } from "./salereport";
import All_Chart from "./All_Chart";


import Axios from "axios";

export default function Print_all() {

    const {filterC} = useContext(dataContext);
    const [filter] = filterC;
    //const { data } = useContext(DataContext);
    // console.log(filter);

    const isDisabled = !filter.exID || filter.exID === "";  

    //console.log(isDisabled);

    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_srp;
    const [reportList, setReportList] = useState([]);

    //console.log(reportList);

    const [saleName, setSaleName] = useState("");
    


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
        const zoneName = item.zone?.trim() || "ไม่ระบุโซน";
        const salesName = item.sales?.trim() || "ไม่ระบุชื่อขาย";

        if (!acc[zoneName]) acc[zoneName] = {};
            if (!acc[zoneName][salesName]) {
            acc[zoneName][salesName] = {
                salesName: salesName,
                customerCount: 0,
                totalBooth: 0,
                totalVolume: 0
            };
        }

        // 1. บวกค่าเข้าไปเป็นตัวเลขก่อน (Number)
        acc[zoneName][salesName].customerCount += 1;
        acc[zoneName][salesName].totalBooth += Number(item.booth || 0);
        acc[zoneName][salesName].totalVolume += Number(item.volume || 0);

        return acc;
    }, {});

 
    Object.keys(result).forEach((zone) => {
        Object.values(result[zone]).forEach((sale) => {      
        sale.totalBooth = Number(Number(sale.totalBooth).toFixed(2));
        sale.totalVolume = Number(Number(sale.totalVolume).toFixed(2));
        });
    });

    //console.log(result);

    return result;
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

        

    
    return(

       <section className="mt-3 space-y-5">
            <div className="border border-zinc-300 rounded-md p-4 bg-white mb-4">
                {Object.keys(groupedData).length > 0 ? (
                    Object.keys(groupedData).map((zoneName) => {
                        // คำนวณผลรวมเฉพาะของโซนนั้นๆ (Sub-total)
                        const salesInZone = Object.values(groupedData[zoneName]);
                        const subTotalCustomers = salesInZone.reduce((sum, s) => sum + s.customerCount, 0);
                        const subTotalBooths = salesInZone.reduce((sum, s) => sum + s.totalBooth, 0);
                        const subTotalVolume = salesInZone.reduce((sum, s) => sum + s.totalVolume, 0);

                        return (
                        <div key={zoneName} className="mb-8 last:mb-0">
                            {/* หัวข้อชื่อโซน */}
                            <div className="relative flex items-center mb-2">
                                <h3 className="flex-1 text-left font-bold text text-zinc-800">
                                    โซนแสดงสินค้า : {zoneName}
                                </h3>
                            </div>

                            <table className="w-full border-collapse border border-zinc-400 shadow-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-black">
                                    <th className="border border-zinc-400 px-2 py-1 w-16" rowSpan={2}>ลำดับ</th>
                                    <th className="border border-zinc-400 px-2 py-1 " rowSpan={2}>ชื่อฝ่ายขาย</th>
                                    <th colSpan={3} className="border border-zinc-400 px-2 py-1 text-center">ยอดขาย</th>
                                    </tr>
                                    <tr className="bg-gray-100">
                                    <th className="border border-zinc-400 px-2 py-1 text-black text-center w-28">จำนวนลูกค้า</th>
                                    <th className="border border-zinc-400 px-2 py-1 text-black text-center w-28">จำนวนบูธ</th>
                                    <th className="border border-zinc-400 px-2 py-1 text-black text-center w-1/5">ยอดเงิน</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* วนลูปรายชื่อฝ่ายขายในโซนนี้ */}
                                    {salesInZone.map((sale, index) => (
                                    <tr key={`${zoneName}-${sale.salesName}`} className="hover:bg-gray-50">
                                        <td className="border border-zinc-400 px-2 py-1 text-center">{index + 1}</td>
                                        <td className="border border-zinc-400 px-2 py-1">{sale.salesName}</td>
                                        <td className="border border-zinc-400 px-2 py-1 text-center">
                                        {sale.customerCount}
                                        </td>
                                        <td className="border border-zinc-400 px-2 py-1 text-right">
                                        {sale.totalBooth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="border border-zinc-400 px-2 py-1 text-right">
                                        {sale.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                    ))}

                                    {/* แถวสรุปยอดรวมของโซนนี้ */}
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

                            <div>
                                <All_Chart 
                                     data={salesInZone}
                                     zoneName={zoneName} 
                                     totalBooth={totalBooth}
                                     totalVolume={totalVolume}
                                />
                            </div>
                        </div>
                        );
                    })
                ) : (
                <div className="py-10 text-center text-zinc-400 italic">
                    -- No information found.--
                </div>
                )}
            </div>              

       </section>  

    );

}