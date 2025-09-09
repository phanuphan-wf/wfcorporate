import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function MediaReturnChart(props) {
  const [pData, setPdata] = useState([]);
  const [budget, setBudget] = useState([]);

  useEffect(() => {
    setPdata(props.data);
    setBudget(props.budget);
  }, [props]);

  const [data, setData] = useState([]);

  const options = {
    title: "Media Return",
    legend: {
      position: "bottom",
    },
    series: {
      0: { type: "bars", targetAxisIndex: 0, color: "#8fae93" },
      1: { type: "line", targetAxisIndex: 1 },
      2: { type: "line", targetAxisIndex: 1 },
    },
    vAxes: {
      0: { title: "Awareness", format: "percent" },
      1: { title: "Volume", format: "long" },
    },
    hAxis: {
      title: "Media",
    },
    height: 400,
  };

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
  const [cat, setCat] = useState([]);

  //find unique value
  const getUnique = () => {
    let ic = [];
    pData.map((d, i) => {
      if (d.day != undefined) {
        ic.push(d.day);
      }
    });
    const uniqueCat = [...new Set(ic)];
    setCat(uniqueCat);
  };
  ///////

  const sumData = () => {
    let dat = [
      [
        "Media",
        "Awareness",
        { type: "string", role: "annotation" },
        "Volume",
        "Budget",
      ],
    ];
    let raw = [];
    media.map((m, i) => {
      let qty = d3.sum(pData, (d) => d[m.id]);
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

      if (qty != 0) {
        raw.push({ m: m.col, q: qty, v: vol, b: bg });
      }
    });
    raw.sort((a, b) => b.q - a.q);
    let tt = pData.filter((d) => d.accept != null).length;

    raw.map((r) => {
      dat.push([r.m, r.q / tt, Math.round((r.q / tt) * 100) + "%", r.v, r.b]);
    });
    setData(dat);
  };

  useEffect(() => {
    //console.log(pData);
  }, [pData]);

  useEffect(() => {
    if (pData.length > 0) {
      sumData();
    }
  }, [budget]);

  return (
    <Chart
      chartType="ComboChart"
      data={data}
      options={options}
      width={"100%"}
    />
  );
}
