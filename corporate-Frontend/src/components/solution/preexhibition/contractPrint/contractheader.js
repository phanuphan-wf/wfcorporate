import React, { useState, useContext, useEffect } from "react";

import { dataContext } from "./contractPrint";

export default function ContractHeader() {
  const { contractC } = useContext(dataContext);

  const [contract, setContract] = contractC;

  const selectDay = () => {
    var day = [];
    for (let i = 1; i < 32; i++) {
      day.push(i);
    }

    return day;
  };

  const tmonth = [
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
    for (let i = -1; i < 2; i++) {
      year.push(new Date().getFullYear() + i);
    }

    return year;
  };

  const wroteChange = (e) => {
    if (e.target.checked) {
      setContract({ ...contract, at: "บริษัท เวิลด์แฟร์ จำกัด" });
    } else {
      setContract({ ...contract, at: "" });
    }
  };

  const blankDate = (e) => {
    if (e.target.checked) {
      setContract({ ...contract, day: "", month: "", year: "" });
      setBlank(true);
    } else {
      setContract({
        ...contract,
        day: new Date().getDate(),
        month: tmonth[new Date().getMonth()],
        year: new Date().getFullYear(),
      });
      setBlank(false);
    }
  };

  const [blank, setBlank] = useState(false);

  return (
    <section id="contract-header" className="my-2">
      <div className="my-1 flex items-center">
        <label htmlFor="txt-no" className="w-[150px]">
          เลขที่สัญญา
        </label>
        <input
          type="text"
          id="txt-no"
          className="w-[150px]"
          placeholder="#No"
          value={contract.conno}
          onChange={(e) => setContract({ ...contract, conno: e.target.value })}
        />
        <span className="ml-3">(able to blank)</span>
      </div>
      <div className="my-1 flex items-center">
        <label htmlFor="txt-wrote" className="w-[150px]">
          เขียนที่
        </label>
        <input
          type="text"
          id="txt-wrote"
          className="w-[350px] disabled:bg-slate-300"
          placeholder="wrote at"
          value={contract.at}
          disabled={contract.at == "บริษัท เวิลด์แฟร์ จำกัด" ? true : false}
          onChange={(e) => setContract({ ...contract, at: e.target.value })}
        />
        <input
          type="checkbox"
          id="chb-worldfair"
          className="accent-red-500 size-4 ml-3"
          onChange={wroteChange}
        />
        <label htmlFor="chb-worldfair" className="ml-1">
          check for default wrote at "World Fair"
        </label>
      </div>
      <div className="my-1 flex items-center">
        <label htmlFor="cmb-date" className="w-[150px]">
          วันที่
        </label>
        <select
          className="cmb w-10 disabled:bg-slate-300"
          id="cmb-day"
          onChange={(e) => setContract({ ...contract, day: e.target.value })}
          disabled={blank}
        >
          {selectDay().map((day, index) => {
            if (day == contract.day) {
              return (
                <option key={index} value={day} selected>
                  {day}
                </option>
              );
            } else {
              return (
                <option key={index} value={day}>
                  {day}
                </option>
              );
            }
          })}
        </select>
        <select
          className="cmb w-10 disabled:bg-slate-300"
          id="cmb-month"
          onChange={(e) =>
            setContract({ ...contract, month: tmonth[e.target.value] })
          }
          disabled={blank}
        >
          {tmonth.map((month, index) => {
            if (month == contract.month) {
              return (
                <option key={index} value={index + 1} selected>
                  {month}
                </option>
              );
            } else {
              return (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              );
            }
          })}
        </select>
        <select
          className="cmb w-10 disabled:bg-slate-300"
          id="cmb-year"
          onChange={(e) => setContract({ ...contract, year: e.target.value })}
          disabled={blank}
        >
          {selectYear().map((year, index) => {
            if (year == contract.year) {
              return (
                <option key={index} value={year} selected>
                  {year}
                </option>
              );
            } else {
              return (
                <option key={index} value={year}>
                  {year}
                </option>
              );
            }
          })}
        </select>
        <input
          type="checkbox"
          id="cbb-date"
          className="accent-red-500 size-4 ml-3"
          onChange={blankDate}
        />
        <label htmlFor="cbb-date" className="ml-1">
          check for use blank date
        </label>
      </div>
    </section>
  );
}
