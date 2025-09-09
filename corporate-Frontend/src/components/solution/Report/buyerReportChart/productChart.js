import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function ProductChart(props) {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const [data, setData] = useState([]);
  const [product, setProduct] = useState([]);

  const options = {
    title: "Buying Products",

    hAxis: {
      title: "Sale Price",
    },
    vAxis: {
      title: "Product",
    },
    legend: {
      position: "none",
    },
    colors: ["#862B0D"],
    orientation: "vertical",
    height:
      product.length <= 5
        ? 400
        : product.length <= 10
        ? 600
        : product.length <= 20
        ? 800
        : 1000,
    chartArea: { top: 50, height: "75%" },
  };

  //find unique value
  const getUnique = () => {
    let uni = [];
    pData.map((d, i) => {
      uni.push(d.product);
    });
    let uniqueCat = [...new Set(uni)];
    uniqueCat.sort();
    return uniqueCat;
  };
  ///////

  const sumData = () => {
    let dat = [
      [
        "Product",
        "average",
        { type: "string", role: "style" },
        { type: "string", role: "tooltip" },
        { label: "min", role: "interval", type: "number" },
        { label: "max", role: "interval", type: "number" },
      ],
    ];
    let raw = []; //add for make sorting before push data to dat
    product.map((r, i) => {
      if (r != "") {
        let min = d3.min(
          pData.filter((d) => d.product == r),
          (d) => d.volume
        );
        let max = d3.max(
          pData.filter((d) => d.product == r),
          (d) => d.volume
        );
        let avg = d3.mean(
          pData.filter((d) => d.product == r),
          (d) => d.volume
        );
        let count = d3.count(
          pData.filter((d) => d.product == r),
          (d) => d.trId
        );

        dat.push([
          r,
          avg,
          "point {size: " +
            (count <= 4 ? 4 : count > 4 && count <= 30 ? count : 30) +
            "; fill-color: #FFD89C;}",
          r +
            "\nQty: " +
            count +
            ", Avg: " +
            avg +
            "\n min: " +
            min +
            ", max: " +
            max,
          min,
          max,
        ]);
      }
    });
    //console.log(dat);
    setData(dat);
  };

  useEffect(() => {
    if (pData.length > 0) {
      setProduct(getUnique());
    }
  }, [pData]);

  useEffect(() => {
    if (pData.length > 0) {
      sumData();
    }
  }, [product]);

  return (
    <Chart
      chartType="ScatterChart"
      data={data}
      options={options}
      width={"100%"}
    />
  );
}
