import React, { useState, useEffect } from "react";

import styles from "./collection.module.css";

export default function PaymentTr(props) {
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

  const initTr = { collectID: 0, trBank: "", trID: "", trOpt: "", trDate: "" };
  const [tr, setTr] = useState(initTr);

  const initDue = {
    d: new Date().getDate(),
    m: new Date().getMonth() + 1,
    y: new Date().getFullYear(),
  };
  const [due, setDue] = useState(initDue);

  const reDateForm = () => {
    let om = "";
    if (due.m.toString().length === 1) {
      om = "0" + due.m;
    } else {
      om = due.m;
    }

    let od = "";

    if (due.d.toString().length === 1) {
      od = "0" + due.d;
    } else {
      od = due.d;
    }

    let D = due.y + "-" + om + "-" + od + "T00:00:00";
    return D;
  };

  useEffect(() => {
    setTr({ ...tr, trDate: reDateForm() });
  }, [due]);

  useEffect(() => {
    let bank = props.bank;

    switch (bank) {
      case "4":
        setTr({ ...tr, trBank: "1", trDate: reDateForm() });
        break;
      case "5":
        setTr({ ...tr, trBank: "5", trDate: reDateForm() });
        break;
      case "10":
        setTr({ ...tr, trBank: "24", trDate: reDateForm() });
        break;
      case "11":
        setTr({ ...tr, trBank: "4", trDate: reDateForm() });
        break;
      default:
        setTr({ ...tr, trBank: "1", trDate: reDateForm() });
        break;
    }
  }, [props.bank]);

  useEffect(() => {
    props.return(tr);
  }, [tr]);

  function correctDate(d) {
    let dd = "";
    let mm = "";
    let yy = "";

    d = d.substring(0, d.indexOf("T"));

    yy = d.substring(0, d.indexOf("-"));
    let mi = d.substring(d.indexOf("-") + 1, d.indexOf("-") + 3);
    dd = d.substring(d.length - 2);
    setDue({ d: Number(dd), m: Number(mi), y: Number(yy) });
  }

  useEffect(() => {
    if (props.edit) {
      setTr(props.data);
      correctDate(props.data.trDate);
    }
  }, [props.edit]);

  return (
    <div className={`${styles.boxborder} px-2`}>
      <div className={styles.boxheader}>Payment Info</div>
      <div className="mt-2">
        <div className="flex items-center gap-2 max-sm:flex-wrap">
          <label>Transfer Date</label>
          <div>
            <select
              id="pday"
              className="cmb"
              onChange={(e) => setDue({ ...due, d: e.target.value })}>
              {day().map((d) => {
                if (props.edit) {
                  if (due.d === d) {
                    return (
                      <option value={d} selected>
                        {d}
                      </option>
                    );
                  } else {
                    return <option value={d}>{d}</option>;
                  }
                } else {
                  if (new Date().getDate() === d) {
                    return (
                      <option value={d} selected>
                        {d}
                      </option>
                    );
                  } else {
                    return <option value={d}>{d}</option>;
                  }
                }
              })}
            </select>
          </div>
          <div>
            <select
              className="cmb"
              id="pmonth"
              onChange={(e) => setDue({ ...due, m: e.target.value })}>
              {month.map((m, i) => {
                if (props.edit) {
                  if (due.m === i + 1) {
                    return (
                      <option value={i + 1} selected>
                        {m}
                      </option>
                    );
                  } else {
                    return <option value={i + 1}>{m}</option>;
                  }
                } else {
                  if (new Date().getMonth() === i) {
                    return (
                      <option value={i + 1} selected>
                        {m}
                      </option>
                    );
                  } else {
                    return <option value={i + 1}>{m}</option>;
                  }
                }
              })}
            </select>
          </div>
          <div>
            <select
              className="cmb"
              id="pyear"
              onChange={(e) => setDue({ ...due, y: e.target.value })}>
              {year().map((y, i) => {
                if (props.edit) {
                  if (due.y === y) {
                    return (
                      <option value={y} selected>
                        {y}
                      </option>
                    );
                  } else {
                    return <option value={y}>{y}</option>;
                  }
                } else {
                  if (new Date().getFullYear() === y) {
                    return (
                      <option value={y} selected>
                        {y}
                      </option>
                    );
                  } else {
                    return <option value={y}>{y}</option>;
                  }
                }
              })}
            </select>
          </div>
        </div>
        <div className="flex gap-2 max-sm:flex-col mt-2">
          <div className="flex items-center gap-2">
            <label column xs={3} md={3}>
              Transaction
            </label>
            <div>
              <input
                placeholder="transaction detail"
                value={tr.trID}
                onChange={(e) => setTr({ ...tr, trID: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label column xs={3} md={3}>
              Other Detail
            </label>
            <div>
              <input
                placeholder="other detail"
                value={tr.trOpt}
                onChange={(e) => setTr({ ...tr, trOpt: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
