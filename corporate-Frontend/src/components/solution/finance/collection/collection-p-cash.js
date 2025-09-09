import React, { useEffect, useState } from "react";

import styles from "./collection.module.css";

export default function PaymentCash(props) {
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

  const initDue = {
    d: new Date().getDate(),
    m: new Date().getMonth() + 1,
    y: new Date().getFullYear(),
  };
  const [due, setDue] = useState(initDue);

  useEffect(() => {
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
    props.receive(D);
  }, [due]);

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
      correctDate(props.recEdit);
    }
  }, [props.edit]);

  return (
    <div className={`${styles.boxborder} px-2`}>
      <div className={styles.boxheader}>Payment Info</div>

      <div>
        <div className="flex items-center gap-2">
          <label>Receive Date</label>
          <div>
            <select
              className="cmb"
              id="pday"
              onChange={(e) => setDue({ ...due, d: e.target.value })}
            >
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
              onChange={(e) => setDue({ ...due, m: e.target.value })}
            >
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
              onChange={(e) => setDue({ ...due, y: e.target.value })}
            >
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
      </div>
    </div>
  );
}
