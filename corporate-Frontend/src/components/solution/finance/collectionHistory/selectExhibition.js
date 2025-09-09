import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";

import CorrectDate from "../correctDate";

import { dataContext } from "./collectionHistory";

function SelectExhibition() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cht;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { exhibitionC } = useContext(dataContext);

  const [exhibition, setExhibition] = exhibitionC;

  const [exhibitionlist, setExhibitionlist] = useState([]);
  const [past, setPast] = useState(false);

  const getExhibition = async (past) => {
    try {
      const res = await Axios.get(url + "/getExhibition/" + past).then((r) =>
        setExhibitionlist(r.data)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getExhibition(past);
    document.getElementById("eName").value = 0;
    setExhibition({});
  }, [past]);

  useEffect(() => {
    //console.log(exhibition);
  }, [exhibition]);

  const selectEx = (v) => {
    const ex = exhibitionlist.filter((e) => e.code === v)[0];
    setExhibition(ex);
  };

  const location = useLocation();

  var exId;

  if (location.state) {
    ({ exId } = location.state);
  }

  useEffect(() => {
    if (exhibitionlist.length !== 0) {
      if (exId) {
        document.getElementById("eName").value = exId;
        selectEx(exId);
      }
    }
  }, [exhibitionlist]);

  return (
    <section id="select-exhibition">
      <div className="border border-zinc-300 rounded-md relative">
        <div className="absolute bg-white px-2 py-1 -top-4 left-3 text-red-600">
          Exhibition
        </div>
        <div>
          <div className="flex flex-col gap-2 px-3 py-4">
            <div className="flex items-center">
              <label htmlFor="eName" className="w-[140px]">
                Exhibition Name
              </label>

              <select
                id="eName"
                className="cmb"
                onChange={(e) => selectEx(e.target.value)}
              >
                <option value="0">----</option>
                {exhibitionlist.map((e, i) => (
                  <option key={e.i} value={e.code}>
                    {e.name + " (" + e.code + ")"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="vName" className="w-[140px]">
                Venue
              </label>
              <span>{exhibition.venue ? exhibition.venue : ""}</span>
            </div>
            <div className="flex items-center">
              <label htmlFor="during" className="w-[140px]">
                During
              </label>
              <span>
                {exhibition.sDate
                  ? CorrectDate(exhibition.sDate, "s") +
                    " - " +
                    CorrectDate(exhibition.eDate, "s")
                  : ""}
              </span>
            </div>

            <div className="flex w-full justify-end items-center">
              <input
                type="checkbox"
                id="eFinish"
                className="accent-red-500"
                onChange={(e) => setPast(!past)}
              />
              <label htmlFor="eFinish" className="ml-2">
                Show Finished Exhibition
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SelectExhibition;
