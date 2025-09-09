import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function BuyingPeriodChart(props) {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const [data, setData] = useState([]);

  const options = {
    title: "Buying Period",
    legend: {
      position: "bottom",
    },
    series: {
      0: { type: "bars", targetAxisIndex: 0, color: "#dfaf5e" },
      1: { type: "line", targetAxisIndex: 1 },
    },
    vAxes: {
      0: { title: "Tr Percent", format: "percent" },
      1: { title: "Volume", format: "long" },
    },
    hAxis: {
      title: "Hour",
    },
    height: 400,
  };

  const [cat, setCat] = useState([]);

  //find unique value
  const getUnique = () => {
    pData.map((d, i) => {
      let hour = d.buyingTime.substring(
        d.buyingTime.indexOf("T") + 1,
        d.buyingTime.indexOf("T") + 3
      );
      d.Hour = hour;
    });
    let ic = [];
    pData.map((d, i) => {
      if (d.Hour != undefined) {
        ic.push(d.Hour);
      }
    });
    let uniqueCat = [...new Set(ic)];
    uniqueCat.sort((a, b) => a - b);
    setCat(uniqueCat);
  };
  ///////

  const sumData = () => {
    let dat = [["Hour", "TrPercent", "Volume"]];
    cat.map((ic, i) => {
      let dic = pData.filter((d) => d.Hour == ic);
      let tt = d3.count(pData, (d) => d.trId);
      let qty = d3.count(dic, (d) => d.trId);
      let vol = d3.sum(dic, (d) => d.volume);

      dat.push([ic.toString(), qty / tt, vol]);
    });
    //console.log(dat);
    setData(dat);
  };

  useEffect(() => {
    if (pData.length > 0) {
      getUnique();
    }
  }, [pData]);

  useEffect(() => {
    sumData();
  }, [cat]);

  return (
    <Chart
      chartType="ComboChart"
      data={data}
      options={options}
      width={"100%"}
    />
  );
}
