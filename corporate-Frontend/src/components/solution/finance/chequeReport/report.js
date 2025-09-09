import React, { useState, useEffect, createContext, useRef } from "react";
import AppRouteFinance from "../../../../AppRouteFinance";
import ReportDateSelect from "./reportDateSelect";
import ReportFilter from "./reportFilter";
import Reportlist from "./reportlist";
import Axios from "axios";

export const dataContext = createContext();

export default function Report() {
  const initDate = {
    d1: new Date().getDate(),
    m1: new Date().getMonth() + 1,
    y1: new Date().getFullYear(),
    d2: new Date().getDate(),
    m2: new Date().getMonth() + 1,
    y2: new Date().getFullYear(),
  };
  const [date, setDate] = useState(initDate);
  const initFilter = {
    date1: date.y1 + "-" + date.m1 + "-" + date.d1,
    date2: date.y2 + "-" + date.m2 + "-" + date.d2,
    range: false,
    exID: "0",
    sales: "0",
    customer: 0,
    bank: "0",
    account: "0",
    yearParse: process.env.REACT_APP_YEARPARSE,
  };
  const [filter, setFilter] = useState(initFilter);
  const [printDate, setPrintDate] = useState({
    date1: "",
    date2: "",
    due: false,
  });

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cr;

  const [reportlist, setReportlist] = useState([]);

  const getReport = async () => {
    const res = await Axios.post(url + "/getReport", filter);
    setReportlist(res.data);
  };
  useEffect(() => {
    //console.log(filter);
  }, [filter]);

  /* Check if user is authorized to view this page must insert before return part ----*/
  const show = AppRouteFinance.find(
    (x) => x.path === "finance/chequereport"
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
    <section className="2xl:container">
      <h1 className="text-xl">Cheque Report</h1>
      <dataContext.Provider
        value={{
          filterC: [filter, setFilter],
          reportC: [reportlist, setReportlist],
          printDateC: [printDate, setPrintDate],
        }}
      >
        <ReportDateSelect />
        <ReportFilter />
        <div className="flex justify-end mt-5 max-w-4xl">
          <button className="btn-green px-2" onClick={getReport}>
            Generate Report
          </button>
        </div>
        {reportlist.length > 0 && <Reportlist />}
      </dataContext.Provider>
    </section>
  );
}
