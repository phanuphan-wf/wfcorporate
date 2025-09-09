import React, { useState, useEffect } from "react";
import useHeader from "../../hook/useHeader";
import Axios from "axios";

export default function NextExhibition() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_dbc;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [exNow, setExNow] = useState({});
  const [exlist, setExlist] = useState([]);

  const getExhibition = async () => {
    const res = await Axios.get(url + "/getExhibition").then((res) => {
      let data = res.data;
      let list = [];
      data.map((d, i) => {
        let startDate = new Date(d.startDate);
        startDate.setDate(startDate.getDate() - 3);
        if (startDate <= new Date()) {
          d.show = combileDate(d.startDate, d.endDate);
          setExNow(d);
        } else {
          d.show = combileDate(d.startDate, d.endDate);
          list.push(d);
        }
      });
      setExlist(list);
    });
  };

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

  const combileDate = (s, e) => {
    let d = "";
    if (extMonth(s) === extMonth(e)) {
      d = extDay(s) + "-" + extDay(e) + " " + extMonth(s) + " " + extYear(s);
    } else {
      d =
        extDay(s) +
        " " +
        extMonth(s) +
        " - " +
        extDay(e) +
        " " +
        extMonth(e) +
        " " +
        extYear(s);
    }
    return d;
  };

  useEffect(() => {
    getExhibition();
  }, []);

  useEffect(() => {
    //console.log("now", exNow);
  }, [exNow]);

  useEffect(() => {
    //console.log("list", exlist);
  }, [exlist]);

  return (
    <section id="nextExhibition">
      {exNow.name != undefined && (
        <div>
          <div className="w-full bg-gradient-to-r from-red-500 to-transparent to-[90%] text-white px-2 py-1.5 my-3">
            Now Exhibition
          </div>
          <div className="flex max-sm:flex-col items-center">
            <div className="w-full md:w-28 text-center">
              {exNow.exhibitionID}
            </div>
            <div className="sm:border-l w-full md:w-1/2 text-center">
              <div className="py-1 bg-gradient-to-r from-transparent via-red-500 to-transparent  text-white">
                {exNow.name}
              </div>
              <div className="py-1">{exNow.show}</div>
            </div>
            <div className="sm:border-l">
              <div className="py-1 pl-3">{exNow.venueName}</div>
              <div className="py-1 pl-3">{exNow.hall}</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="w-full bg-gradient-to-r from-green-600 to-transparent to-[90%] text-white px-2 py-1.5 my-3">
          Next Exhibition
        </div>
        {exlist.map((ex, i) => (
          <div
            key={i}
            className="last:border-b-0 border-b flex max-sm:flex-col items-center"
          >
            <div className="w-full md:w-28 text-center">{ex.exhibitionID}</div>
            <div className="sm:border-l w-full md:w-1/2 text-center">
              <div className="py-1 bg-gradient-to-r from-transparent via-green-600 to-transparent  text-white">
                {ex.name}
              </div>
              <div className="py-1">{ex.show}</div>
            </div>
            <div className="sm:border-l">
              <div className="py-1 pl-3">{ex.venueName}</div>
              <div className="py-1 pl-3">{ex.hall}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
