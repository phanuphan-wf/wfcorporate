import React, { createContext, useEffect, useState, useRef } from "react";
import ReactToPrint from "react-to-print";

import ContractHeader from "./contractheader";
import ContractCompany from "./contractCompany";
import ContractShow from "./contractShow";
import ContractInfo from "./contractInfo";
import ContractDeco from "./contractDeco";
import ContractProduct from "./contractProduct";
import ContractPrintForm from "./contractPrintForm/contractPrintForm";

export const dataContext = createContext();

export default function ContractPrint() {
  const printContract = useRef(null);

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

  const initContract = {
    conno: "",
    at: "",
    company: "",
    prefix: "",
    name: "",
    pos: "",
    pid: "",
    addr: "",
    tel: "",
    fax: "",
    email: "",
    line: "",
    exname: "",
    venue: "",
    date: "",
    time: "",
    booth: "",
    space: "",
    cost: "",
    costtext: "",
    deposit: "",
    wtndep: "",
    pay1: "",
    wtn1: "",
    pay2: "",
    wtn2: "",
    cheque: "",
    movein1: "",
    mit1: "",
    movein2: "",
    mit2: "",
    moveout1: "",
    mot1: "",
    moveout2: "",
    mot2: "",
    type: "",
    product: "",
    day: new Date().getDate(),
    month: tmonth[new Date().getMonth()],
    year: new Date().getFullYear(),
  };

  const [contract, setContract] = useState(initContract);

  const [selectShow, setSelectShow] = useState({});

  useEffect(() => {
    //console.log("show", selectShow);
  }, [selectShow]);

  useEffect(() => {
    console.log(printContract.current);
  }, [printContract]);

  return (
    <dataContext.Provider
      value={{
        contractC: [contract, setContract],
        selectShowC: [selectShow, setSelectShow],
      }}
    >
      <section id="contract-print">
        <h1 className="text-xl font-medium">Contract Print</h1>
        <ContractHeader />
        <ContractCompany />
        <ContractShow />
        <ContractInfo />
        <ContractDeco />
        <ContractProduct />
        <ReactToPrint
          trigger={() => (
            <div className="flex justify-end w-full lg:w-3/4">
              <button className="btn-primary px-4 my-4">Print</button>
            </div>
          )}
          content={() => printContract.current}
        />

        <div className="hidden print:block" ref={printContract}>
          <ContractPrintForm />
        </div>
      </section>
    </dataContext.Provider>
  );
}
