import React, { useEffect, useState } from "react";

import styles from "./collection.module.css";

import Axios from "axios";

export default function PaymentCredit(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_Finance_api;

  const [creditType, setCreditType] = useState([]);

  async function creditTypeLoad() {
    try {
      const res = await Axios.get(url + "/creditTypeLoad").then((res) =>
        setCreditType(res.data)
      );
    } catch (err) {
      alert("Cannot load credit card type data: " + err);
    }
  }

  const [bank, setBank] = useState([]);

  async function bankLoad() {
    try {
      const res = await Axios.get(url + "/bankLoad").then((res) =>
        setBank(res.data)
      );
    } catch (err) {
      alert("Cannot load bank data: " + err);
    }
  }

  useEffect(() => {
    creditTypeLoad();
    bankLoad();
  }, []);

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

  const initCredit = {
    collectID: 0,
    bank: "",
    type: "",
    holder: "",
    code: "",
    expire: "",
    bill: "",
  };
  const [credit, setCredit] = useState(initCredit);

  useEffect(() => {
    props.return(credit);
  }, [credit]);

  function cardCheck() {
    if (credit.code === "") {
      document.getElementById("cno-span").hidden = true;
      return;
    }
    let check = credit.code.match(/^\d{4}\s*\d{4}\s*\d{4}\s*\d{4}$/);
    if (!check) {
      document.getElementById("cno-span").hidden = false;
    } else {
      document.getElementById("cno-span").hidden = true;
    }
  }

  function expCheck() {
    if (credit.expire === "") {
      document.getElementById("exp-span").hidden = true;
      return;
    }
    let check = credit.expire.match(/^\d{2}\s?\/?\d{2}$/);
    if (!check) {
      document.getElementById("exp-span").hidden = false;
    } else {
      document.getElementById("exp-span").hidden = true;
    }
  }

  useEffect(() => {
    if (props.edit) {
      setCredit(props.data);
      correctDate(props.recEdit);
    }
  }, [props.edit]);

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

  return (
    <div className={`${styles.boxborder} px-2`}>
      <div className={styles.boxheader}>Payment Info</div>
      <div className="flex gap-2">
        <div className="flex gap-2 items-center">
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
      <div className="mt-2 flex gap-2 max-sm:flex-wrap">
        <div className="flex gap-2 items-center">
          <label>Card Type</label>
          <div>
            <select
              className="cmb"
              id="ptype"
              value={credit.type}
              onChange={(e) => setCredit({ ...credit, type: e.target.value })}
            >
              <option value="">----</option>
              {creditType.map((c) => (
                <option value={c.creditType}>{c.creditType}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <label>Bank</label>
          <div>
            <select
              className="cmb"
              id="pbank"
              value={credit.bank}
              onChange={(e) => setCredit({ ...credit, bank: e.target.value })}
            >
              <option value="">----</option>
              {bank.map((b) => (
                <option value={b.code}>{b.bank}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <label>Card Number</label>
            <div>
              <input
                placeholder="____ ____ ____ ____"
                value={credit.code}
                onChange={(e) => setCredit({ ...credit, code: e.target.value })}
                onBlur={cardCheck}
              />
            </div>
          </div>
          <div className="text-end">
            <span style={{ color: "red" }} id="cno-span" hidden>
              Please fill right format only
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-2 items-center max-sm:flex-wrap">
        <div className="flex gap-2 items-center">
          <label>Holder Name</label>
          <div>
            <input
              placeholder="holder name"
              value={credit.holder}
              onChange={(e) => setCredit({ ...credit, holder: e.target.value })}
            />
          </div>
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <label>Exp Date</label>
            <div>
              <input
                placeholder="__/__"
                value={credit.expire}
                onChange={(e) =>
                  setCredit({ ...credit, expire: e.target.value })
                }
                onBlur={expCheck}
              />
            </div>
          </div>
          <div className="text-end">
            <span style={{ color: "red" }} id="exp-span" hidden>
              Please fill right format only
            </span>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <label>No.</label>
          <div>
            <input
              placeholder=""
              value={credit.bill}
              onChange={(e) => setCredit({ ...credit, bill: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
