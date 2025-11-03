// src/components/solution/finance/collectionReport/selectExhibition.js
import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { dataContext } from "./report";
import CorrectDate from "../../../hook/correctDate";

export default function SelectExhibition() {
  const { filterC, eventC } = useContext(dataContext);
  const [filter, setFilter] = filterC;
  const [event, setEvent] = eventC;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_clr;

  const [exhibition, setExhibtion] = useState([]);
  const [past, setPast] = useState(false);
  const [show, setShow] = useState({});

  const getExhibition = async () => {
    try {
      const res = await Axios.get(url + "/getExhibition/" + past);
      if (res.status === 200) {
        setExhibtion(res.data);
      }
    } catch (err) {
      console.error("Error fetching exhibition:", err);
    }
  };

  // โหลดรายชื่อนิทรรศการใหม่เมื่อเปลี่ยนสถานะ past
  useEffect(() => {
    getExhibition();
  }, [past]);

  // อัปเดตข้อมูล show และ event เมื่อเลือกนิทรรศการใหม่
  useEffect(() => {
    if (filter.exID && filter.exID !== "0") {
      const selected = exhibition.find((x) => x.code === filter.exID);
      setShow(selected);
      setEvent(selected); // ✅ ส่งเฉพาะ event ที่เลือกไป context
    } else {
      setShow({});
      setEvent({});
    }
  }, [filter.exID, exhibition]);

  return (
    <section id="select-exhibition">
      <div className="border border-zinc-300 rounded-md relative">
        <div className="absolute bg-white px-2 py-1 -top-4 left-3 text-red-600">
          Exhibition
        </div>

        <div className="flex flex-col gap-2 px-3 py-4">
          {/* Exhibition Name */}
          <div className="flex items-center">
            <label htmlFor="eName" className="w-[140px]">
              Exhibition Name
            </label>
            <select
              id="eName"
              className="cmb"
              onChange={(e) => setFilter({ ...filter, exID: e.target.value })}
            >
              <option value="0">----</option>
              {exhibition.length > 0 &&
                exhibition.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name + " (" + d.code + ")"}
                  </option>
                ))}
            </select>
          </div>

          {/* Venue */}
          <div className="flex items-center">
            <label htmlFor="vName" className="w-[140px]">
              Venue
            </label>
            <span>{show?.venue ?? "-"}</span>
          </div>

          {/* During */}
          <div className="flex items-center">
            <label htmlFor="during" className="w-[140px]">
              During
            </label>
            <span>
              {show?.sDate && show?.eDate
                ? CorrectDate(show.sDate) + " - " + CorrectDate(show.eDate)
                : "-"}
            </span>
          </div>

          {/* Checkbox */}
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
    </section>
  );
}
