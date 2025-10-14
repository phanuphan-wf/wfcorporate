import { useState, useEffect, createContext, useRef, useCallback, useContext} from "react";
import AppRouteFinance from "../../../../AppRouteFinance";

import SelectExhibition from "./selectExhibition";
import PrintOptions from "./PrintOptions";
import Filter from "./Filter";
import PrintReport from "./PrintReport";
import Without_Zones from "./Without_Zones";
import Without_Sales from "./Without_Sales";
import Summary_Report from "./Summary_Report";

import { CgMoreO } from "react-icons/cg";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";


import html2pdf from "html2pdf.js";
import ReportTemplate from "./ReportTemplate";

// สร้าง context
export const dataContext = createContext();

function CollectionReport(props) {
  const initFilter = {
    exID: "0",
    sales: "0",
    customer: "0",
    zone: "0",
    payment: "0", 
  };


  const [filter, setFilter] = useState(initFilter);

  const [showFilter, setShowFilter] = useState(false);
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_clr;

  const [reportlist, setReportlist] = useState([]);
  const [showReport, setShowReport] = useState(false); // ✅ ประกาศ state สำหรับแสดง/ซ่อน report


  
  // 🔖 1) ref สำหรับพื้นที่ที่จะพิมพ์
  const pdfRef = useRef(null);    

  const handlePrint = useCallback(() => {
    if (!pdfRef.current) return;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `collection-report-${filter?.exID || "all"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }, // ตารางกว้าง ใกล้เคียงตัวอย่าง
      pagebreak: { mode: ["css", "legacy"] },
    };

    html2pdf().set(opt).from(pdfRef.current).save();
    // หรือ .toPdf().get('pdf').then(pdf => window.open(pdf.output('bloburl'), '_blank'));
  }, [pdfRef, filter?.exID]);


  const getReport = async (params) => {
    try {
      console.log("📤 ค่าที่ส่งออกไป:", params);

      const res = await Axios.post(
        url + "/getReport",
        params
      );

      console.log("📥 ค่าที่ API ส่งกลับมา:", res.data);
      setReportlist(res.data);
    } catch (err) {
      console.error("❌ Error fetching report:", err);
    }
  };

  useEffect(() => {
    if (filter.exID !== "0" && filter.exID !== "") {
     
      getReport(filter);
    }
  }, [filter]); // เรียกใหม่เมื่อ filter เปลี่ยน
  

  /* Check if user is authorized to view this page must insert before return part ----*/
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
  /* Check if user is authorized to view this page must insert before return part ----*/
  return (

    <dataContext.Provider
      value={{       
        filterC: [filter, setFilter],
        reportC: [reportlist,setReportlist] // ✅ เพิ่มตรงนี้
      }}>
      <section className="2xl:container pt-1 pb-5 px-5">
        <h1 className="text-xl font-semibold mb-2">Collection Report</h1>

        {/* Exhibition Section */}
        <SelectExhibition />

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

        {/* Print Report Button */}
        <div className="flex justify-end mt-4">
          <button className="btn-primary px-2" onClick={handlePrint}>
            Print Report
          </button>
        </div>

        {/* PrintReport */}
        {/* <PrintReport
          showReport={showReport} // ตารางจะถูกแสดงตาม state
        /> */}

        {/* =================== RENDER AREA =================== */}
          <div ref={pdfRef} className="mt-4">
            {filter.sumReport ? (
              <Summary_Report />
            ) : filter.wSale ? (
              <Without_Sales />
            ) : filter.wZone ? (
              <Without_Zones />
            ) : (
              <PrintReport />
            )}
          </div>
        {/* =================================================== */}

      </section>
    </dataContext.Provider>
  );
}

export default CollectionReport;
