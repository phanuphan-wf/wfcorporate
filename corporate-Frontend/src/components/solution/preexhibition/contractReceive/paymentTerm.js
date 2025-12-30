import { useState, useContext, useEffect } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { NumericFormat } from "react-number-format";

import { dataContext } from "../contractReceive";

function PaymentTerm() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctr;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { exhibitionC, contractDetailC, priceCorrectionC } =
    useContext(dataContext);

  const [exhibition, setExhibition] = exhibitionC;
  const [contractDetail, setContractDetail] = contractDetailC;
  const [priceCorrection, setPriceCorrection] = priceCorrectionC;

  const [payment, setPayment] = useState({});
  const [exdata, setExdata] = useState({});

  const getPaymentTerm = async () => {
    try {
      const [res1, res2] = await Promise.all([
        Axios.get(url + "/getCredit/" + contractDetail.CustomerID),
        Axios.get(url + "/getExData/" + exhibition),
      ]).then(([r1, r2]) => {
        setPayment(r1.data);
        setExdata(r2.data);
      });
    } catch (error) {
      //console.log(error);
    }
  };

  useEffect(() => {
    if (contractDetail.CustomerID != 0) {
      getPaymentTerm();
    }
  }, [contractDetail]);

  const [due, setDue] = useState({});

  const addDays = (dateStr, days) => {
    const d = new Date(dateStr);

    d.setDate(d.getDate() + Number(days));

    return d;
  };

  const makeDue = () => {
    let d1 = 0;
    let d2 = 0;
    let d3 = 0;
    if (Object.keys(payment).length > 0) {
      d1 = addDays(contractDetail.SignDate, 7);
      d2 = addDays(exdata.endDate, Number(payment.cr1));
      d3 = addDays(exdata.endDate, Number(payment.cr2));
      if (d1 > new Date(exdata.startDate)) {
        d1 = new Date(contractDetail.SignDate);
      }
    } else {
      d1 = addDays(contractDetail.SignDate, 7);
      d2 = addDays(exdata.startDate, -30);
      d3 = addDays(exdata.startDate, -15);
      if (d1 > new Date(exdata.startDate)) {
        d1 = new Date(contractDetail.SignDate);
      }
      if (d2 < new Date(contractDetail.SignDate)) {
        d2 = new Date(contractDetail.SignDate);
      }
      if (d3 < new Date(contractDetail.SignDate)) {
        d3 = new Date(contractDetail.SignDate);
      }
    }
    setDue({
      due1: d1.toLocaleDateString(),
      due2: d2.toLocaleDateString(),
      due3: d3.toLocaleDateString(),
    });
  };

  const [pay, setPay] = useState({});

  const makePay = () => {
    let p1 =
      priceCorrection.other != 0
        ? contractDetail.Spaces < 36
          ? 5000
          : contractDetail.Spaces < 72
          ? 10000
          : 15000
        : 0;
    let p2 = (contractDetail.Volume - p1) / 2;
    setPay({ dep: p1, pay1: p2, pay2: p2 });
  };

  useEffect(() => {
    makeDue();
    makePay();
  }, [contractDetail.Volume]);

  useEffect(() => {
    setDue({});
    setPay({});
  }, [exhibition, contractDetail.CustomerID]);

  return (
    <section id="payment-term">
      <div className="border border-zinc-300 rounded-md relative">
        <div className="absolute bg-white px-2 py-1 -top-4 left-3 text-red-600">
          Payment Term
        </div>
        <div className="px-3 py-4 grid md:grid-cols-2 gap-x-2 mt-2">
          <div className="flex gap-2 items-center">
            <label htmlFor="pt1" className="w-[140px]">
              Deposit
            </label>
            <NumericFormat
              id="pt1"
              className={`border-none text-right w-full disabled:text-green-600`}
              thousandSeparator=","
              decimalSeparator="."
              decimalScale={2}
              disabled={true}
              value={Object.keys(pay).length > 0 ? pay.dep : ""}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="dd1" className="w-[140px]">
              Due Date
            </label>
            <input
              id="dd1"
              className={`border-none text-right w-full disabled:text-red-600`}
              disabled={true}
              value={Object.keys(due).length > 0 ? due.due1 : ""}
            />
          </div>

          <div className="flex gap-2 items-center">
            <label htmlFor="pt2" className="w-[140px]">
              Payment 1
            </label>
            <NumericFormat
              id="pt2"
              className={`border-none text-right w-full disabled:text-green-600`}
              thousandSeparator=","
              decimalSeparator="."
              decimalScale={2}
              disabled={true}
              value={Object.keys(pay).length > 0 ? pay.pay1 : ""}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="dd2" className="w-[140px]">
              Due Date
            </label>
            <input
              id="dd2"
              className={`border-none text-right w-full disabled:text-red-600`}
              disabled={true}
              value={Object.keys(due).length > 0 ? due.due2 : ""}
            />
          </div>

          <div className="flex gap-2 items-center">
            <label htmlFor="pt3" className="w-[140px]">
              Payment 2
            </label>
            <NumericFormat
              id="pt3"
              className={`border-none text-right w-full disabled:text-green-600`}
              thousandSeparator=","
              decimalSeparator="."
              decimalScale={2}
              disabled={true}
              value={Object.keys(pay).length > 0 ? pay.pay2 : ""}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="dd3" className="w-[140px]">
              Due Date
            </label>
            <input
              id="dd3"
              className={`border-none text-right w-full disabled:text-red-600`}
              disabled={true}
              value={Object.keys(due).length > 0 ? due.due3 : ""}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PaymentTerm;
