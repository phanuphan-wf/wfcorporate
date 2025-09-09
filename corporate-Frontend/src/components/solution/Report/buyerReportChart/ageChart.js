import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function AgeChart(props) {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const [data, setData] = useState([]);

  const options = {
    title: "Buyer Age",
    hAxis: {
      title: "Qty",
      format: "#%",
    },
    vAxis: {
      title: "Age",
    },
    colors: ["#c2a887"],
    height: 400,
  };

  const initAge = [
    { col: "<20", min: 0, max: 19 },
    { col: "20-29", min: 20, max: 29 },
    { col: "30-39", min: 30, max: 39 },
    { col: "40-49", min: 40, max: 49 },
    { col: "50-59", min: 50, max: 59 },
    { col: "60-69", min: 60, max: 69 },
    { col: ">70", min: 70, max: 200 },
  ];
  const [age, setAge] = useState(initAge);

  const sumData = () => {
    let dat = [["Age", "Qty"]];
    let tt = d3.count(pData, (d) => d.age);
    age.map((a) => {
      let dic = pData.filter((d) => d.age >= a.min && d.age <= a.max);
      let qty = d3.count(dic, (d) => d.age);
      dat.push([a.col, qty / tt]);
    });

    setData(dat);
    //console.log(dat);
  };

  useEffect(() => {
    if (pData.length > 0) {
      sumData();
    }
  }, [pData]);

  return (
    <Chart chartType="BarChart" data={data} options={options} width={"100%"} />
  );
}
