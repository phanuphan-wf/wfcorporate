import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function RoasTable(props) {
  const [pData, setPdata] = useState([]);
  const [budget, setBudget] = useState([]);

  useEffect(() => {
    setPdata(props.data);
    setBudget(props.budget);
  }, [props]);

  const [data, setData] = useState([]);

  const initMedia = [
    {
      col: "TV",
      id: "tv",
    },
    {
      col: "Billboard",
      id: "billboard",
    },
    {
      col: "Cutout",
      id: "cutout",
    },
    {
      col: "Facebook",
      id: "facebook",
    },
    {
      col: "Google",
      id: "google",
    },
    {
      col: "Youtube",
      id: "youtube",
    },
    {
      col: "Line",
      id: "line",
    },
    {
      col: "tiktok",
      id: "tiktok",
    },
    {
      col: "เพื่อนและครอบครัว",
      id: "friend",
    },
    {
      col: "SMS",
      id: "sms",
    },
    {
      col: "อื่นๆ",
      id: "other",
    },
    {
      col: "หนังสือพิมพ์",
      id: "newspaper",
    },
    {
      col: "วิทยุ",
      id: "radio",
    },
  ];
  const [media, setMedia] = useState(initMedia);

  const sumData = () => {
    let dat = [];
    let raw = [];
    media.map((m, i) => {
      let vol = d3.sum(
        pData.filter((d) => d[m.id] == 1),
        (d) => d.volume
      );
      let bg = 0;
      if (budget.length > 0) {
        bg = budget.filter((b) => b.ads == m.id)[0];
        if (bg == undefined) {
          bg = 0;
        } else {
          bg = bg.budget;
        }
      }

      if (bg != 0) {
        raw.push({
          m: m.col,
          v: vol.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
          b: bg.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
          r: (vol / bg).toFixed(2),
        });
      }
    });
    raw.sort((a, b) => b.r - a.r);
    setData(raw);
  };

  useEffect(() => {
    //if (pData.length > 0) {
    //sumData();
    //}
  }, [pData]);

  useEffect(() => {
    if (pData.length > 0) {
      sumData();
    }
  }, [budget]);

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th rowSpan={2} className="border bg-[#9BABB8] text-white">
              Media
            </th>
            <th colSpan={3} className="border bg-[#9BABB8] text-white">
              ROAS
            </th>
          </tr>
          <tr>
            <th className="border bg-[#9BABB8] text-white">ROAS</th>
            <th className="border bg-[#9BABB8] text-white">Volume</th>
            <th className="border bg-[#9BABB8] text-white">Budget</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td className="border">{d.m}</td>
              <td className="border px-1 text-right bg-[#C4D7B2]">{d.r}</td>
              <td className="border px-1 text-right">{d.v}</td>
              <td className="border px-1 text-right">{d.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
