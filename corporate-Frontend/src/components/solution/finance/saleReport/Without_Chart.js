import React from "react";
import { Chart } from "react-google-charts";

export default function Without_Chart({ data,totalBooth, totalVolume }) {
  
  // ✅ เตรียมข้อมูลกราฟ (แยกตาม Zone ของ Sale คนนั้นๆ)
  const chartData = [
    ["zoneName", "totalVolume"],
    ...data.map((item) => [
      item.zoneName,item.totalVolume,
    ]),
  ];

  const options = {
    is3D: true,
    fontName: "Tahoma",
    chartArea: {
      width: "100%", 
      height: "100%",
      top: 1,
    },
    legend: {
      position: "labeled",
      textStyle: {
        fontSize: 14,
        bold: true,
      },
    },
    pieSliceText: "percentage", 
    pieSliceTextStyle: {
      fontSize: 12,
    },
    sliceVisibilityThreshold: 0,
  };

  return (
    // ✅ เพิ่ม mb-8 และ print:break-inside-avoid เพื่อให้แต่ละคนเรียงต่อกันสวยงาม
    <div className="bg-white p-4 border border-zinc-200 shadow-sm font-tahoma">       
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-zinc-800">
          สรุปเปอร์เซ็นต์ยอดขาย
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4"> 
        {/* ฝั่งซ้าย: กราฟ (55%) */}
        <div className="w-full md:w-[50%]">
          <Chart
            chartType="PieChart"
            data={chartData}
            options={options}          
            loader={<div>กำลังโหลดกราฟ...</div>}      
          />
        </div>

     
        <div className="w-full md:w-[50%] pl-2">
          <div className="border border-zinc-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm font-tahoma">
              <tbody className="divide-y divide-zinc-100 text-sm">

                <tr className="hover:bg-zinc-50">
                  <td className="px-3 py-2.5 text-zinc-600 bg-zinc-50/50 w-1/2 border-r border-zinc-200 text-xs">ยอดบูธขายรวม</td>
                     <td className="px-3 py-2.5 text-right font-bold text-blue-600 bg-white">
                    {totalBooth.toLocaleString()} บูธ
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50">
                   <td className="px-3 py-2.5 text-zinc-600 bg-zinc-50/50 w-1/2 border-r border-zinc-200 text-xs">ยอดเงินขายรวม</td>
                  <td className="px-3 py-2.5 text-right font-bold text-emerald-600 bg-white">
                     {totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท
                  </td>
                </tr>      

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}