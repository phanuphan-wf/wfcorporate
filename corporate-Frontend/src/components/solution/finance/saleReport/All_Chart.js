import React from "react";
import { Chart } from "react-google-charts";


export default function All_Chart ({ data, zoneName,totalBooth,totalVolume }){
 
  const chartColors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00"];
  
  const totalBoothSold = data.reduce((sum, s) => sum + (Number(s.totalBooth) || 0), 0);
  const totalVolumeSold = data.reduce((sum, s) => sum + (Number(s.totalVolume) || 0), 0);

 
  const totalBoothCapacity = totalBooth; 
  const totalVolumeTarget = totalVolume; 

 
  const salesPercentage = totalVolumeTarget > 0 
    ? ((totalVolumeSold / totalVolumeTarget) * 100).toFixed(2) 
    : 0;

  const chartData = [
    ["ชื่อฝ่ายขาย", "ยอดเงิน"],
    ...data.map((s) => [s.salesName, s.totalVolume]),
  ];

  const options = {
    is3D: true,
    fontName: "Tahoma",
    chartArea: { width: "80%", height: "70%" },
    legend: { position: "none" },
    pieSliceText: "label",
  };

  return (
    <div className="bg-white p-4  border border-zinc-100">
     
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-zinc-800 font-tahoma">
          สรุปเปอร์เซ็นต์ยอดขาย
        </h2>
        <p className="text-xs text-zinc-500 italic">โซน: {zoneName}</p>
      </div>

      <div className="flex flex-col md:flex-row items-center">     
        <div className="w-full md:w-2/5">
          <Chart
            chartType="PieChart"
            width="100%"
            height="350px"
            data={chartData}
            options={options}
            loader={<div>กำลังโหลดกราฟ...</div>}
          />
        </div>

       
        <div className="w-full md:w-2/5 pl-4">
          <div className="border  overflow-hidden shadow-sm">
            <table className="w-full text-sm font-tahoma">
              <tbody className="divide-y divide-zinc-100 text-sm">
                {data.map((sale, idx) => {
                  return (
                      <tr key={idx} className="hover:bg-zinc-50">
                        <td className="px-3 py-2.5 text-zinc-600 bg-zinc-50/50 w-1/2 border-r border-zinc-200">                
                          {/* จุดสีจำลอง Legend */}
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0 inline-block" 
                            style={{ backgroundColor: chartColors[idx % chartColors.length] }}
                          >                        
                          </span>
                          <span className="truncate"> {sale.salesName}</span>
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold text-blue-600">
                           {/* คำนวณเปอร์เซ็นต์: (ยอดคนนี้ / ยอดรวมโซน) * 100 */}
                           {totalVolumeSold > 0 ? ((Number(sale.totalVolume) / totalVolumeSold) * 100).toFixed(1): 0} %
                        </td>
                      </tr>                
                  );
                })}
                <tr className="bg-blue-50/50">
                   <td className="px-3 py-2.5 text-zinc-600 bg-zinc-50/50 w-1/2 border-r border-zinc-200">Total</td>
                  <td className="px-3 py-3 text-right text-blue-800 text-lg">
                    100.0 %
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
         
        </div>
       
        <div className="w-full md:w-2/5 pl-4">
          <div className="border  overflow-hidden shadow-sm">
            <table className="w-full text-sm font-tahoma">
              <tbody className="divide-y divide-zinc-100 text-sm">

                <tr className="hover:bg-zinc-50">
                  <td className="px-3 py-2.5 text-zinc-600 bg-zinc-50/50 w-1/2 border-r border-zinc-200">ยอดบูธขายรวม</td>
                  <td className="px-3 py-2.5 text-right font-bold text-blue-600">
                    {totalBoothSold.toLocaleString()} บูธ
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50">
                   <td className="px-3 py-2.5 text-zinc-600 bg-zinc-50/50 w-1/2 border-r border-zinc-200">ยอดเงินขายรวม</td>
                  <td className="px-3 py-2.5 text-right font-bold text-emerald-600">
                    {totalVolumeSold.toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50">
                   <td className="px-3 py-2.5 text-zinc-600 bg-zinc-50/50 w-1/2 border-r border-zinc-200">ยอดรวมบูธเต็ม</td>
                  <td className="px-3 py-2.5 text-right text-zinc-800">
                    {totalBoothCapacity.toLocaleString()} บูธ
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50">
                   <td className="px-3 py-2.5 text-zinc-600 bg-zinc-50/50 w-1/2 border-r border-zinc-200">ยอดเงินขายเต็ม</td>
                  <td className="px-3 py-2.5 text-right text-zinc-800">
                    {totalVolumeTarget.toLocaleString()} บาท
                  </td>
                </tr>               

                <tr className="bg-blue-50/50">
                   <td className="px-3 py-2.5 text-zinc-600 bg-zinc-50/50 w-1/2 border-r border-zinc-200">คิดเป็นยอดขาย</td>
                  <td className="px-3 py-3 text-right text-blue-800 text-lg">
                    {salesPercentage}% <span className="text-[10px] font-normal">จากยอดเต็ม</span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2 italic text-right">* ข้อมูลคำนวณจากยอดจองปัจจุบันในโซน {zoneName}</p>
        </div>

      </div>

    </div>
  );
};
