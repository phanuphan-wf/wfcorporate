import React, { useEffect, useMemo, useRef } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

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
  "bts",
  "instagram",
];

export default function MediaSum(props) {
  const containerRef = useRef();
  const media = useMemo(() => {
    const registrations = props.data || [];
    const total = registrations.length;
    return channel
      .map((cat) => {
        const count = d3.sum(registrations, (row) => row[cat]);
        return {
          cat,
          count,
          percentage: `${(total ? (count / total) * 100 : 0).toFixed(1)}%`,
        };
      })
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [props.data]);

  useEffect(() => {
    const container = containerRef.current;
    let plot;
    let lastWidth;
    const render = () => {
      const width = Math.floor(container.getBoundingClientRect().width);
      if (!width || width === lastWidth) return;
      lastWidth = width;
      if (plot) plot.remove();
      plot = Plot.plot({
        width,
        x: { grid: true },
        y: { domain: media.map((item) => item.cat) },
        marginLeft: 80,
        marginRight: 20,
        marks: [
          Plot.axisY({ label: "Media" }),
          Plot.axisX({ label: "Quantity" }),
          Plot.barX(media, {
            x: "count",
            y: "cat",
            fill: "cat",
            tip: true,
          }),
          Plot.text(media, {
            x: "count",
            y: "cat",
            text: "percentage",
            textAnchor: "start",
            dx: 6,
            fontSize: 12,
            fontWeight: 600,
            fill: "#333",
            ariaLabel: () => "media-percentages",
          }),
        ],
      });
      container.append(plot);
      const x = plot.scale("x");
      // ariaLabel belongs to each text element, not its parent group.
      const svgBounds = plot.getBoundingClientRect();
      const scale = svgBounds.width / width;
      const rightEdge = Math.min(
        container.getBoundingClientRect().right,
        svgBounds.right - 20 * scale,
      );
      plot.querySelectorAll('text[aria-label="media-percentages"]').forEach((label, index) => {
        const item = media[index];
        const bounds = label.getBoundingClientRect();
        if (bounds.right + 6 * scale > rightEdge) {
          const start = x.apply(0);
          const end = x.apply(item.count);
          const textWidth = bounds.width / scale;
          // Keep the whole label inside, preferring 25% in from the bar end.
          const center = Math.max(
            start + textWidth / 2 + 4,
            Math.min(x.apply(item.count * 0.75), end - textWidth / 2 - 4),
          );
          label.setAttribute(
            "transform",
            label.getAttribute("transform").replace(
              /^translate\([^,]+,/,
              `translate(${center - 6},`,
            ),
          );
          label.setAttribute("text-anchor", "middle");
          label.style.fill = "#fff";
        }
      });
    };
    render();
    const observer = new ResizeObserver(render);
    observer.observe(container);
    return () => {
      observer.disconnect();
      if (plot) plot.remove();
    };
  }, [media]);

  return (
    <div className="media-plot my-8">
      <div>Media Reach</div>
      <div className="flex justify-center">
        <div ref={containerRef} className="w-full min-w-0" style={{ maxWidth: 640 }} />
      </div>
    </div>
  );
}
