import React, { useEffect, useState, useRef } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

export default function MediaSum(props) {
  const [media, setMedia] = useState({});
  const containerRef = useRef();
  const channel = [
    "tv",
    "billboard",
    "cutout",
    "newspaper",
    "facebook",
    "google",
    "youtube",
    "line",
    "friend",
    "other",
    "radio",
    "tiktok",
    "sms",
  ];

  useEffect(() => {
    if (media === undefined) return;
    const plot = Plot.plot({
      x: { grid: true },
      marginLeft: 80,
      marks: [
        Plot.axisY({ label: "Media" }),
        Plot.axisX({ label: "Quantity" }),
        Plot.barX(media, {
          x: "count",
          y: "cat",
          fill: "cat",
          tip: true,
          sort: "count",
        }),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [media]);

  useEffect(() => {
    let mediasum = [];
    channel.map((c) => {
      if (d3.sum(props.data, (r) => r[c]) != 0) {
        mediasum.push({
          cat: c,
          count: d3.sum(props.data, (r) => r[c]),
        });
      }
    });
    setMedia(mediasum);
  }, [props.data]);

  return (
    <div className="media-plot my-8">
      <div>Media Reach</div>
      <div className="flex justify-center">
        <div ref={containerRef} />
      </div>
    </div>
  );
}
