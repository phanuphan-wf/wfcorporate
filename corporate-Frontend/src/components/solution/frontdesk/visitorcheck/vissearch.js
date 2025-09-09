import React, { useState, useEffect } from "react";
import Axios from "axios";
import { BiSolidDownArrow } from "react-icons/bi";
import useHeader from "../../../hook/useHeader";

export default function VisSearch(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_frontdesk;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [cmbSearch, setCmcSearch] = useState("0");
  const [textSearch, setTextSearch] = useState("");
  const initVisData = { name: "", id: "", mobile: "", receive: "", sms: "" };
  const [visData, setVisData] = useState([initVisData]);
  const [visChange, setVisChange] = useState(false);

  useEffect(() => {
    setVisData([initVisData]);
  }, [props.reset]);

  async function onVisSearch() {
    if (cmbSearch === "0") {
      try {
        const res = await Axios.get(
          url + "/visname/" + textSearch.replaceAll(" ", "")
        ).then((result) => {
          setVisData(result.data);
        });
      } catch (err) {
        setVisData([initVisData]);
      }
    } else {
      try {
        const res = await Axios.get(
          url + "/vismobile/" + textSearch.replaceAll(" ", "")
        ).then((result) => {
          setVisData(result.data);
        });
      } catch (err) {
        setVisData([initVisData]);
      }
    }
  }

  useEffect(() => {
    if (visData.length > 0) {
      let arr = visData;
      arr.map((data) => {
        if (data.receive) {
          var yea = data.receive.substring(0, 4);
          var mon = data.receive.substring(5, 7);
          var dat = data.receive.substring(8, 10);
          data.receive =
            dat + "/" + mon + "/" + yea + data.receive.substring(10);
        }
        if (data.sms === "0") {
          data.sms = "OK";
        } else if (data.sms === "505") {
          data.sms = "Wrong";
        } else {
          data.sms = "";
        }
      });
      setVisData(arr);
      setVisChange(!visChange);
    }
  }, [visData]);

  return (
    <div className="visitor-search border-t">
      <div className="text-lg md:text-xl font-medium my-2">Visitor Data</div>
      <div>
        <label for="searchtxt">Search by</label>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="flex gap-2 items-center border border-gray-300 rounded-md overflow-hidden h-[2.3rem] grow">
            <div className="flex gap-1 items-center justify-end bg-gray-400 m-0 rounded-none h-[2.4rem] pr-1 text-white">
              <select
                id="searchby"
                dir="rtl"
                className="pl-2 bg-transparent text-right"
                onChange={(e) => setCmcSearch(e.target.value)}
              >
                <option value="0">name/surname</option>
                <option value="1">mobile</option>
              </select>
              <div className="text-xs">
                <BiSolidDownArrow />
              </div>
            </div>
            <input
              id="searchtxt"
              placeholder="Enter search text"
              className="border-0 focus:shadow-none focus:border-0 w-full"
              onChange={(e) => setTextSearch(e.target.value)}
            />
          </div>
          <div className="btn-primary w-1/3 md:w-1/6" onClick={onVisSearch}>
            Search
          </div>
        </div>
      </div>
      <div className="my-3 overflow-x-scroll w-full">
        <table className="w-fit sm:w-full text-sm sm:text-base">
          <thead>
            <tr>
              <th className="border bg-slate-300">Status</th>
              <th className="border bg-slate-300">VisitorCode</th>
              <th className="border bg-slate-300">Name</th>
              <th className="border bg-slate-300">Mobile</th>
              <th className="border bg-slate-300">Date</th>
              <th className="border bg-slate-300">Time</th>
              <th className="border bg-slate-300">MobileCheck</th>
            </tr>
          </thead>
          <tbody>
            {visData.map((data) => (
              <tr className="even:bg-slate-200 [&>td]:even:border-white">
                <td
                  className={`border h-[1.8rem] ${
                    data.receive && "bg-red-200"
                  }`}
                >
                  {data.receive && "Received"}
                </td>
                <td
                  className={`border h-[1.8rem] ${
                    data.receive && "bg-red-200"
                  }`}
                >
                  {data.id}
                </td>
                <td
                  className={`border h-[1.8rem] ${
                    data.receive && "bg-red-200"
                  }`}
                >
                  {data.name}
                </td>
                <td
                  className={`border h-[1.8rem] ${
                    data.receive && "bg-red-200"
                  }`}
                >
                  {data.mobile}
                </td>
                <td
                  className={`border h-[1.8rem] ${
                    data.receive && "bg-red-200"
                  }`}
                >
                  {data.receive &&
                    data.receive.substring(0, data.receive.search("T"))}
                </td>
                <td
                  className={`border h-[1.8rem] ${
                    data.receive && "bg-red-200"
                  }`}
                >
                  {data.receive &&
                    data.receive.substring(
                      data.receive.search("T") + 1,
                      data.receive.search("T") + 6
                    )}
                </td>
                <td
                  className={`border h-[1.8rem] ${
                    data.receive && "bg-red-200"
                  }`}
                >
                  <div className="grid justify-items-center">
                    {data.sms == "OK" ? (
                      <div className="text-white text-center bg-green-500 rounded-full p-1 text-sm w-4/5">
                        OK
                      </div>
                    ) : data.sms == "Wrong" ? (
                      <div className="text-white text-center bg-red-500 rounded-full p-1 text-sm w-4/5">
                        Wrong
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
