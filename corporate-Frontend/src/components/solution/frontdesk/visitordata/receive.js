import React, { useEffect, useState, useRef } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

export default function Receive(props) {
  const [regist, setRegist] = useState([]);
  const containerRef = useRef();

  useEffect(() => {
    if (regist === undefined) return;
    const dailyTotals = d3
      .flatRollup(
        regist,
        (visitors) => d3.sum(visitors, (d) => d.count),
        (d) => d.receive
      )
      .map(([receive, count]) => ({ receive, count }));
    const plot = Plot.plot({
      x: { type: "band" },
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
          title: (d) =>
            `${d.preregist ? "preregist" : "onsite visitor"}\n${d.receive}\ncount: ${d.count}`,
          tip: true,
        }),
        Plot.text(dailyTotals, {
          x: "receive",
          y: "count",
          text: (d) => d.count.toLocaleString(),
          dy: -12,
          fontWeight: "bold",
        }),
        Plot.ruleY([0]),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [regist]);

  useEffect(() => {
    const registsum = d3
      .flatRollup(
        (props.data ?? []).filter((d) => d.receive != null),
        (visitors) => visitors.length,
        (d) => d.receive.split("T")[0],
        (d) => d.preregist
      )
      .map(([receive, preregist, count]) => ({ receive, preregist, count }));
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
