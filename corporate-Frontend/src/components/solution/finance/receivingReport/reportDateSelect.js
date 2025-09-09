import React, { useEffect, useState, useContext } from "react";
import { dataContext } from "./report";
import { use } from "react";

export default function ReportDateSelect(props) {
  const { filterC, printDateC } = useContext(dataContext);

  const [filter, setFilter] = filterC;
  const [printDate, setPrintDate] = printDateC;

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

  const smonth = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const selectYear = () => {
    var year = [];
    for (let i = -2; i < 2; i++) {
      year.push(new Date().getFullYear() + i);
    }

    return year;
  };

  const [duringBox, setDuring] = useState(true);

  const chbToChange = () => {
    setDuring(!duringBox);
    setFilter({ ...filter, range: !filter.range });
    setPrintDate({ ...printDate, due: !printDate.due });
  };

  const initData = {
    d1: new Date().getDate(),
    m1: new Date().getMonth() + 1,
    y1: new Date().getFullYear(),
    d2: new Date().getDate(),
    m2: new Date().getMonth() + 1,
    y2: new Date().getFullYear(),
  };
  const [data, setData] = useState(initData);

  useEffect(() => {
    setFilter({
      ...filter,
      date1: data.y1 + "-" + data.m1 + "-" + data.d1,
      date2: data.y2 + "-" + data.m2 + "-" + data.d2,
    });
    setPrintDate({
      ...printDate,
      date1: data.d1 + " " + smonth[data.m1 - 1] + " " + data.y1,
      date2: data.d2 + " " + smonth[data.m2 - 1] + " " + data.y2,
    });
  }, [data]);

  return (
    <div>
      <div className="flex items-center gap-2">
        <label className="mr-5">Report Duration</label>
        <div>
          <select
            className="cmb"
            id="com-day"
            onChange={(e) => setData({ ...data, d1: e.target.value })}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((i) => {
              if (i !== new Date().getDate()) {
                return <option value={i}>{i}</option>;
              } else {
                return (
                  <option value={i} selected>
                    {i}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div>
          <select
            className="cmb"
            id="com-month"
            onChange={(e) => setData({ ...data, m1: e.target.value })}
          >
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
        <div>
          <select
            className="cmb"
            id="com-year"
            onChange={(e) => setData({ ...data, y1: e.target.value })}
          >
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
        <div className={"pt-1"}>
          <input
            type="checkbox"
            id="chb-to"
            onChange={chbToChange}
            className="accent-red-500 size-4 mr-2"
            value={filter.range}
          />
          <lable for="chb-to">To</lable>
        </div>
        <div>
          <select
            className="cmb disabled:bg-slate-200"
            id="com-day2"
            disabled={duringBox}
            onChange={(e) => setData({ ...data, d2: e.target.value })}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((i) => {
              if (i !== new Date().getDate()) {
                return <option value={i}>{i}</option>;
              } else {
                return (
                  <option value={i} selected>
                    {i}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div>
          <select
            className="cmb disabled:bg-slate-200"
            id="com-month2"
            disabled={duringBox}
            onChange={(e) => setData({ ...data, m2: e.target.value })}
          >
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
        <div>
          <select
            className="cmb disabled:bg-slate-200"
            id="com-year2"
            disabled={duringBox}
            onChange={(e) => setData({ ...data, y2: e.target.value })}
          >
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
  );
}
