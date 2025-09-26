import { useState, useEffect, createContext } from "react";
import AppRouteFinance from "../../../../AppRouteFinance";

import SelectExhibition from "./selectExhibition";
import PrintOptions from "./PrintOptions";
import Filter from "./Filter";
import PrintReport from "./PrintReport";

import { CgMoreO } from "react-icons/cg";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";

// สร้าง context
export const dataContext = createContext();

function CollectionReport(props) {
  const initFilter = {
    exID: "0",
    sales: "0",
    customer: "0",
    zone: "0",
    payment: "0",
    printall: true,
    wSale: false,
    wZone: false,
    sumReport: false,
    yearParse: process.env.REACT_APP_YEARPARSE,
  };
  // const [filter, setFilter] = useState(initFilter);

  const [filter, setFilter] = useState(initFilter);

  const [printDate, setPrintDate] = useState({
    date1: "",
    date2: "",
    due: false,
  });
  const [showFilter, setShowFilter] = useState(false);
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cht;

  const [reportlist, setReportlist] = useState([]);
  const [showReport, setShowReport] = useState(false); // ✅ ประกาศ state สำหรับแสดง/ซ่อน report

  



  const getReport = async (params) => {
    try {
      console.log("📤 ค่าที่ส่งออกไป:", params);

      const res = await Axios.post(
        process.env.REACT_APP_API_URI + process.env.REACT_APP_clr + "/getReport",
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
      const params = {
        customer: filter.customer || "0",
        exID: filter.exID,
        payment: filter.payment || "0",
        sales: filter.sales || "0",
        zone: filter.zone || "0",
      };
      getReport(params);
    }
  }, [filter]); // เรียกใหม่เมื่อ filter เปลี่ยน

  // แยก useEffect สำหรับเช็ค reportlist
  // แสดง report อัตโนมัติเมื่อ reportlist มีข้อมูล
  // useEffect(() => {
  //   setShowReport(reportlist.length > 0);
  // }, [reportlist]);

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
    // <dataContext.Provider
    //   value={{
    //     filterC: [filter, setFilter],
    //   }}
    // >
    <dataContext.Provider
      value={{
        //exhibitionC: [exhibition, setExhibition],
        //customerC: [customer, setCustomer],
        // dataC: [data, setData],
        filterC: [filter, setFilter], // ✅ เพิ่มตรงนี้
      }}>
      <section className="2xl:container pt-1 pb-5 px-5">
        <h1 className="text-xl font-semibold mb-2">Collection Report</h1>

        {/* Exhibition Section */}
        <SelectExhibition />

        {/* Print Options */}
        <PrintOptions />

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
          <button
            className="btn-primary px-2"
            onClick={() => setShowReport(!showReport)} // toggle
          >
            {showReport ? "Close Report" : "Print Report"}
          </button>
        </div>

        {/* PrintReport */}
        <PrintReport
          filter={filter}
          reportlist={reportlist}
          showReport={showReport} // ตารางจะถูกแสดงตาม state
          onPrint={getReport}
        />



      </section>
    </dataContext.Provider>
  );
}

export default CollectionReport;
