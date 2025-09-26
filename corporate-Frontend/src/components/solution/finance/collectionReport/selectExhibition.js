// src/components/solution/finance/collectionReport/selectExhibition.js
import { useState, useEffect, useContext } from "react";
import Axios from "axios";

import { dataContext } from "./report";

import CorrectDate from "../../../hook/correctDate";

export default function SelectExhibition() {
  const { filterC } = useContext(dataContext);

  const [filter, setFilter] = filterC;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_clr;

  const [exhibition, setExhibtion] = useState([]);
  const [past, setPast] = useState(false);

  const getExhibition = async () => {
    const res = await Axios.get(url + "/getExhibition/" + past).then((r) => {
      if (r.status === 200) {
        setExhibtion(r.data);
      }
    });
  };

  useEffect(() => {
    getExhibition();
  }, [past]);

  const [show, setShow] = useState({});

  useEffect(() => {
    if (filter.exID != 0 || filter.exID != "") {
      console.log(exhibition.filter((x) => x.code == filter.exID));
      setShow(exhibition.filter((x) => x.code == filter.exID)[0]);
    } else {
      setShow({});
    }
  }, [filter.exID]);

  useEffect(() => {
    console.log(show);
  }, [show]);

  return (
    <section id="select-exhibition ">
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
                onChange={(e) =>
                  setFilter({ ...filter, exID: e.target.value })
                }>
                <option value="0">----</option>
                {exhibition.length &&
                  exhibition.map((d, i) => (
                    <option value={d.code}>
                      {d.name + " (" + d.code + ")"}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="vName" className="w-[140px]">
                Venue
              </label>
              <span>{show && Object.keys(show).length > 0 && show.venue}</span>
            </div>
            <div className="flex items-center">
              <label htmlFor="during" className="w-[140px]">
                During
              </label>
              <span>
                {show &&
                  Object.keys(show).length > 0 &&
                  CorrectDate(show.sDate) + " - " + CorrectDate(show.eDate)}
              </span>
            </div>

            <div className="flex w-full justify-end items-center">
              <input
                type="checkbox"
                id="eFinish"
                className="accent-red-500 size-4"
                onChange={() => setPast(!past)}
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
