import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function Occu_MediaChart(props) {
  const [data, setData] = useState([]);

  const options = {
    title: "Buyer Occupation & Media",
    hAxis: {
      title: "Percent",
      format: "#%",
    },
    vAxis: {
      title: "Occupation",
    },
    legend: {
      position: "right",
    },
    isStacked: "percent",
    height: 500,
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
  ];
  const [media, setMedia] = useState(initMedia);
  const [occu, setOccu] = useState([]);

  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const sumData = () => {
    let dat = [["Occupation"]];
    let mc = mediaCheck();
    mc.map((m) => {
      dat[0].push(m.col);
    });
    occu.map((o, i) => {
      let arr = [];
      let dic = pData.filter((d) => d.occupation == o);
      arr.push(o);
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
      setOccu(getUnique("occupation"));
    }
  }, [pData]);

  useEffect(() => {
    if (occu.length > 0) {
      sumData();
    }
  }, [occu]);

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
