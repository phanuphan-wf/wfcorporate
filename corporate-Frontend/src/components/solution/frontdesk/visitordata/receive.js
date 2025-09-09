import React, { useEffect, useState, useRef } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

export default function Receive(props) {
  const [regist, setRegist] = useState({});
  const containerRef = useRef();

  useEffect(() => {
    if (regist === undefined) return;
    const plot = Plot.plot({
      y: { grid: true },
      marginTop: 40,
      marginLeft: 80,
      color: { scheme: "PuBuGn" },
      marks: [
        Plot.axisY({ label: "Registration" }),
        Plot.axisX({ label: "Present day" }),
        Plot.barY(regist, {
          x: "receive",
          y: "count",
          sort: "preregist",
          fill: "preregist",
          tip: true,
        }),
        Plot.ruleY([0]),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [regist]);

  useEffect(() => {
    //console.log(props.data);
    let dat = props.data;
    let registsum = [];
    dat.map((d) => {
      if (d.receive != null) {
        let day = d.receive.substring(0, d.receive.indexOf("T"));
        registsum.push({ count: 1, receive: day, preregist: d.preregist });
      }
    });
    setRegist(registsum);
  }, [props.data]);

  return (
    <div className="media-plot my-8">
      <div>Register Received</div>
      <div className="flex justify-center">
        <div ref={containerRef} />
      </div>
    </div>
  );
}
