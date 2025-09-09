import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function ResidentChart(props) {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const [data, setData] = useState([]);

  const options = {
    title: "Buyer Resident",
    hAxis: {
      title: "Qty",
      format: "#%",
    },
    vAxis: {
      title: "Resident Type",
    },
    legend: {
      position: "none",
    },
    colors: ["#8fae93"],
  };

  //find unique value
  const getUnique = () => {
    let uni = [];
    pData.map((d, i) => {
      uni.push(d.resident);
    });
    const uniqueCat = [...new Set(uni)];
    return uniqueCat;
  };
  ///////

  const sumData = () => {
    let dat = [["Resident", "Qty"]];
    let resident = getUnique();

    let raw = []; //add for make sorting before push data to dat
    resident.map((r, i) => {
      if (r != undefined) {
        let tt = d3.count(pData, (d) => d.trId);
        let qty = d3.count(
          pData.filter((d) => d.resident == r),
          (d) => d.trId
        );
        raw.push({ res: r, qty: qty / tt });
      }
    });
    raw.sort((a, b) => b.qty - a.qty);
    raw.map((r, i) => {
      dat.push([r.res, r.qty]);
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
