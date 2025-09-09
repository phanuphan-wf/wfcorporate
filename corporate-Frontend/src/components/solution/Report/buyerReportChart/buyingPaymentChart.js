import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function BuyingPaymentChart(props) {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const [data, setData] = useState([]);

  const options = {
    title: "Buying Payment Type",
    legend: {
      position: "bottom",
    },
    series: {
      0: { type: "bars", targetAxisIndex: 0, color: "#537188" },
      1: { type: "line", targetAxisIndex: 1 },
    },
    vAxes: {
      0: { title: "Tr Percent", format: "percent" },
      1: { title: "Volume", format: "long" },
    },
    hAxis: {
      title: "Payment",
    },
    height: 400,
  };

  const [cat, setCat] = useState([]);

  //find unique value
  const getUnique = () => {
    let ic = [];
    pData.map((d, i) => {
      if (d.payment != undefined) {
        ic.push(d.payment);
      }
    });
    const uniqueCat = [...new Set(ic)];
    setCat(uniqueCat);
  };
  ///////

  const sumData = () => {
    let dat = [["Paymnet", "TrPercent", "Volume"]];
    let raw = [];
    cat.map((ic, i) => {
      let dic = pData.filter((d) => d.payment == ic);
      let tt = d3.count(pData, (d) => d.trId);
      let qty = d3.count(dic, (d) => d.trId);
      let vol = d3.sum(dic, (d) => d.volume);
      raw.push({ p: ic, q: qty / tt, v: vol });
    });
    raw.sort((a, b) => b.q - a.q);
    raw.map((r, i) => {
      dat.push([r.p, r.q, r.v]);
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
