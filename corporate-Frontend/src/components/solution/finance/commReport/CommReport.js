import React, { useEffect, useState } from "react";
import Axios from "axios";
import { CSVLink } from "react-csv";

import AppRouteFinance from "../../../../AppRouteFinance";

import ModalComm from "./modalComm";

import { CgMoreO } from "react-icons/cg";

export default function CommReport(props) {
  const tmonth = [
    "January",
    "February",
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

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_crp;

  function selectYear() {
    var year = [];
    for (let i = -1; i < 2; i++) {
      year.push(new Date().getFullYear() + i);
    }

    return year;
  }

  const [duringBox, setDuring] = useState(true);

  function chbToChange() {
    setDuring(!duringBox);
  }

  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  async function getData() {
    setLoad(true);
    let m1 = document.getElementById("com-month").value;
    let m2 = document.getElementById("com-month2").value;
    let y1 = document.getElementById("com-year").value;
    let y2 = document.getElementById("com-year2").value;

    if (duringBox) {
      m2 = m1;
      y2 = y1;

      if (m2 === "1") {
        m1 = 12;
        y1 = y1 - 1;
      } else {
        m1 = m1 - 1;
      }
    } else {
      m2 = Number(m2);
      y2 = Number(y2);

      if (y2 == y1) {
        if (m2 < m1 || m2 == m1) {
          alert("End date must greater than start date");
          return;
        }
      } else if (y2 < y1) {
        alert("End date must greater than start date");
        return;
      }
    }
    /* ------- if run on localhost must +543 but when put to azure server remove +543 in y1 and y2 -------- */
    let dd =
      Number(y1) +
      Number(process.env.REACT_APP_YEARPARSE) +
      "-" +
      m1 +
      "-21/" +
      (Number(y2) + Number(process.env.REACT_APP_YEARPARSE)) +
      "-" +
      m2 +
      "-21";

    try {
      const res = await Axios.get(
        url +
          "/GetCommReport/" +
          dd +
          "/" +
          filter.exID +
          "/" +
          filter.sales +
          "/" +
          filter.acc
      );

      let dat = res.data;
      //dat.map((a) => {
      //    a.newcomm = 6;
      //})

      //console.log(dat);
      setData(dat);
    } catch (err) {
      alert("Warning! cannot load report data");
    }
  }

  useEffect(() => {
    if (data.length > 0) {
      let arr = data;

      arr.map((a) => {
        if (a.paytypeID === 1 || a.paytypeID === 2) {
          a.clearing = a.chqduedate;
        } else if (
          a.paytypeID === 4 ||
          a.paytypeID === 5 ||
          a.paytypeID === 10 ||
          a.paytypeID === 11
        ) {
          a.clearing = a.trdate;
        } else {
          a.clearing = a.billdate;
        }

        a.clearing = a.clearing.substring(0, a.clearing.indexOf("T"));
        let yc = a.clearing.substring(0, a.clearing.indexOf("-"));
        let mc = a.clearing.substring(
          a.clearing.indexOf("-") + 1,
          a.clearing.indexOf("-", a.clearing.indexOf("-") + 1)
        );
        let dc = a.clearing.substring(
          a.clearing.indexOf("-", a.clearing.indexOf("-") + 1) + 1
        );

        a.clearing = dc + "/" + mc + "/" + (Number(yc) + 543);

        if (a.account === "C") {
          /* กรณ๊มีหัก หัก 3%
          a.bft = (((a.amount * 3) / 104 + a.amount) * 100) / 107;
          */
          a.bft = (a.amount * 100) / 107;
        } else if (a.account === "T") {
          a.bft = (a.amount * 100) / 107;
        } else {
          a.bft = a.amount;
        }
        a.bft = Math.round(a.bft * 100) / 100;
      });

      arr.map((a) => {
        if (a.newcus === true) {
          a.comm = a.bft * (a.newcomm / 100);
        } else {
          if (a.paytypeID === 9) {
            a.comm = a.bft * (1.25 / 100);
          } else {
            a.comm = a.bft * (a.salecomm / 100);
          }
        }
        a.comm = Math.round(a.comm * 100) / 100;
      });

      setReport(arr);

      setLoad(false);

      setTrigger(!trigger);
    }
  }, [data]);

  const [report, setReport] = useState([]);

  const initSum = { Amount: 0, Comm: 0 };
  const [sum, setSum] = useState(initSum);

  useEffect(() => {
    let amount = 0;
    amount = report.map((r) => r.amount).reduce((prev, curr) => prev + curr, 0);
    let comm = 0;
    comm = report.map((r) => r.comm).reduce((prev, curr) => prev + curr, 0);

    setSum({ Amount: amount, Comm: comm });
  }, [report]);

  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (!filterOpen) {
      setFilter(initFilter);
    }
  }, [filterOpen]);

  const initFilter = { exID: "0", sales: "0", acc: "0" };

  const [filter, setFilter] = useState(initFilter);

  const [exhibition, setExhibition] = useState([]);

  const [pastEx, setPastEx] = useState(false);

  async function getExhibition() {
    try {
      const res = await Axios.get(url + "/GetEx/" + pastEx);
      setExhibition(res.data);
    } catch {
      alert("Cannot load exhibition data for filter");
    }
  }

  useEffect(() => {
    getExhibition();
    getSales();
  }, []);

  useEffect(() => {
    getExhibition();
  }, [pastEx]);

  const [sales, setSales] = useState([]);

  async function getSales() {
    try {
      const res = await Axios.get(url + "/GetSale");
      setSales(res.data);
    } catch {
      alert("Cannot load sales data for filter");
    }
  }

  const [modalIsOpen, setIsOpen] = useState(false);

  const [rowData, setRowData] = useState({});

  function rowClick(c) {
    let arr = report;
    arr = arr.filter((a) => a.collectID === c);
    setRowData(arr);
    setIsOpen(true);
  }

  async function confirmClick(values) {
    let rpt = report;
    let obj = rpt.find((r) => r.collectID === rowData[0].collectID);

    if (values.account !== obj.account) {
      try {
        const res = await Axios.put(
          url + "/accCorrect/" + values.account + "/" + obj.collectID
        );
        obj.account = values.account;
        if (values.account === "C") {
          obj.bft = (((obj.amount * 3) / 104 + obj.amount) * 100) / 107;
        } else if (values.account === "T") {
          obj.bft = (obj.amount * 100) / 107;
        } else {
          obj.bft = obj.amount;
        }
        obj.bft = Math.round(obj.bft * 100) / 100;
      } catch (err) {
        alert("Correct Account Type not success, please try again");
      }
    }

    if (values.newcomm !== obj.newcomm) {
      obj.newcomm = values.newcomm;
    }

    if (values.salecomm !== obj.salecomm) {
      obj.salecomm = values.salecomm;
    }

    if (obj.newcus === true) {
      obj.comm = obj.bft * (obj.newcomm / 100);
    } else {
      if (obj.paytypeID === 9) {
        obj.comm = obj.bft * (1.25 / 100);
      } else {
        obj.comm = obj.bft * (obj.salecomm / 100);
      }
    }

    obj.comm = Math.round(obj.comm * 100) / 100;

    setReport(rpt);
    setIsOpen(false);
    setTrigger(!trigger);
  }

  const [dataCSV, setDataCSV] = useState([]);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    let arr = report;
    let csv = [];

    arr.map((a) => {
      csv.push({
        ชื่อลูกค้า: a.name,
        งาน: a.exID,
        เข้าบัญชีวันที่: a.clearing,
        จำนวนเงิน: a.bft,
        เปอร์เซ็นต์:
          a.paytypeID === 9
            ? 1.25
            : a.newcus === false
            ? a.salecomm
            : a.newcomm,
        Commission: a.comm,
        ฝ่ายขาย: a.sales,
        บัญชี:
          a.account === "C"
            ? "บริษัท"
            : a.account === "T"
            ? "บจก ไม่หัก TAX"
            : a.account === "P"
            ? "ส่วนตัว"
            : "รอพิจารณา",
      });
    });

    setDataCSV(csv);
  }, [trigger]);

  /* Check if user is authorized to view this page must insert before return part*/
  const show = AppRouteFinance.find(
    (x) => x.path === "finance/commissionreport"
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

  return (
    <section id="commreport" className="2xl:w-4/5">
      <h3 className="text-xl">Commission Report</h3>

      <div>
        <div className="flex items-center gap-2">
          <label className="mr-5">Report Duration</label>
          <div>
            <select className="cmb" id="com-month">
              {tmonth.map((m, i) => {
                if (i !== new Date().getMonth()) {
                  return <option value={i + 1}>{m}</option>;
                } else {
                  return (
                    <option value={i + 1} selected>
                      {m}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          <div xs={2}>
            <select className="cmb" id="com-year">
              {selectYear().map((y) => {
                if (y !== new Date().getFullYear()) {
                  return <option value={y}>{y}</option>;
                } else {
                  return (
                    <option value={y} selected>
                      {y}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          <div xs={1} className={"pt-1"}>
            <input
              type="checkbox"
              id="chb-to"
              onChange={chbToChange}
              className="accent-red-500 size-4 mr-2"
            />
            <lable for="chb-to">To</lable>
          </div>
          <div xs={2}>
            <select
              className="cmb disabled:bg-slate-200"
              id="com-month2"
              disabled={duringBox}>
              {tmonth.map((m, i) => {
                if (i !== new Date().getMonth()) {
                  return <option value={i + 1}>{m}</option>;
                } else {
                  return (
                    <option value={i + 1} selected>
                      {m}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          <div xs={2}>
            <select
              className="cmb disabled:bg-slate-200"
              id="com-year2"
              disabled={duringBox}>
              {selectYear().map((y) => {
                if (y !== new Date().getFullYear()) {
                  return <option value={y}>{y}</option>;
                } else {
                  return (
                    <option value={y} selected>
                      {y}
                    </option>
                  );
                }
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="mt-n4 mt-md-0">
        <div>
          <button
            className={`rounded-md py-0.5 text-white px-1 ${
              !filterOpen ? "bg-green-600 px-2" : "bg-red-500"
            }`}
            onClick={() => setFilterOpen(!filterOpen)}>
            {!filterOpen ? (
              <div className="flex items-center gap-2">
                <CgMoreO /> Filter
              </div>
            ) : (
              <div>Close panel</div>
            )}
          </button>
        </div>
      </div>
      <div
        id="collapse"
        className={`${
          !filterOpen ? "h-0 py-0" : "h-24 border py-2"
        } transition-all duration-300 ease-in-out w-full overflow-hidden px-3  border-gray-300 rounded-md  my-3`}>
        <div>
          <div>
            <div className="flex items-center gap-2">
              <label>Exhibition</label>
              <div>
                <select
                  className="cmb"
                  id="exhibition"
                  onChange={(e) =>
                    setFilter({ ...filter, exID: e.target.value })
                  }
                  value={filter.exID}>
                  <option value="0">select exhibition</option>
                  {exhibition.length > 0 &&
                    exhibition.map((e) => (
                      <option value={e.exID}>
                        {e.name + " (" + e.exID + ")"}
                      </option>
                    ))}
                </select>
              </div>
              <div xs={12} md={4} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chb-pastEx"
                  onChange={() => setPastEx(!pastEx)}
                  className="size-4 accent-red-500"
                />
                <label for="chb-pastEx">Past Exhibition</label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label column xs={3} md={2}>
              Sales Name
            </label>
            <div xs={9} md={6}>
              <select
                className="cmb"
                id="sales"
                onChange={(e) =>
                  setFilter({ ...filter, sales: e.target.value })
                }
                value={filter.sales}>
                <option value="0">select name</option>
                {sales.length > 0 &&
                  sales.map((s) => <option value={s.emID}>{s.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label>Account Type</label>
              <div xs={9} md={6}>
                <select
                  className="cmb"
                  id="account"
                  onChange={(e) =>
                    setFilter({ ...filter, acc: e.target.value })
                  }
                  value={filter.acc}>
                  <option value="0">select account</option>
                  <option value="C">บริษัท</option>
                  <option value="T">บริษัท(ไม่หักTAX)</option>
                  <option value="P">ส่วนตัว</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-end">
          <button onClick={getData} className="btn-green px-2">
            Report
          </button>
        </div>
      </div>

      {report.length > 0 && !load ? (
        <div>
          <div className="my-3">
            <div>
              {/*
                <Pagelayout
                  data={report}
                  returndata={(data) => setPageShow(data)}
                                  >
        */}
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border bg-zinc-200 border-gray-400 py-1">
                      ลำดับ
                    </th>
                    <th className="border bg-zinc-200 border-gray-400 py-1">
                      ชื่อลูกค้า
                    </th>
                    <th className="border bg-zinc-200 border-gray-400 py-1">
                      งาน
                    </th>
                    <th className="border bg-zinc-200 border-gray-400 py-1">
                      เข้าบัญชีวันที่
                    </th>
                    <th className="border bg-zinc-200 border-gray-400 py-1">
                      จำนวนเงิน
                    </th>
                    <th className="border bg-zinc-200 border-gray-400 py-1">
                      %
                    </th>
                    <th className="border bg-zinc-200 border-gray-400 py-1">
                      Commission
                    </th>
                    <th className="border bg-zinc-200 border-gray-400 py-1">
                      ฝ่ายขาย
                    </th>
                    <th className="border bg-zinc-200 border-gray-400 py-1">
                      บัญชี
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((r, i) => (
                    <tr
                      onClick={(e) => rowClick(r.collectID)}
                      className="last:border-b border-gray-400">
                      <td className="border-l border-r border-gray-400 text-center">
                        {i + 1}
                      </td>
                      <td className="border-l border-r border-gray-400 pl-2">
                        {r.name}
                      </td>
                      <td className="border-l border-r border-gray-400 w-[50px] text-center">
                        {r.exID}
                      </td>
                      <td className="border-l border-r border-gray-400 w-[120px] text-right">
                        {r.clearing}
                      </td>
                      <td className="border-l border-r border-gray-400 text-right">
                        {r.bft
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                      </td>
                      <td className="border-l border-r border-gray-400 w-[40px] text-right">
                        {r.paytypeID === 9
                          ? 1.25
                          : r.newcus === false
                          ? r.salecomm
                          : r.newcomm}
                      </td>
                      <td className="border-l border-r border-gray-400 text-right">
                        {r.comm
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                      </td>
                      <td className="border-l border-r border-gray-400 pl-2">
                        {r.sales}
                      </td>
                      <td className="border-l border-r border-gray-400 pl-2">
                        {r.account === "C"
                          ? "บริษัท"
                          : r.account === "T"
                          ? "บจก ไม่หัก TAX"
                          : r.account === "P"
                          ? "ส่วนตัว"
                          : "รอพิจารณา"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={3}></th>
                    <th>รวมจำนวนเงิน</th>
                    <th className="text-right border-b border-gray-400 border-double">
                      {sum.Amount.toFixed(2).replace(
                        /(\d)(?=(\d{3})+(?!\d))/g,
                        "$1,"
                      )}
                    </th>
                    <th></th>
                    <th className="text-right border-b border-gray-400 border-double">
                      {sum.Comm.toFixed(2).replace(
                        /(\d)(?=(\d{3})+(?!\d))/g,
                        "$1,"
                      )}
                    </th>
                    <th colSpan={2}></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="hover:text-orange-600">
              <CSVLink data={dataCSV} filename={"CommReport.csv"}>
                Download CSV
              </CSVLink>
            </div>
          </div>
        </div>
      ) : (
        load && (
          <div className="flex justify-center">
            <div>
              <span className="text-red-500">Loading Data...</span>
            </div>
          </div>
        )
      )}

      <ModalComm
        show={modalIsOpen}
        close={() => setIsOpen(false)}
        dat={rowData}
        confirm={confirmClick}
      />
    </section>
  );
}
