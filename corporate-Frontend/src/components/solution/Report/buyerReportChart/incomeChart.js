import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function IncomeChart(props) {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const [data, setData] = useState([]);

  const options = {
    title: "Buyer Income",
    hAxis: {
      title: "Qty",
      format: "#%",
    },
    vAxis: {
      title: "income",
    },
    legend: {
      position: "none",
    },
    colors: ["#dfaf5e"],
  };

  const [income, setIncome] = useState([]);

  //find unique value
  const getUnique = () => {
    let ic = [];
    pData.map((d, i) => {
      ic.push(d.income);
    });
    const uniqueIncome = [...new Set(ic)];
    setIncome(uniqueIncome);
  };
  ///////

  const sumData = () => {
    let income = [
      "<15,000",
      "15,000-30,000",
      "30,000-50,000",
      "50,000-70,000",
      "70,000-90,000",
      "90,000-120,000",
      ">120,000",
    ];
    let dat = [["Income", "Qty"]];
    income.map((ic, i) => {
      let tt = d3.count(
        pData.filter((d) => d.income != undefined),
        (d) => d.trId
      );
      let qty = d3.count(
        pData.filter((d) => d.income == ic),
        (d) => d.trId
      );
      dat.push([ic, qty / tt]);
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
