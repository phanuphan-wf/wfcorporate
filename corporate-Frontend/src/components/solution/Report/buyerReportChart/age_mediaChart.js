import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function Age_MediaChart(props) {
  const [data, setData] = useState([]);

  const options = {
    title: "Buyer Age & Media",
    hAxis: {
      title: "Percent",
      format: "#%",
    },
    vAxis: {
      title: "Age",
    },
    legend: {
      position: "right",
    },
    isStacked: "percent",
    height: 400,
    chartArea: {
      height: "75%",
    },
  };

  //find unique value
  const getUnique = (m) => {
    let ic = [];
    pData.map((d, i) => {
      if (d[m] != undefined) {
        ic.push(d[m]);
      }
    });
    const uniqueCat = [...new Set(ic)];
    return uniqueCat;
  };
  ///////

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
    {
      col: "BTS",
      id: "bts",
    },
  ];

  const initAge = [
    { col: "<20", min: 0, max: 19 },
    { col: "20-29", min: 20, max: 29 },
    { col: "30-39", min: 30, max: 39 },
    { col: "40-49", min: 40, max: 49 },
    { col: "50-59", min: 50, max: 59 },
    { col: "60-69", min: 60, max: 69 },
    { col: ">70", min: 70, max: 200 },
  ];
  const [media, setMedia] = useState(initMedia);
  const [age, setAge] = useState(initAge);

  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const sumData = () => {
    let dat = [["Age"]];
    let mc = mediaCheck();
    mc.map((m) => {
      dat[0].push(m.col);
    });
    age.map((a, i) => {
      let arr = [];
      let dic = pData.filter((d) => d.age >= a.min && d.age <= a.max);
      arr.push(a.col);
      mc.map((m, ix) => {
        //console.log(dic);
        let qty = d3.sum(dic, (d) => d[m.id]);
        arr.push(qty);
      });

      dat.push(arr);
    });
    //console.log(dat);
    setData(dat);
  };

  useEffect(() => {
    if (pData.length > 0) {
      sumData();
    }
  }, [pData]);

  const mediaCheck = () => {
    let newm = [];
    media.map((m) => {
      let check = 0;
      check = d3.sum(pData, (d) => d[m.id]);
      if (check != 0) {
        newm.push(m);
      }
    });
    return newm;
  };

  return (
    <Chart chartType="BarChart" data={data} options={options} width={"100%"} />
  );
}
