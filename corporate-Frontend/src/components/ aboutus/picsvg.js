import React, { useState, useEffect, useRef } from "react";

export default function Picsvg(props) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  const handleWindowSizeChange = () => {
    setWidth(ref.current.offsetWidth);
  };
  useEffect(() => {
    setWidth(ref.current.offsetWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  });

  return (
    <div ref={ref} className="hidden md:block">
      <div className="absolute bottom-0 left-0 z-0">
        <svg
          width={width * 0.125}
          height="170"
          viewBox={`0 0 ${width * 0.125} 170`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={`M0 170 H${width * 0.125} L0 0Z`}
            fill="url(#paint0_linear_414_957)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_414_957"
              x1="85"
              y1="0"
              x2="85"
              y2="170"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#FF0000" />
              <stop offset="1" stop-color="#52272D" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 z-[1]">
        <svg
          width={width * 0.3}
          height="320"
          viewBox={`0 0 ${width * 0.3} 320`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={`M 0 320 H ${width * 0.125} L ${width * 0.3} 0 H ${
              width * 0.175
            } Z`}
            fill="url(#paint0_linear_414_958)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_414_958"
              x1="0"
              y1="160"
              x2={width * 0.3}
              y2="160"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#FF0000" />
              <stop offset="1" stop-color="#52272D" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 z-[2] w-full">
        <svg
          width={width}
          height="240"
          viewBox={`0 0 ${width} 240`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={`M ${width * 0.06} 240 L ${width * 0.2} 8.5 L ${
              width - 10
            } 8.5 V11.5 H${width * 0.2 + 1.5} L${width * 0.06 + 4} 240Z`}
            fill="url(#paint0_linear_414_959)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_414_959"
              x1="80"
              y1="120"
              x2={width}
              y2="120"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#FF0000" />
              <stop offset="1" stop-color="#52272D" />
            </linearGradient>
          </defs>

          <circle
            r="10"
            cx={width - 10}
            cy="10"
            fill="url(#paint0_linear_414_960)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_414_960"
              x1={width - 20}
              y1="10"
              x2={width}
              y2="10"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#FF0000" />
              <stop offset="1" stop-color="#A71417" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
