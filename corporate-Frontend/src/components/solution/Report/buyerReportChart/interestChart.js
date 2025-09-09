import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function InterestChart(props) {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const [data, setData] = useState([]);

  const options = {
    title: "Buyer Interest",
    pieHole: 0.5,
    slices: {
      0: { offset: 0.15 },
      1: { offset: 0.125 },
      2: { offset: 0.1 },
      3: { offset: 0.075 },
    },
    height: 400,
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
    let cat = [
      { name: "Elec_AV", cat: "e_av" },
      { name: "Elec_HA", cat: "e_ha" },
      { name: "Elec_Small", cat: "e_small" },
      { name: "Bedding", cat: "f_bed" },
      { name: "Dining", cat: "f_dining" },
      { name: "Fashion", cat: "f_fashion" },
      { name: "Food", cat: "f_food" },
      { name: "Kitchen", cat: "f_kitchen" },
      { name: "Living", cat: "f_living" },
      { name: "Sofa", cat: "f_sofa" },
      { name: "Working", cat: "f_working" },
      { name: "Garden", cat: "g_garden" },
      { name: "Decor", cat: "h_decor" },
      { name: "HomeProduct", cat: "h_homeproduct" },
      { name: "HomeMaterial", cat: "h_material" },
      { name: "Wedding", cat: "w_wedding" },
    ];
    let dat = [["Interest", "Qty"]];
    let raw = [];
    cat.map((c, i) => {
      let qty = d3.sum(pData, (d) => d[c.cat]);
      if (qty != undefined || qty != 0) {
        raw.push({ cat: c.name, qty: qty });
      }
    });
    raw.sort((a, b) => b.qty - a.qty);
    raw.map((r, i) => {
      dat.push([r.cat, r.qty]);
    });
    setData(dat);
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
