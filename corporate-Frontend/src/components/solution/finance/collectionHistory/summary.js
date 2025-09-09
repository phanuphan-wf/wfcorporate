import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { dataContext } from "./collectionHistory";

function Summary() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cht;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { exhibitionC, customerC, dataC } = useContext(dataContext);

  const [exhibition, setExhibition] = exhibitionC;
  const [customer, setCustomer] = customerC;
  const [data, setData] = dataC;

  const [volume, setVolume] = useState({});

  const getVolume = () => {
    let dat = { exid: exhibition.code, cid: customer[0].cid };
    Axios.post(url + "/getVolume", dat).then((res) => {
      setVolume(res.data);
    });
  };

  const [summary, setSummary] = useState({});
  useEffect(() => {
    if (data.length > 0) {
      getVolume();
      const sumAmount = data.reduce((acc, cur) => acc + cur.amount, 0);
      const sumTax = data.reduce((acc, cur) => acc + cur.tax, 0);
      const sum = sumAmount + sumTax;
      setSummary({ amount: sumAmount, tax: sumTax, summary: sum });
    }
  }, [data]);

  return (
    <section id="summary">
      <div className="md:w-3/4 flex max-md:flex-wrap gap-1 md:gap-5 ml-4">
        <div className="flex items-center gap-2">
          <label htmlFor="amount" className="w-[120px]">
            Total Amount
          </label>
          <span id="amount" className="text-right w-[100px]">
            {Object.keys(summary).length != 0
              ? summary.amount
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
              : "0.00"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="tax" className="w-[120px]">
            Total TAX
          </label>
          <span id="tax" className="text-right w-[100px]">
            {Object.keys(summary).length != 0
              ? summary.tax.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
              : "0.00"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sum" className="w-[120px]">
            Summary
          </label>
          <span id="sum" className="text-right w-[100px]">
            {Object.keys(summary).length != 0
              ? summary.summary
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
              : "0.00"}
          </span>
        </div>
      </div>
      <div className="border rounded-md md:w-2/3 relative mt-4">
        <div className="bg-white px-2 absolute -top-3 left-3">Balance</div>
        <div className="flex max-md:flex-wrap justify-around py-2">
          <div className="flex items-center gap-2">
            <label htmlFor="volume" className="w-[120px]">
              Total Volume
            </label>
            <span
              id="volume"
              className="text-right w-[140px] border-double border-b-2 border-green-600"
            >
              {Object.keys(volume).length != 0
                ? volume.volume
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                : "0.00"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="remain" className="w-[120px]">
              Remaining
            </label>
            <span
              id="remain"
              className="text-right w-[140px] border-double border-b-2 border-red-600"
            >
              {Object.keys(volume).length != 0
                ? (volume.volume - summary.summary)
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                : "0.00"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Summary;
