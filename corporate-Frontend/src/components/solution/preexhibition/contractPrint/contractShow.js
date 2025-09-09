import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { dataContext } from "./contractPrint";

export default function ContractShow() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctp;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { contractC, selectShowC } = useContext(dataContext);

  const [contract, setContract] = contractC;
  const [selectShow, setSelectShow] = selectShowC;

  const [show, setShow] = useState([]);

  const getShow = async () => {
    const res = await Axios.get(url + "/getExhibition/false").then((res) => {
      let data = res.data;
      data.map((d) => {
        if (extMonth(d.startDate) === extMonth(d.endDate)) {
          d.date =
            extDay(d.startDate) +
            "-" +
            extDay(d.endDate) +
            " " +
            extMonth(d.startDate) +
            " " +
            extYear(d.startDate);
        } else {
          d.date =
            extDay(d.startDate) +
            " " +
            extMonth(d.startDate) +
            " - " +
            extDay(d.endDate) +
            " " +
            extMonth(d.endDate) +
            " " +
            extYear(d.startDate);
        }
      });
      setShow(data);
    });
  };

  useEffect(() => {
    getShow();
  }, []);

  const smonth = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const extDay = (d) => {
    let da = d.substring(d.search("-") + 4, d.indexOf("T", d.search("-") + 4));

    return parseInt(da);
  };

  const extMonth = (d) => {
    let mo = d.substring(d.indexOf("-") + 1, d.indexOf("-") + 3);

    return smonth[mo - 1];
  };

  const extYear = (d) => {
    let ye = d.substring(0, d.search("-"));
    return parseInt(ye) + 543;
  };

  useEffect(() => {
    //console.log("show", show);
  }, [show]);

  const onExhibitionSelect = (ex) => {
    let e = show.find((e) => e.exhibitionID == ex);
    setContract({
      ...contract,
      exname: e.name,
      venue: e.venueName,
      date: e.date,
      time: e.showTime,
    });
    setSelectShow(e);
  };

  return (
    <section id="contract-show">
      <div className="my-1 flex items-center">
        <label htmlFor="cmb-exhibition" className="w-[150px]">
          งานแสดงสินค้า
        </label>
        <select
          className="cmb"
          id="cmb-exhibition"
          onChange={(e) => onExhibitionSelect(e.target.value)}
        >
          <option value="0" selected disabled hidden>
            select exhibition
          </option>
          {show.map((e, i) => (
            <option key={i} value={e.exhibitionID}>
              {e.name + " (" + e.exhibitionID + ")"}
            </option>
          ))}
        </select>
      </div>
      <div className="my-1 flex items-center">
        <label htmlFor="txt-venue" className="w-[150px]">
          สถานที่จัดแสดงสินค้า
        </label>
        <input
          type="text"
          id="txt-venue"
          className="w-[400px]"
          value={contract.venue}
        />
      </div>
      <div className="my-1 flex items-center max-sm:flex-wrap gap-3">
        <div className="flex items-center">
          <label htmlFor="txt-showdate" className="w-[150px]">
            วันที่จัดแสดง
          </label>
          <input
            type="text"
            id="txt-showdate"
            className="w-[300px]"
            value={contract.date}
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="txt-showdate" className="w-[150px]">
            เวลาจัดแสดง
          </label>
          <input
            type="text"
            id="txt-showdate"
            className="w-[300px]"
            value={contract.time}
          />
        </div>
      </div>
    </section>
  );
}
