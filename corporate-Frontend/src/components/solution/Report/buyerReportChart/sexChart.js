import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function SexChart(props) {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const [data, setData] = useState([]);

  const options = {
    title: "Buyer Sex",
    height: 400,
  };

  const sumData = () => {
    //console.log(pData);
    let dat = [];
    let male = d3.count(
      pData.filter((d) => d.sex == "Male"),
      (d) => d.trId
    );
    let female = d3.count(
      pData.filter((d) => d.sex == "Female"),
      (d) => d.trId
    );
    dat = [
      ["Sex", "Qty"],
      ["Male", male],
      ["Female", female],
    ];
    setData(dat);
    //console.log(dat);
  };

  useEffect(() => {
    if (pData.length > 0) {
      sumData();
    }
  }, [pData]);

  return (
    <Chart chartType="PieChart" data={data} options={options} width={"100%"} />
  );
}
