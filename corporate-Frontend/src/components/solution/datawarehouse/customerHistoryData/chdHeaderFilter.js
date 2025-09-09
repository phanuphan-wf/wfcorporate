import React, { useState, useEffect, useContext } from "react";
import { dataContext } from "./customerHistoryData";

export default function ChdHeaderFilter() {
  const { filterC } = useContext(dataContext);

  const [filter, setFilter] = filterC;

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

  const year = () => {
    let ny = [];
    let y = new Date().getFullYear() + 1;
    for (let i = 0; i < 12; i++) {
      ny.push(y - i);
    }
    return ny;
  };

  const venue = [
    { id: 1, name: "Impact" },
    { id: 3, name: "BITEC" },
    { id: 2, name: "QSNCC" },
    { id: 10, name: "KICE" },
  ];

  const filterVenue = (id) => {
    if (filter.venue.includes(id)) {
      setFilter({ ...filter, venue: filter.venue.filter((v) => v != id) });
    } else {
      setFilter({ ...filter, venue: [...filter.venue, id] });
    }
  };

  const convertDateS = () => {
    let sdate =
      document.getElementById("s-month").value +
      "/" +
      document.getElementById("s-day").value +
      "/" +
      document.getElementById("s-year").value;
    return sdate;
  };

  const convertDateE = () => {
    let edate =
      document.getElementById("e-month").value +
      "/" +
      document.getElementById("e-day").value +
      "/" +
      document.getElementById("e-year").value;
    return edate;
  };

  useEffect(() => {
    if (filter.during) {
      setFilter({
        ...filter,
        sdate: convertDateS(),
        edate: convertDateE(),
      });
    } else {
      setFilter({
        ...filter,
        sdate: "",
        edate: "",
      });
    }
  }, [filter.during]);

  const sDateChange = () => {
    setFilter({ ...filter, sdate: convertDateS() });
  };

  const eDateChange = () => {
    setFilter({ ...filter, edate: convertDateE() });
  };

  useEffect(() => {
    //console.log(filter);
  }, [filter]);
  return (
    <div id="filter" className="lg:max-w-[60%] flex gap-4 flex-col">
      <div className="flex max-md:flex-wrap gap-3 items-center w-full">
        <div>
          <input
            type="checkbox"
            id="during"
            className="size-4 accent-green-500"
            onChange={() => setFilter({ ...filter, during: !filter.during })}
            checked={filter.during}
          />
          <label htmlFor="during" className="ml-3">
            During
          </label>
        </div>
        <div className="text-xs md:text-sm">
          <select
            id="s-day"
            className="cmb w-fit disabled:bg-slate-200"
            disabled={!filter.during}
            onChange={sDateChange}
          >
            {Array.from({ length: 31 }, (_, i) => {
              if (i + 1 === new Date().getDate()) {
                return (
                  <option key={i} value={i + 1} selected>
                    {i + 1}
                  </option>
                );
              } else {
                return (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                );
              }
            })}
          </select>
          <select
            id="s-month"
            className="cmb w-fit disabled:bg-slate-200"
            disabled={!filter.during}
            onChange={sDateChange}
          >
            {tmonth.map((m, i) => {
              if (i === new Date().getMonth()) {
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
            id="s-year"
            className="cmb w-fit disabled:bg-slate-200"
            disabled={!filter.during}
            onChange={sDateChange}
          >
            {year().map((y, i) => {
              if (y === new Date().getFullYear()) {
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
        <span>to</span>
        <div className="text-xs md:text-sm">
          <select
            id="e-day"
            className="cmb w-fit disabled:bg-slate-200"
            disabled={!filter.during}
            onChange={eDateChange}
          >
            {Array.from({ length: 31 }, (_, i) => {
              if (i + 1 === new Date().getDate()) {
                return (
                  <option key={i} value={i + 1} selected>
                    {i + 1}
                  </option>
                );
              } else {
                return (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                );
              }
            })}
          </select>
          <select
            id="e-month"
            className="cmb w-fit disabled:bg-slate-200"
            disabled={!filter.during}
            onChange={eDateChange}
          >
            {tmonth.map((m, i) => {
              if (i === new Date().getMonth()) {
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
            id="e-year"
            className="cmb w-fit disabled:bg-slate-200"
            disabled={!filter.during}
            onChange={eDateChange}
          >
            {year().map((y, i) => {
              if (y === new Date().getFullYear()) {
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
      </div>
      <div className="w-full h-fit border rounded-md relative">
        <div className="px-2 py-1 bg-white absolute -top-4 left-4">Venue</div>
        <div className="my-4 flex gap-3 justify-between px-4 flex-wrap">
          {venue.map((v, i) => {
            if (filter.venue.includes(v.id)) {
              return (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`v-${v.id}`}
                    className="size-4 accent-green-500"
                    checked={true}
                    onChange={(e) => filterVenue(v.id)}
                  />
                  <label htmlFor={`v-${v.id}`}>{v.name}</label>
                </div>
              );
            } else {
              return (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`v-${v.id}`}
                    className="size-4 accent-green-500"
                    checked={false}
                    onChange={(e) => filterVenue(v.id)}
                  />
                  <label htmlFor={`v-${v.id}`}>{v.name}</label>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
