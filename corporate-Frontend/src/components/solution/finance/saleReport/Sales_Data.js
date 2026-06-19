import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { dataContext } from "./salereport";

import { useLocation } from "react-router-dom";

// import Sale_Page from "./saleReportPage/salepage";
// import Customer_Page from "./saleReportPage/customerpage";

import { IoChevronBackOutline } from "react-icons/io5";
import Sale_Chart from "./Sale_Chart";


export default function Sales_Data() {
  const { filterC, eventC, salesC } = useContext(dataContext);
  const [filter] = filterC;
  const [sales] = salesC;

  //console.log(sales);


  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_srp;
  const bearer = useHeader();

  // จัดการ Axios Header
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [reportList, setReportList] = useState([]);

  const getReport = async () => {
    const payload = {
      exID: filter.exID,
      saleID: sales.salesID,
      zone: "0"
    };
    //console.log(payload);

    try {
      const res = await Axios.post(url + "/getReport/", payload);
      if (res.status === 200) {
        setReportList(res.data);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  useEffect(() => {
    getReport();
  }, [sales]);

  // useEffect(() =>{
  //   console.log(reportList);
  // },[reportList]);

  const groupZone = useMemo(() => {
    if (reportList.length === 0) {
      return [];
    }

    const map = reportList.reduce((acc, item) => {
      // 1. ตรวจสอบชื่อโซน ถ้าไม่มีให้ยัดเข้ากลุ่ม "ไม่ระบุโซน" ป้องกันค่าว่างพังระบบ
      const zone = item.zone?.trim() || "ไม่ระบุโซน";
      const customerName = item.customer?.trim() || "ไม่ระบุชื่อร้าน";
      const boothValue = Number(item.booth || 0);
      const volumeValue = Number(item.volume || 0);

      // 2. สร้างโครงสร้างหลักของโซนนั้นๆ ไว้ล่วงหน้าถ้ายังไม่มี
      if (!acc[zone]) {
        acc[zone] = {
          zone: zone,
          customerMap: {}, // ตรวจสอบให้มั่นใจว่าสร้าง customerMap รอไว้แล้ว
          boothCount: 0,
          totalAmount: 0
        };
      }

      // รวมยอดรวมสะสมของโซน
      acc[zone].boothCount += boothValue;
      acc[zone].totalAmount += volumeValue;

      // 3. จัดกลุ่มร้านค้าภายในโซน (เช็คซ้ำอีกชั้นเพื่อความปลอดภัยสูงสุด)
      if (acc[zone] && acc[zone].customerMap) {
        if (!acc[zone].customerMap[customerName]) {
          acc[zone].customerMap[customerName] = {
            customer: customerName,
            booth: 0,
            volume: 0
          };
        }

        // บวกยอดสะสมของร้านค้านั้นๆ
        acc[zone].customerMap[customerName].booth += boothValue;
        acc[zone].customerMap[customerName].volume += volumeValue;
      }

      return acc;
    }, {});

    // แปลง Object Map ให้กลายเป็น Array เพื่อพร้อมนำไปใช้บน UI
    return Object.values(map).map(({ customerMap, ...rest }) => {
      const customersArray = Object.values(customerMap);
      return {
        ...rest,
        customerCount: customersArray.length,
        customers: customersArray
      };
    });

  }, [reportList]);

  // useEffect(() => {
  //   console.log(groupZone);
  // }, [groupZone]);

  return (
    <section className="Sale-report">
      {/* วนลูปสร้างกลุ่มข้อมูลแยกตามโซน (1 โซน = 1 บล็อกตาราง) */}
      {groupZone.map((zoneItem, zoneIndex) => (
        <div
          key={"zone-block-" + zoneItem.zone}
          className="mt-5 p-4 bg-white border border-gray-200 rounded-md shadow-sm"
        >

          <div className="pdf-table-header" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', width: '100%', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px', marginBottom: '12px' }}>
      
            <h3 style={{ width: '25%', textAlign: 'left', fontWeight: 'bold'}}>
              ชื่อฝ่ายขาย : {sales.salesName}
            </h3>
            
        
            <h3 style={{ width: '50%', textAlign: 'center', fontWeight: 'bold'}}>
              โซนแสดงสินค้า : {zoneItem.zone}
            </h3>

           
            <h3 style={{ width: '25%', textAlign: 'right', fontWeight: 'bold'}}>
              หน้า : {zoneIndex + 1}
            </h3>
          </div>


          <table className="w-full border-collapse border border-zinc-400 shadow-sm mb-2">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="border border-zinc-400 px-2 py-1 w-16" rowSpan={2}>ลำดับ</th>
                <th className="border border-zinc-400 px-2 py-1" rowSpan={2}>ชื่อร้านลูกค้า</th>
                <th colSpan={2} className="border border-zinc-400 px-2 py-1 text-center">ยอดขาย</th>
              </tr>
              <tr className="bg-gray-100">
                <th className="border border-zinc-400 px-2 py-1 text-black text-center w-32">จำนวนบูธ</th>
                <th className="border border-zinc-400 px-2 py-1 text-black text-center w-1/5">ยอดเงิน</th>
              </tr>
            </thead>

            <tbody>
              {/* วนลูปดึงรายชื่อลูกค้าย่อยที่อยู่ในโซนปัจจุบันนี้เท่านั้น */}
              {zoneItem.customers.map((cust, custIndex) => (
                <tr key={"cust-" + custIndex} className="hover:bg-zinc-50 text-sm">
                  <td className="border border-zinc-400 px-2 py-1 text-center">
                    {custIndex + 1}
                  </td>
                  <td className="border border-zinc-400 px-2 py-1">
                    {cust.customer}
                  </td>
                  <td className="border border-zinc-400 px-2 py-1 text-center">
                    {cust.booth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="border border-zinc-400 px-2 py-1 text-right">
                    {cust.volume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-blue-50 font-semibold">
                <td colSpan={2} className="border border-zinc-400 px-2 py-1 text-center text-blue-800">
                  ยอดรวมทั้งสิ้น
                </td>
                <td className="border border-zinc-400 px-2 py-1 text-center text-blue-800">
                  {zoneItem.boothCount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บูธ
                </td>
                <td className="border border-zinc-400 px-2 py-1 text-right text-blue-800">
                  {zoneItem.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ))}

      {groupZone.length === 0 && (
        <div className="mt-5 p-8 bg-white border border-gray-200 rounded-md text-center text-gray-400 shadow-sm">
          No sales data available.
        </div>
      )}

      {/* เพิ่มคลาส chart-page-block และ no-break เอาไว้ดักจับตอนพิมพ์ */}
      <div className="mt-5 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
        <Sale_Chart
          data={groupZone}
          boothCount={groupZone.reduce((sum, z) => sum + z.boothCount, 0)}
          totalAmount={groupZone.reduce((sum, z) => sum + z.totalAmount, 0)}
        />
      </div>



    </section>
  );
}