import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function Income_OccuChart(props) {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const [data, setData] = useState([]);

  const options = {
    title: "Buyer Occupation & Income",
    hAxis: {
      title: "Qty",
      format: "#%",
    },
    vAxis: {
      title: "income",
    },
    legend: {
      position: "right",
    },
    isStacked: "percent",
    displayAnnotations: true,
    height: 500,
    chartArea: {
      height: "75%",
    },
  };

  const [cat, setCat] = useState([]);

  //find unique value
  const getUnique = () => {
    let ic = [];
    pData.map((d, i) => {
      if (d.occupation != undefined) {
        ic.push(d.occupation);
      }
    });
    const uniqueCat = [...new Set(ic)];
    setCat(uniqueCat);
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

    let dat = [["Income"]];
    cat.map((c, i) => {
      dat[0].push(c);
    });
    income.map((ic, i) => {
      let arr = [];
      let dic = pData.filter((d) => d.income == ic);
      arr.push(ic);
      //console.log(dic);
      cat.map((c, ix) => {
        //console.log(dic);
        let qty = d3.count(
          dic.filter((d) => d.occupation == c),
          (d) => d.trId
        );
        arr.push(qty);
      });

      dat.push(arr);
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
    <Chart chartType="BarChart" data={data} options={options} width={"100%"} />
  );
}
