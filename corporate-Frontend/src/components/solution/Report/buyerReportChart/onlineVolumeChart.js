import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as d3 from "d3";

export default function OnlineVolumeChart(props) {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    setPdata(props.data);
  }, [props.data]);

  const [data, setData] = useState([]);

  const options = {
    title: "Online Media Effective",
    minColor: "#009688",
    midColor: "#f7f7f7",
    maxColor: "#ee8100",
    headerHeight: 15,
    fontColor: "black",
    height: 500,
    generateTooltip: (row, size, value) => {
      return (
        '<div style="background:#fd9; padding:10px; border-style:solid; font-size:14px">' +
        "Media: " +
        data[row + 1][0] +
        "<br>Buying Percentage: " +
        (
          (size /
            d3.sum(
              data.filter((d) => d[1] == "media"),
              (d) => d[2]
            )) *
          100
        )
          .toFixed(2)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
        "%" +
        "<br>Buying Volume: " +
        size.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
        "</div>"
      );
    },
  };

  const [media, setMedia] = useState([]);
  const [campaign, setCampaign] = useState([]);
  const [type, setType] = useState([]);

  //find unique value
  const getUnique = (m) => {
    let ic = [];
    pData.map((d, i) => {
      if (d[m] != undefined) {
        ic.push(d[m]);
      }
    });
    const uniqueCat = [...new Set(ic)];
    return uniqueCat;
  };
  ///////

  const sumData = () => {
    let dat = [
      ["Media", "Parent", "Volume", "color"],
      ["media", null, 0, 0],
    ];
    media.map((m, i) => {
      let md = pData.filter((d) => d.source == m);
      let vol = d3.sum(md, (d) => d.volume);

      dat.push([m, "media", vol, 240 * Math.random()]);
      campaign.map((c, ic) => {
        let cd = md.filter((d) => d.campaign == c);
        let volc = d3.sum(cd, (d) => d.volume);
        dat.push([m + "-" + c, m, volc, 240 * Math.random()]);
        type.map((t, it) => {
          let td = cd.filter((d) => d.adstype == t);
          let volt = d3.sum(td, (d) => d.volume);
          dat.push([
            m + "-" + c + "-" + t,
            m + "-" + c,
            volt,
            240 * Math.random(),
          ]);
        });
      });
    });
    //console.log(dat);
    setData(dat);
  };

  useEffect(() => {
    if (pData.length > 0) {
      setMedia(getUnique("source"));
      setCampaign(getUnique("campaign"));
      setType(getUnique("adstype"));
    }
  }, [pData]);

  useEffect(() => {
    sumData();
  }, [type]);

  return (
    <Chart chartType="TreeMap" data={data} options={options} width={"100%"} />
  );
}
