import React, { useEffect, useState, useRef } from "react";

import CollectionInfo from "./collection-info";
import CollectionPayment from "./collection-pay";
import CollectionList from "./collection-list";
import Summary from "./collection-summary";
import Report from "./collection-print";
import AppRouteFinance from "../../../../AppRouteFinance";

import ReactToPrint from "react-to-print";

import { CollectionProvider } from "./collectionContext";

export default function Collection(props) {
  const PrintSummary = useRef(null);

  useEffect(() => {
    document.title = "Finance Collection Record";
  }, []);

  const [show, setShow] = useState(false);

  function showPrint() {
    setShow(!show);
  }

  const [pdata, setPdata] = useState([]);
  const [psum, setPsum] = useState({});
  const initPdate = {
    d: new Date().getDate(),
    m: new Date().getMonth() + 1,
    y: new Date().getFullYear(),
  };
  const [pdate, setPdate] = useState(initPdate);
  const [ex, setEx] = useState({});
  const [total, setTotal] = useState({});

  const listdata = (data) => {
    setPdata(data);
  };

  function newSum(sum) {
    if (sum !== undefined) {
      setPsum(sum);
    }
  }

  const newTotal = (total) => {
    setTotal(total);
  };

  function exdata(data) {
    if (data !== undefined) {
      setEx(data);
    }
  }

  const day = () => Array.from({ length: 31 }, (_, i) => i + 1);

  const month = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year = () => {
    var y = [];
    for (var i = -1; i < 2; i++) {
      y.push(new Date().getFullYear() + i);
    }
    return y;
  };

  const showPage = AppRouteFinance.find(
    (x) => x.path === "finance/collection"
  ).show;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!showPage.some((x) => x.dept === user.Dept && x.acc === user.ALevel)) {
    return (
      <section className="2xl:container">
        <h1 className="text-xl text-red-500">
          You are not authorized to view this page
        </h1>
      </section>
    );
  }

  return (
    <div className="text-sm">
      <h1 className="text-xl mb-4">Collection Record</h1>
      <CollectionProvider>
        <CollectionInfo ex={exdata} />
        <CollectionPayment />

        <CollectionList data={listdata} />
        <Summary print={showPrint} sum={newSum} total={newTotal} />
        <div className="flex flex-col gap-2 items-end w-full relative -top-[100px]">
          <div>
            <label htmlFor="print-day" className="mr-2">
              Print Date
            </label>
            <select
              className="cmb"
              id="print-day"
              onChange={(e) => setPdate({ ...pdate, d: e.target.value })}
            >
              {day().map((d, i) => {
                if (new Date().getDate() == d) {
                  return (
                    <option key={i} value={d} selected>
                      {d}
                    </option>
                  );
                } else {
                  return (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  );
                }
              })}
            </select>
            <select
              className="cmb"
              id="print-month"
              onChange={(e) => setPdate({ ...pdate, m: e.target.value })}
            >
              {month.map((m, i) => {
                if (new Date().getMonth() == i) {
                  return (
                    <option key={i} value={i + 1} selected>
                      {m}
                    </option>
                  );
                } else {
                  return (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  );
                }
              })}
            </select>
            <select
              className="cmb"
              id="print-year"
              onChange={(e) => setPdate({ ...pdate, y: e.target.value })}
            >
              {year().map((y, i) => {
                if (new Date().getFullYear() == y) {
                  return (
                    <option key={i} value={y} selected>
                      {y}
                    </option>
                  );
                } else {
                  return (
                    <option key={i} value={y}>
                      {y}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          <ReactToPrint
            trigger={() => (
              <button className="btn-primary px-4">Print Summary</button>
            )}
            content={() => PrintSummary.current}
          />
        </div>
        <div className="hidden print:block" ref={PrintSummary}>
          <Report
            exdata={ex}
            date={pdate}
            data={pdata}
            summary={psum}
            total={total}
          />
        </div>
      </CollectionProvider>
    </div>
  );
}
