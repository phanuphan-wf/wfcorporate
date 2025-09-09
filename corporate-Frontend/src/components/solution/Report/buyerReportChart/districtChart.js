import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function DistrictChart(props) {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const [data, setData] = useState([]);

  const options = {
    title: "Buyer Top 15 District",

    hAxis: {
      title: "Qty",
      format: "#%",
    },
    vAxis: {
      title: "District",
    },
    legend: {
      position: "none",
    },
    colors: ["#a9b388"],
    height: 500,
  };

  //find unique value
  const getUnique = () => {
    let uni = [];
    pData.map((d, i) => {
      uni.push(d.district);
    });
    const uniqueCat = [...new Set(uni)];
    return uniqueCat;
  };
  ///////

  const sumData = () => {
    let dat = [["District", "Qty"]];
    let Col = getUnique();

    //console.log(province);

    let raw = []; //add for make sorting before push data to dat
    Col.map((r, i) => {
      if (r != "") {
        let tt = d3.count(pData, (d) => d.trId);
        let qty = d3.count(
          pData.filter((d) => d.district == r),
          (d) => d.trId
        );

        raw.push({ col: r, qty: qty / tt });
      }
    });
    //console.log(raw);
    raw.sort((a, b) => b.qty - a.qty);
    raw.map((r, i) => {
      if (i < 15) {
        dat.push([r.col, r.qty]);
      }
    });
    setData(dat);
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
