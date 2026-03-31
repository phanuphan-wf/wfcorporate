import React from "react";
import { Chart } from "react-google-charts";

export const SalesReportChart = ({ data, salesName }) => {
  // แปลงข้อมูลจาก Array Object เป็น Array of Arrays สำหรับ Google Charts
  const chartData = [
    ["โซน", "ยอดเงิน"],
    ...data.map((item) => [item.zoneName, item.totalVolume]),
  ];

  const options = {
    title: `สัดส่วนรายได้ตามโซน: ${salesName}`,
    is3D: true,
    pieHole: 0.4, // ทำเป็น Donut Chart ก็สวยดีนะครับ
    chartArea: { width: "100%", height: "80%" },
    legend: { position: "right", textStyle: { fontSize: 12 } },
    fontName: "Tahoma",
  };

  return (
    <Chart
      chartType="PieChart"
      width="100%"
      height="350px"
      data={chartData}
      options={options}
      loader={<div className="text-center py-10">กำลังสร้างกราฟ...</div>}
    />
  );
};