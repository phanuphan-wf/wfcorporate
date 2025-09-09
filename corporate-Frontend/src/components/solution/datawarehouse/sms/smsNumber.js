import React, { createContext, useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import NumberType from "./numberType";
import ShowList from "./showList";

export const dataContext = createContext();

export default function SmsNumber(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_sms;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

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

  const [exType, setExType] = useState("ex");

  const [exSelected, setExSelected] = useState([]);

  useEffect(() => {
    //console.log(exSelected);
  }, [exSelected]);

  const [number, setNumber] = useState([]);

  const getNumber = async (ex) => {
    if (exSelected.length === 0) {
      alert("Select at least one show before proceeding");
      return;
    }

    const res = await Axios.post(url + getExTypePath(exType), exSelected).then(
      (r) => setNumber(r.data)
    );
  };

  const getExTypePath = (exType) => {
    switch (exType) {
      case "ex":
        return "/GetExhibitorTels";
      // Add other cases as needed
      case "buy":
        return "/GetBuyerTels";
      case "vis":
        return "/GetVisitorTels";
      default:
        return "/";
    }
  };

  useEffect(() => {
    setNumber([]);
  }, [exType]);

  useEffect(() => {
    //console.log(number);
  }, [number]);

  const copyToClipboard = () => {
    const textToCopy = number.join(",");
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Numbers copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <dataContext.Provider
      value={{
        url,
        bearer,
        exTypeC: [exType, setExType],
        exSelC: [exSelected, setExSelected],
      }}
    >
      <section id="smsnumber" className="xl:container">
        <div className="my-3">
          <h1 className="text-2xl">SMS Number</h1>
        </div>
        <div className="grid lg:grid-cols-3 gap-3">
          <NumberType />
          <ShowList />
          <div className="flex max-lg:justify-end lg:items-end gap-2">
            <button className="btn-green px-3" onClick={getNumber}>
              Show Number
            </button>
            <button className="btn-primary px-3" onClick={() => setNumber([])}>
              Clear
            </button>
          </div>
        </div>
        {number.length !== 0 ? (
          <div className="my-5">
            <div className="mb-4 flex justify-between px-4">
              <span>
                <strong>Total Number:</strong> {number.length}
              </span>
              <button
                className="border border-gray-400 text-gray-400 px-3 rounded-md"
                onClick={copyToClipboard}
              >
                copy
              </button>
            </div>
            <div className="border rounded-lg px-4 py-2 border-gray-300 relative">
              <div className="absolute -top-[12px] left-5 bg-white px-4">
                <h2 className="font-medium">Mobile Number</h2>
              </div>
              <div className="mt-4 break-words max-h-[400px] overflow-y-auto">
                {number.join(",")}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </section>
    </dataContext.Provider>
  );
}
