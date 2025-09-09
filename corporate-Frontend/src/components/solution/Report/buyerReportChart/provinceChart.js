import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function ProvinceChart(props) {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const [data, setData] = useState([]);

  const options = {
    title: "Buyer Top 10 Provinces",

    hAxis: {
      title: "Qty",
      format: "#%",
    },
    vAxis: {
      title: "Province",
    },
    legend: {
      position: "none",
    },
    colors: ["#b99470"],
  };

  //find unique value
  const getUnique = () => {
    let uni = [];
    pData.map((d, i) => {
      uni.push(d.province);
    });
    const uniqueCat = [...new Set(uni)];
    return uniqueCat;
  };
  ///////

  const sumData = () => {
    let dat = [["Province", "Qty"]];
    let province = getUnique();

    //console.log(province);

    let raw = []; //add for make sorting before push data to dat
    province.map((r, i) => {
      if (r != "") {
        let tt = d3.count(pData, (d) => d.trId);
        let qty = d3.count(
          pData.filter((d) => d.province == r),
          (d) => d.trId
        );

        raw.push({ pv: r, qty: qty / tt });
      }
    });
    //console.log(raw);
    raw.sort((a, b) => b.qty - a.qty);
    raw.map((r, i) => {
      if (i < 10) {
        dat.push([r.pv, r.qty]);
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
    <Chart
      chartType="BarChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
  );
}
