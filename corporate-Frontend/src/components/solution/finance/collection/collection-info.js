import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { CollectionContext } from "./collectionContext";

import ModalSearch from "./modalSearch";

import useHeader from "../../../hook/useHeader";

export default function CollectionInfo(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_Finance_api;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  //console.log(bearer);

  const { collection, setExId, setCustomerId, setPage } =
    useContext(CollectionContext);

  const [exhibition, setExhibition] = useState([]);

  const [pastEx, setPastEx] = useState(false);

  async function exhibitionLoad() {
    try {
      const res = await Axios.get(url + "/Exhibitionload/" + pastEx).then(
        (res) => {
          let arr = res.data;
          arr.map((a) => {
            a.during = correctDate(a.sDate) + " - " + correctDate(a.eDate);
          });
          setExhibition(arr);
        }
      );
    } catch (err) {
      alert("Error! cannot load exhibition data : " + err);
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

    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    month.map((m, i) => {
      if (i + 1 === Number(mi)) {
        mm = m;
      }
    });

    return dd + " " + mm + " " + yy;
  }

  useEffect(() => {
    exhibitionLoad();
  }, []);

  useEffect(() => {
    exhibitionLoad();
    exhibitionSelect("0");
    document.getElementById("eName").value = "0";
  }, [pastEx]);

  const initExselect = { code: "", venue: "", during: "" };
  const [exselect, setExselect] = useState(initExselect);

  function exhibitionSelect(id) {
    if (id === "0") {
      setExselect(initExselect);
      return;
    }
    let exdata = {};
    exdata = exhibition.filter((e, i) => i === id - 1);
    setExselect(exdata[0]);
  }

  useEffect(() => {
    setExId(exselect.code);
    props.ex(exselect);
  }, [exselect]);

  const [searchtxt, setSearchtxt] = useState("");

  //const [searchtype, setSearchtype] = useState("0");

  const [modalShow, setModalShow] = useState(false);

  function showModal(e) {
    if (e.key === "Enter") {
      setModalShow(true);
    }
  }

  function modalClose() {
    setModalShow(false);
  }

  const fillCustomer = (id) => {
    if (id != "") {
      getCustomer(id);
      getBalance(id);
    }
    setCustomerId(id);
    setModalShow(false);
    //setSearchtype("0");
    document.getElementById("cSelect").value = "0";
  };

  useEffect(() => {
    if (searchtxt === "") {
      setCustomerData([]);
      setCustomerId("");
    }
  }, [searchtxt]);

  const [customerData, setCustomerData] = useState([]);

  const [balance, setBalance] = useState(0);

  async function getCustomer(id) {
    try {
      const res = await Axios.get(
        url + "/getCustomer/" + id + "/" + exselect.code
      ).then((res) => setCustomerData(res.data));
    } catch (err) {
      alert("Error! cannot load customer data : " + err);
    }
  }

  useEffect(() => {
    if (customerData.length) {
      setSearchtxt(customerData[0].name);
    }
  }, [customerData]);

  async function getBalance(id) {
    try {
      const res = await Axios.get(
        url + "/getRemain/" + id + "/" + exselect.code
      ).then((res) => setBalance(res.data));
    } catch (err) {
      alert("Error! cannot get customer balance : " + err);
    }
  }

  function onPageChange(p) {
    if (!isNaN(p)) {
      setPage(p);
    } else {
      setPage("");
    }
  }

  useEffect(() => {
    if (collection.customerId === "") {
      setCustomerData([]);
      setSearchtxt("");
      setBalance(0);
      setPayhis(true);
    } else {
      getCustomer(collection.customerId);
      getBalance(collection.customerId);
      setPayhis(false);
    }
  }, [collection.customerId]);

  //test data

  useEffect(() => {
    //console.log(balance);
  }, [balance]);

  const [payhis, setPayhis] = useState(true);

  const nav = useNavigate();

  const navPaymentHistory = () => {
    nav("/solution/finance/collectionhistory/", {
      state: { customerId: collection.customerId, exId: collection.exId },
    });
  };

  return (
    <div>
      <form>
        <div className="flex gap-2">
          {/*-------------Exhibition Section ----------------- */}
          <div className="border rounded-md relative border-zinc-500 w-full md:w-2/5 px-3">
            <div className="absolute bg-white px-2 py-1 -top-3 text-red-600">
              Exhibition
            </div>
            <div className="mt-5 mb-3 flex flex-col gap-3">
              <div className="flex items-center">
                <label htmlFor="eName" className="w-[120px]">
                  Exhibition Name
                </label>

                <select
                  onChange={(e) => exhibitionSelect(e.target.value)}
                  id="eName"
                  className="cmb"
                >
                  <option value="0">----</option>
                  {exhibition.map((e, i) => (
                    <option value={i + 1}>
                      {e.name + " (" + e.code + ")"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <label htmlFor="vName" className="w-[120px]">
                  Venue
                </label>
                <span className={`${exselect.venue ? "" : "text-slate-400"}`}>
                  {exselect.venue ? exselect.venue : "Venue Name"}
                </span>
              </div>
              <div className="flex items-center">
                <label htmlFor="during" className="w-[120px]">
                  During
                </label>
                <span className={`${exselect.during ? "" : "text-slate-400"}`}>
                  {exselect.during ? exselect.during : "dd/MM/YYYY-dd/MM/YYYY"}
                </span>
              </div>
              <div className="flex w-full justify-end items-center">
                <input
                  type="checkbox"
                  id="eFinish"
                  onChange={() => setPastEx(!pastEx)}
                  className="accent-red-500"
                />
                <label htmlFor="eFinish" className="ml-2">
                  Show Finished Exhibition
                </label>
              </div>
            </div>
          </div>
          {/*-------------Customer Section ----------------- */}
          <div className="border rounded-md relative border-zinc-500 w-full md:w-2/5 px-3">
            <div className="absolute bg-white px-2 py-1 -top-3 text-red-600">
              Customer Info
            </div>
            <div className="mt-5 mb-3 flex flex-col gap-3">
              <div className="flex gap-2 items-center">
                <label htmlFor="searchtxt" className="w-[150px]">
                  Customer Name
                </label>

                <input
                  placeholder="customer"
                  id="searchtxt"
                  onChange={(e) => setSearchtxt(e.target.value)}
                  disabled={exselect.code !== "" ? false : true}
                  onKeyDown={(e) => showModal(e)}
                  value={searchtxt}
                  className="disabled:bg-gray-200 w-full"
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="BoothNo" className="w-[125px]">
                  Booth No
                </label>
                <span
                  className={`${customerData.length ? "" : "text-slate-400"}`}
                >
                  {customerData.length ? customerData[0].booth : "booth #"}
                </span>
              </div>
              <div className="flex items-center">
                <label htmlFor="Space" className="w-[125px]">
                  total Space
                </label>
                <span
                  className={`${customerData.length ? "" : "text-slate-400"}`}
                >
                  {customerData.length
                    ? customerData[0].space + " Sq.m."
                    : "space (sq.m.)"}
                </span>
              </div>
              <div className="flex items-center">
                <label htmlFor="Sales" className="w-[125px]">
                  Sales Name
                </label>
                <span
                  className={`${customerData.length ? "" : "text-slate-400"}`}
                >
                  {customerData.length ? customerData[0].sale : "Sale Name"}
                </span>
              </div>
            </div>
          </div>
          {/*------------- Page Section ----------------- */}
          <div className="relative w-full md:w-1/5 px-3 flex md:flex-col justify-between">
            <div className="flex flex-col">
              <label>Page</label>
              <input
                placeholder="Page#"
                onChange={(e) => onPageChange(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label>Customer Balance</label>
              <input
                placeholder="0.00"
                className={`${balance < 0 ? "text-red-500" : ""}`}
                value={
                  balance
                    ? Number(balance)
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                    : ""
                }
              />
            </div>
            <div className="flex justify-end">
              <button
                className="btn-primary px-2 disabled:bg-slate-300 disabled:border-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
                disabled={payhis}
                onClick={navPaymentHistory}
              >
                Payment History
              </button>
            </div>
          </div>
        </div>
      </form>

      <ModalSearch
        show={modalShow}
        searchtxt={searchtxt}
        exid={exselect.code}
        onHide={modalClose}
        fill={fillCustomer}
      />
    </div>
  );
}
