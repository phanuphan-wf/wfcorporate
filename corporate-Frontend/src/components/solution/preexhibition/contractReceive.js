import React, { createContext, useEffect, useState } from "react";
import Axios from "axios";
import useHeader from "../../hook/useHeader";

import ContractHeader from "./contractReceive/contractheader";
import SignatureImg from "./contractReceive/signatureImg";
import CustomerSearch from "./contractReceive/customerSearch";
import CustomerInfo from "./contractReceive/customerInfo";
import ContractInfo from "./contractReceive/contractInfo";
import ContractSale from "./contractReceive/contractsale";
import ContractSum from "./contractReceive/contractsum";

export const dataContext = createContext();

export default function ContractReceive(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctr;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [exhibition, setExhibition] = useState("0");
  var CryptoJS = require("crypto-js");
  const initContractDetail = {
    CustomerID: 0,
    ExhibitionID: "",
    BoothNo: "",
    Spaces: 0.0,
    PriceID: 0,
    Markup: 0.0,
    DisElec: 0.0,
    DisOther: 0.0,
    Volume: 0.0,
    SignDate:
      new Date().getMonth() +
      1 +
      "/" +
      new Date().getDate() +
      "/" +
      new Date().getFullYear(),
    InputBy: CryptoJS.AES.decrypt(
      JSON.parse(localStorage.getItem("user")).EmID,
      process.env.REACT_APP_KEY
    ).toString(CryptoJS.enc.Utf8),
    Recheck: false,
    CheckDate: null,
    CheckBy: null,
    SaleID: 0,
    ContractID: 0,
    SignID: 0,
    Grid: "",
  };
  const [contractDetail, setContractDetail] = useState(initContractDetail);

  const initPriceCorrection = {
    historyID: 0,
    conner: 0.0,
    electric: 0.0,
    pillar: 0.0,
    early: 0.0,
    other: 0.0,
    otherP: 0.0,
  };
  const [priceCorrection, setPriceCorrection] = useState(initPriceCorrection);
  const [signImg, setSignImg] = useState({});
  const [searchName, setSearchName] = useState("");
  const [reset, setReset] = useState(false);
  const [boothAvai, setBoothAvai] = useState(true);

  function parseDate(pDate) {
    var pad = function (num) {
      return ("00" + num).slice(-2);
    };
    var date;
    date = new Date(pDate);
    var year = date.getFullYear();
    var month = pad(date.getMonth() + 1);
    var day = pad(date.getDate());
    var hour = pad(date.getHours());
    var minute = pad(date.getMinutes());
    var sec = pad(date.getSeconds());

    // After this construct a string with the above results as below

    return (
      year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + sec
    );
  }

  const verifyFill = (d) => {
    if (
      d.CustomerID == 0 ||
      d.BoothNo == "" ||
      d.Spaces == "" ||
      //d.Spaces == 0 ||
      d.PriceID == 0 ||
      d.Volume == 0.0 ||
      d.SaleID === "0" ||
      d.ContractID == 0 ||
      d.SignID == 0 ||
      d.Grid == ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  const [submit, setSubmit] = useState(false);

  const submitContract = () => {
    if (!verifyFill(contractDetail)) {
      alert("Please fill all contract data before submit");
      return;
    }

    setSubmit(true);
  };

  const postContract = async () => {
    let data = contractDetail;
    data.ExhibitionID = exhibition;
    data.SignDate = parseDate(data.SignDate);

    try {
      const res = await Axios.post(url + "/addContract", data).then((r) => {
        let bdata = {
          BoothNo: contractDetail.BoothNo,
          ExhibitionID: exhibition,
        };
        const resb = Axios.put(url + "/boothAvai/false", bdata);
        setPriceCorrection({ ...priceCorrection, historyID: r.data });
      });
    } catch (err) {
      if (err.response.status == 400) {
        alert(
          "Error! - Add contract is not successful, please contract administrator"
        );
      }
    }
  };

  useEffect(() => {
    if (submit) {
      postContract();
    }
  }, [submit]);

  const addHisDis = async () => {
    let disdata = priceCorrection;

    let discat = Object.keys(disdata);

    let hisdis = [];
    discat.map((d, i) => {
      if (i != 0) {
        if (disdata[d] != 0) {
          hisdis.push({
            historyID: disdata.historyID,
            discount: d,
            volume: disdata[d],
          });
        }
      }
    });

    try {
      const res = await Axios.post(url + "/addHisDis", hisdis);
    } catch (err) {
      if (err.response.status == 400) {
        alert(
          "Error! - Add history discount is not successful, please contract administrator"
        );
      }
    }
    setReset(!reset);
    setSubmit(false);
  };

  useEffect(() => {
    if (priceCorrection.historyID != 0) {
      addHisDis();
    }
  }, [priceCorrection.historyID]);

  useEffect(() => {
    console.log(contractDetail);
  }, [contractDetail]);

  useEffect(() => {
    //console.log(reset);
  }, [reset]);

  return (
    <dataContext.Provider
      value={{
        exhibitionC: [exhibition, setExhibition],
        contractDetailC: [contractDetail, setContractDetail],
        priceCorrectionC: [priceCorrection, setPriceCorrection],
        signatureC: [signImg, setSignImg],
        searchNameC: [searchName, setSearchName],
        resetC: [reset, setReset],
        boothAvaiC: [boothAvai, setBoothAvai],
      }}
    >
      <section className="contract-receive">
        <div>
          <h1 className="text-2xl">Contract Receiving</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="mt-2 w-full lg:col-span-2">
            <ContractHeader />
          </div>
          <div className="lg:row-span-2 max-lg:order-last">
            <SignatureImg />
          </div>
          <div className="mt-2 w-full lg:col-span-2">
            <CustomerSearch />
          </div>
        </div>
        <div>
          <CustomerInfo />
        </div>
        <div className="mt-3">
          <ContractInfo />
        </div>
        <div className="flex justify-between flex-wrap mt-2">
          <ContractSale />
          <button
            className="btn-green px-5 disabled:border-gray-300 disabled:bg-gray-300 disabled:hover:text-white"
            onClick={submitContract}
            disabled={submit}
          >
            Submit
          </button>
        </div>
        <div className="mt-2">
          <ContractSum />
        </div>
      </section>
    </dataContext.Provider>
  );
}
