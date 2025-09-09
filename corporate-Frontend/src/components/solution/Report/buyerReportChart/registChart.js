import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function RegistChart(props) {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const [data, setData] = useState([]);

  const options = {
    title: "Buyer Registration",

    hAxis: {
      title: "Qty",
      format: "#%",
    },
    vAxis: {
      title: "Registration Type",
    },
    legend: {
      position: "none",
    },
    colors: ["#61714d"],
  };

  //find unique value
  const getUnique = () => {
    let uni = [];
    pData.map((d, i) => {
      uni.push(d.received);
    });
    const uniqueCat = [...new Set(uni)];
    return uniqueCat;
  };
  ///////

  const sumData = () => {
    //console.log(pData);
    let dat = [["Regist", "Qty"]];
    let receive = getUnique();

    let raw = []; //add for make sorting before push data to dat
    receive.map((r, i) => {
      let tt = d3.count(pData, (d) => d.trId);
      let qty = d3.count(
        pData.filter((d) => d.received == r),
        (d) => d.trId
      );

      raw.push({ rec: r == undefined ? "not regist" : r, qty: qty / tt });
    });
    //console.log(raw);
    raw.sort((a, b) => a.qty - b.qty);
    raw.map((r, i) => {
      dat.push([r.rec, r.qty]);
    });
    setData(dat);
  };

  useEffect(() => {
    if (pData.length > 0) {
      sumData();
    }
  }, [pData]);

  return (
    <Chart
      chartType="BarChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
  );
}
