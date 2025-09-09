import React, { createContext, useEffect, useState } from "react";
import Axios from "axios";
import useHeader from "../../hook/useHeader";

import BR1 from "./buyerReportPage/br-1";
import BRD2 from "./buyerReportPage/br-d2";
import BRD3 from "./buyerReportPage/br-d3";
import BRB1 from "./buyerReportPage/br-b1";
import BRB2 from "./buyerReportPage/br-b2";
import BRB3 from "./buyerReportPage/br-b3";
import BRM1 from "./buyerReportPage/br-m1";
import BRM2 from "./buyerReportPage/br-m2";
import BRM3 from "./buyerReportPage/br-m3";
import BRHM from "./buyerReportPage/br-hm";

export const DataContext = createContext(null);

export default function BuyerReport(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_byr;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [exData, setExData] = useState([]);

  const getEx = async () => {
    const res = await Axios.get(url + "/GetExName").then((res) =>
      setExData(res.data)
    );
  };

  useEffect(() => {
    getEx();
  }, []);

  const [selectEx, setSelectEx] = useState("0");
  const [initData, setInitData] = useState([]);
  const [data, setData] = useState([]);
  const [customer, setCustomer] = useState([]);

  const [loading, setLoading] = useState(false);

  const getDat = async () => {
    const res = await Axios.get(url + "/GetDat/" + selectEx).then((res) => {
      setInitData(res.data);
      setData(res.data);
    });
  };

  useEffect(() => {
    setLoading(true);
    if (selectEx != "0") {
      getDat();
    }
  }, [selectEx]);

  useEffect(() => {
    if (data.length == 0 && loading) {
      alert("No data for selected exhibition");
    }
    setLoading(false);
    //console.log(data);
  }, [data]);

  useEffect(() => {
    getCustomer();
    setPage(initPages);
  }, [initData]);

  const getCustomer = () => {
    //find unique value
    let ic = [];
    data.map((d, i) => {
      if (d.customerName != undefined) {
        ic.push(d.customerName);
      }
    });
    let uniqueCat = [...new Set(ic)];
    uniqueCat.sort();
    setCustomer(uniqueCat);
  };

  useEffect(() => {
    //console.log(customer);
  }, [customer]);

  const cusfilterChange = (cus) => {
    if (cus != "0") {
      const cusfilter = initData.filter((d) => d.customerName == cus);
      setData(cusfilter);
    } else {
      setData(initData);
    }
  };

  const dept = JSON.parse(localStorage.getItem("user")).Dept;
  const acc = JSON.parse(localStorage.getItem("user")).ALevel;

  const initPages = [
    { page: "Demographic 1", active: true, data: <BR1 />, show: "all" },
    { page: "Demographic 2", active: false, data: <BRD2 />, show: "all" },
    { page: "Demographic 3", active: false, data: <BRD3 />, show: "all" },
    { page: "Behavior 1", active: false, data: <BRB1 />, show: "all" },
    { page: "Behavior 2", active: false, data: <BRB2 />, show: "all" },
    {
      page: "Behavior 3",
      active: false,
      data: <BRB3 />,
      show: [
        { dept: 1, acc: 1 },
        { dept: 2, acc: 1 },
      ],
    },
    {
      page: "Media 1",
      active: false,
      data: <BRM1 />,
      show: [{ dept: 1, acc: 1 }],
    },
    {
      page: "Media 2",
      active: false,
      data: <BRM2 />,
      show: [{ dept: 1, acc: 1 }],
    },
    {
      page: "Media 3",
      active: false,
      data: <BRM3 />,
      show: [
        { dept: 1, acc: 1 },
        { dept: 2, acc: 1 },
        { dept: 2, acc: 2 },
      ],
    },
    {
      page: "Heat Map",
      active: false,
      data: <BRHM />,
      show: [
        { dept: 1, acc: 1 },
        { dept: 2, acc: 1 },
      ],
    },
  ];

  const [pages, setPage] = useState(initPages);

  const pageChange = (ix) => {
    const pg = pages.map((p, i) => {
      if (i == ix) {
        p.active = true;
      } else {
        p.active = false;
      }
      return p;
    });
    setPage(pg);
  };

  return (
    <section className="buyer-report">
      <h1 className="text-xl">Buyer Report</h1>
      <div className="mb-5">
        <label htmlFor="exname" className="mr-2">
          Select Exhibition Name:
        </label>
        <select
          id="exname"
          className="cmb"
          defaultValue={"0"}
          onChange={(e) => setSelectEx(e.target.value)}
        >
          <option disabled value="0">
            select exhibition
          </option>
          {exData.map((d, i) => (
            <option value={d.id} key={i}>
              {d.name + " (" + d.id + ")"}
            </option>
          ))}
        </select>
      </div>

      <DataContext.Provider value={{ data, loading, selectEx, initData }}>
        {loading ? (
          <span>Please wait while loading data...</span>
        ) : data.length > 0 ? (
          <div>
            <div className="flex w-full justify-end mb-2">
              <label htmlFor="customer" className="mr-2">
                Customer filter:
              </label>
              <select
                className="cmb disabled:bg-slate-100"
                id="customer"
                onChange={(e) => cusfilterChange(e.target.value)}
                disabled={(dept == 1 || dept == 2) && acc == 1 ? false : true}
              >
                <option value={"0"}>all</option>
                {customer.map((c, i) => (
                  <option value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap">
              {pages.map((p, i) => {
                if (p.show == "all") {
                  return (
                    <div
                      key={"page" + i}
                      className={`${
                        p.active ? "bg-slate-600" : "bg-slate-400"
                      } rounded-t-md border text-white px-5 w-fit py-1 cursor-pointer`}
                      onClick={() => pageChange(i)}
                    >
                      {p.page}
                    </div>
                  );
                } else {
                  let show = p.show.find((s) => s.dept == dept && s.acc == acc);
                  return (
                    show && (
                      <div
                        key={"page" + i}
                        className={`${
                          p.active ? "bg-slate-600" : "bg-slate-400"
                        } rounded-t-md border text-white px-5 w-fit py-1 cursor-pointer`}
                        onClick={() => pageChange(i)}
                      >
                        {p.page}
                      </div>
                    )
                  );
                }
              })}
            </div>
            <div className="border rounded-md p-4 shadow-inner rounded-tl-none mb-4">
              {pages.map((p, i) => (p.active ? p.data : ""))}
            </div>
          </div>
        ) : (
          ""
        )}
      </DataContext.Provider>
    </section>
  );
}
