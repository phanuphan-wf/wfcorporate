import React, { useContext, useEffect, useState } from "react";

import Axios from "axios";

import styles from "./collection.module.css";

export default function PaymentChq(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_Finance_api;

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

  const [bank, setBank] = useState([]);

  const bankload = async () => {
    const res = await Axios.get(url + "/bankLoad").then((r) => setBank(r.data));
  };

  useEffect(() => {
    bankload();
  }, []);

  const initCheque = {
    collectID: 0,
    bank: "",
    br: "",
    c_No: "",
    dueDate: "",
    paidBy: "",
  };
  const [cheque, setCheque] = useState(props.edit ? props.data : initCheque);

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
    setCheque({ ...cheque, dueDate: D });
  }, [due]);

  useEffect(() => {
    // for edit section
  }, [props.id]);

  useEffect(() => {
    props.return(cheque);
  }, [cheque]);

  function formatCheck() {
    if (cheque.C_No !== "") {
      let check = cheque.C_No.match(/^\d{8}$/);

      if (!check) {
        document.getElementById("cno-span").hidden = false;
      } else {
        document.getElementById("cno-span").hidden = true;
      }
    } else {
      document.getElementById("cno-span").hidden = true;
    }
  }

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
      setCheque(props.data);
      correctDate(props.data.dueDate);
    }
  }, [props.edit]);

  return (
    <div className={`${styles.boxborder} px-2`}>
      <div className={styles.boxheader}>Payment Info</div>
      <div className="flex gap-2 max-sm:flex-wrap">
        <div className="flex items-center gap-2">
          <label>Bank</label>
          <div>
            <select
              className="cmb"
              value={cheque.bank}
              onChange={(e) => setCheque({ ...cheque, bank: e.target.value })}
            >
              <option value="0">----</option>
              {bank.map((b) => (
                <option value={b.code}>{b.bank}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label>Branch</label>
          <div>
            <input
              placeholder="Branch Name"
              value={cheque.br}
              onChange={(e) => setCheque({ ...cheque, br: e.target.value })}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label>Cheque#</label>
          <div>
            <input
              placeholder="XXXXXXXX"
              value={cheque.c_No}
              onChange={(e) => setCheque({ ...cheque, c_No: e.target.value })}
              onBlur={formatCheck}
            />
          </div>

          <div className="text-end">
            <span style={{ color: "red" }} id="cno-span" hidden>
              Please fill right format only
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <div className="flex items-center gap-2">
          <label style={{ fontSize: "0.85rem" }}>Cheque Date</label>
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
        <div className="flex items-center gap-2">
          <label>Payer (Opt.)</label>
          <div>
            <input
              placeholder="Payee Name"
              value={cheque.paidBy}
              onChange={(e) => setCheque({ ...cheque, paidBy: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
