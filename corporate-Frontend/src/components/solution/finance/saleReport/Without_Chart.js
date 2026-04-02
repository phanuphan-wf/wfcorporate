import React from "react";
import { Chart } from "react-google-charts";

export default function Without_Chart({ data, salesName, totalBooth, totalVolume }) {
  // 1. สีสำหรับกราฟ
  const chartColors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00"];

  // 2. คำนวณยอดที่ Sales คนนี้ขายได้จริง (จากทุกโซนที่ส่งมาใน data)
  const totalVolumeSoldBySales = data.reduce((sum, s) => sum + (Number(s.totalVolume) || 0), 0);
  

  // 3. เป้าหมายรวมของงาน
  const totalBoothCapacity = totalBooth; 
  const totalVolumeTarget = totalVolume; 

  // คำนวณ % ความสำเร็จของ Sales คนนี้เทียบกับเป้างาน
  // const salesPercentage = totalVolumeTarget > 0 
  //   ? ((totalVolumeSoldBySales / totalVolumeTarget) * 100).toFixed(2) 
  //   : 0;

  const chartData = [
    ["โซน", "ยอดเงิน"],
    ...data.map((item) => [item.zoneName, item.totalVolume]),
  ];

  const options = {
    is3D: true,
    fontName: "Tahoma",
    chartArea: { width: "80%", height: "70%" },
    legend: { position: "none" },
    pieSliceText: "label",
  };

  return (
    <div className="bg-white p-4 border border-zinc-200 shadow-sm font-tahoma">
      
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-zinc-800">
          สรุปเปอร์เซ็นต์ยอดขาย
        </h2>        

         <p className="text-xs text-zinc-500 italic">{salesName}</p>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-2"> 
        {/* ฝั่งซ้าย: กราฟ (40%) */}
        <div className="w-full md:w-[35%]">
          <Chart
            chartType="PieChart"
            width="100%"
            height="350px"
            data={chartData}
            options={options}
            loader={<div className="text-center py-20 text-zinc-400">กำลังประมวลผลกราฟ...</div>}
          />
        </div>

        {/* ฝั่งขวา: ตารางที่ 1 - สัดส่วนรายโซน (30%) */}
        <div className="w-full md:w-[30%] pl-2">
          <div className="border border-zinc-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm font-tahoma">
              <tbody className="divide-y divide-zinc-100 text-sm">
                {data.map((item, idx) => {
                  // คำนวณ % ว่าโซนนี้คิดเป็นกี่ % ของยอดขาย Sales คนนี้
                  const zonePercent = totalVolumeSoldBySales > 0 
                    ? ((item.totalVolume / totalVolumeSoldBySales) * 100).toFixed(1) 
                    : 0;
                  
                  return (
                    <tr key={idx} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-3 py-2.5 text-zinc-600 bg-zinc-50/50 w-1/2 border-r border-zinc-200">             
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0 inline-block mr-2" 
                            style={{ backgroundColor: chartColors[idx % chartColors.length] }}
                          ></span>
                          <span className="truncate">{item.zoneName}</span>
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold text-blue-600 bg-white">                          
                           {zonePercent} %
                        </td>
                    </tr>
                  );
                })}

                <tr className="bg-blue-50/50">
                  <td className="px-3 py-2.5 text-zinc-800 bg-zinc-100/50 w-1/2 border-r border-zinc-200">Total</td>
                  <td className="px-3 py-3 text-right text-blue-800">
                    100.0 %
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ฝั่งขวา: ตารางที่ 2 - สรุปยอดเป้าหมาย (30%) */}
        <div className="w-full md:w-[30%] pl-2">
          <div className="border border-zinc-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm font-tahoma">
              <tbody className="divide-y divide-zinc-100 text-sm">

                <tr className="hover:bg-zinc-50">
                  <td className="px-3 py-2.5 text-zinc-600 bg-zinc-50/50 w-1/2 border-r border-zinc-200 text-xs">ยอดบูธขายรวม</td>
                  <td className="px-3 py-2.5 text-right font-bold text-blue-600 bg-white">
                      {totalBoothCapacity.toLocaleString()} บูธ
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50">
                   <td className="px-3 py-2.5 text-zinc-600 bg-zinc-50/50 w-1/2 border-r border-zinc-200 text-xs">ยอดเงินขายรวม</td>
                  <td className="px-3 py-2.5 text-right font-bold text-emerald-600 bg-white">
                     {totalVolumeTarget.toLocaleString()}
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