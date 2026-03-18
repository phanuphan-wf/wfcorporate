import { useState, useEffect, createContext, useRef, useCallback, useContext, useMemo} from "react";
import AppRouteFinance from "../../../../AppRouteFinance";

import SelectExhibition from "./selectExhibition";
import PrintOptions from "./PrintOptions";
import Filter from "./Filter";
import Print_all from "./Print_all";
import Without_Zones from "./Without_Zones";
import Without_Sales from "./Without_Sales";
import Summary_Report from "./Summary_Report";
import PrintButton from "./PrintButton"; 

import { CgMoreO } from "react-icons/cg";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";

import html2pdf from "html2pdf.js";
import Print_PDF from "./Print_PDF"; // ✅ เพิ่มบรรทัดนี้



// สร้าง context
export const dataContext = createContext();

function CollectionReport(props) {
  const initFilter = {
    exID: "0",
    sales: "0",
    customer: "0",
    customername: "0",
    zone: "0",
    payment: "0", 
  };


  const [filter, setFilter] = useState(initFilter);
  const [showFilter, setShowFilter] = useState(false);  
  const [reportlist, setReportlist] = useState([]);
  // const [showReport, setShowReport] = useState(false); // ✅ ประกาศ state สำหรับแสดง/ซ่อน report
  const [event, setEvent] = useState({}); 
  const [selectedEvent, setSelectedEvent] = useState(null);


  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_clr;
  const pdfRef = useRef(null);

  // ================== 📥 โหลดข้อมูลรายงาน ==================
  const getReport = async (params) => {
    try {
      //console.log("📤 ค่าที่ส่งออกไป:", params);
      const res = await Axios.post(url + "/getReport",params);
    //  console.log("📥 ค่าที่ API ส่งกลับมา:", res.data);
      setReportlist(res.data);
    } catch (err) {
      //console.error("❌ Error fetching report:", err);
    }
  };
  // ================== 🧭 โหลดข้อมูลเมื่อเลือก Exhibition ==================
  useEffect(() => {
    if (filter.exID !== "0" && filter.exID !== "") {     
      // console.log("📦 ค่าที่จะส่งไป getReport:", filter);
      getReport(filter);
    }
    
  }, [filter.exID]);

  // ================== 🧮 กรองข้อมูลในฝั่ง React ==================
  const filteredReport = useMemo(() => {
    return reportlist.filter((item) => {
      // กรองตาม Sales
      if (filter.sales !== "0" && item.sales?.trim() !== filter.sales.trim()) return false;

      // กรองตาม Zone
      if (filter.zone !== "0" && item.zone?.trim() !== filter.zone.trim()) return false;

      // กรองตามชื่อลูกค้า (search)
      if (filter.customer && !item.name?.includes(filter.customer)) return false;

      // กรองตามสถานะชำระเงิน (ตัวอย่าง)
      if (filter.payment === "1" && item.amount <= 0) return false; // ชำระแล้ว
      if (filter.payment === "2" && item.amount > 0) return false;  // ค้างชำระ

      return true;
    });
  }, [reportlist, filter]);
 



   // ================== 🔐 ตรวจสิทธิ์ผู้ใช้งาน ==================
    const show = AppRouteFinance.find(
      (x) => x.path === "finance/receivingreport"
    ).show;

    const user = JSON.parse(localStorage.getItem("user"));

    if (!show.some((x) => x.dept === user.Dept && x.acc === user.ALevel)) {
      return (
        <section className="2xl:container">
          <h1 className="text-xl text-red-500">
            You are not authorized to view this page
          </h1>
        </section>
      );
    }   
  


  // ================== 🧾 ส่วนแสดงผล ==================
  return (

      <dataContext.Provider
          value={{
            filterC: [filter, setFilter],
            reportC: [reportlist, setReportlist],
            eventC: [event, setEvent], // ✅ เพิ่มตรงนี้ไว้แล้ว
          }}
      >

      <section className="2xl:container pt-1 pb-5 px-5">

        
        <h1 className="text-xl font-semibold mb-2">Collection Report</h1>

        {/* Exhibition Section */}
        <SelectExhibition onSelect={(data) => setSelectedEvent(data)} />


        {/* Print Options */}
        <PrintOptions/>

        {/* Filter Button */}
        <button
          className={`rounded-md py-0.5 text-white mt-4 ${
            !showFilter ? "bg-green-600 px-2" : "bg-red-500 px-3"
          } flex items-center gap-2`}
          onClick={() => setShowFilter(!showFilter)}>
          {!showFilter ? (
            <>
              <CgMoreO />
              <span>Filter</span>
            </>
          ) : (
            <span>Close panel</span>
          )}
        </button>

        {/* Filter Section */}
        {showFilter && <Filter />}        


        {/* ✅ ปุ่มกดเพื่อพิมพ์เฉพาะส่วน */}
        <Print_PDF pdfRef={pdfRef} />
     

        {/* =================== RENDER AREA =================== */}
         
        <div ref={pdfRef} className="mt-4">

          {/* ✅ เงื่อนไข:
              ถ้ายังไม่มี order และยังไม่ได้ติ๊กอะไร → แสดง Print_all default
              แต่ถ้าผู้ใช้เริ่มติ๊กแล้ว (แม้ติ๊กออกหมด) → ไม่ต้องแสดง default */}
          {(!filter.order || filter.order.length === 0) &&
            !filter.userInteracted && (
              <Print_all key="default" event={selectedEvent} />
          )}

          {/* ✅ ถ้ามี order → แสดงตามลำดับที่ติ๊ก */}
          {filter.order?.map((key) => {
            switch (key) {
              case "printall":
                return filter.printall ? (
                  <Print_all key={key} event={selectedEvent} />
                ) : null;

              case "sumReport":
                return filter.sumReport ? (
                  <Summary_Report key={key} event={selectedEvent} />
                ) : null;

              case "wSale":
                return filter.wSale ? (
                  <Without_Sales key={key} event={selectedEvent} />
                ) : null;

              case "wZone":
                return filter.wZone ? (
                  <Without_Zones key={key} event={selectedEvent} />
                ) : null;

              default:
                return null;
            }
          })}
        </div>

        {/* =================================================== */}

      </section>
    </dataContext.Provider>
  );
}

export default CollectionReport;
