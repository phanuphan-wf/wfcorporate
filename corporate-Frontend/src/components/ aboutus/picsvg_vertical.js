import React, { useState, useEffect, useRef } from "react";

export default function Picsvg_ver(props) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [screen, setScreen] = useState(0);

  const handleWindowSizeChange = () => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
    setScreen(window.innerWidth);
  };

  useEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
    setScreen(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  });

  const [xs, setXs] = useState(false);

  useEffect(() => {
    if (screen < 460) {
      setXs(true);
    } else {
      setXs(false);
    }
  }, [screen]);

  const [objH, setObjH] = useState(0);
  useEffect(() => {
    let obj = 0;
    obj = 328.8731061 - 0.116003788 * height;
    if (screen > 767) {
      obj = 280;
    }
    if (obj < 200) {
      obj = 200;
    }
    setObjH(obj);
  }, [height]);

  const [h, setH] = useState({ h1: "0px", h2: "0px", h3: "0px" });
  useEffect(() => {
    let p1 = "top-[" + Math.round(objH - 100) + "px]";
    setH({ ...h, h1: p1 });
  }, [objH]);

  useEffect(() => {
    //console.log(h);
  }, [h]);

  const x = "280px";

  return (
    <div ref={ref} className="h-full">
      <div className="absolute top-0 left-0 z-0">
        <svg
          width={width * 0.45}
          height="100"
          viewBox={`0 0 ${width * 0.45} 100`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={`M0 0 H${width * 0.45} L0 100Z`}
            fill="url(#paint0_linear_414_957)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_414_957"
              x1={width * 0.45}
              y1="50"
              x2="0"
              y2="50"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#FF0000" />
              <stop offset="1" stop-color="#52272D" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute top-0 left-0 z-[1]">
        <svg
          width={width}
          height={objH}
          viewBox={`0 0 ${width} ${objH}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={`M 0 0 V100 L ${width} ${objH} V${objH - 100} Z`}
            fill="url(#paint0_linear_414_958)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_414_958"
              x1="0"
              y1="100"
              x2={width}
              y2="100"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#FF0000" />
              <stop offset="1" stop-color="#52272D" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute top-0 left-0 z-[2] w-full">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={`M0 50 L ${width * 0.6} ${objH - (xs ? 95 : 110)} V${
              xs ? height * 0.75 : height - 10
            } H${width * 0.6 - 3} V${objH - (xs ? 93.5 : 108.5)} L0 53Z`}
            fill="url(#paint0_linear_414_959)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_414_959"
              x1={width / 2}
              y1="200"
              x2={width / 2}
              y2={xs ? height * 0.75 : height}
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#FF0000" />
              <stop offset="1" stop-color="#52272D" />
            </linearGradient>
          </defs>

          <circle
            r="10"
            cx={width * 0.6 - 1.5}
            cy={xs ? height * 0.75 + 10 : height - 10}
            fill="url(#paint0_linear_414_960)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_414_960"
              x1={width * 0.6 - 10}
              y1="10"
              x2={width * 0.6 + 10}
              y2="10"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#FF0000" />
              <stop offset="1" stop-color="#A71417" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className={`${!xs && "hidden"}`}>
        <div className={`absolute  right-0 z-[5] -scale-x-100`}>
          <svg
            width={width}
            height={objH * 2}
            viewBox={`0 0 ${width} ${objH * 2}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={`M 0 ${objH - 100} V${objH} L ${width} ${objH * 2 - 100} V${
                objH * 2 - 200
              } Z`}
              fill="url(#paint0_linear_414_958)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_414_958"
                x1="0"
                y1="100"
                x2={width}
                y2="100"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FF0000" />
                <stop offset="1" stop-color="#52272D" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute left-0 z-[10]">
          <svg
            width={width}
            height={objH * 3}
            viewBox={`0 0 ${width} ${objH * 3}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={`M 0 ${objH * 2 - 200} V${objH * 2 - 100} L ${width} ${
                objH * 3 - 200
              } V${objH * 3 - 300} Z`}
              fill="url(#paint0_linear_414_958)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_414_958"
                x1="0"
                y1="100"
                x2={width}
                y2="100"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FF0000" />
                <stop offset="1" stop-color="#52272D" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className={`absolute left-0 z-[10] w-full -scale-x-100`}>
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={`M0 ${objH - 50} L ${width * 0.6} ${objH * 1.11} V${
                height * 0.9
              } H${width * 0.6 - 3} V${objH * 1.11 + 1.5} L0 ${objH - 46}Z`}
              fill="url(#paint0_linear_414_959)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_414_959"
                x1={width / 2}
                y1="200"
                x2={width / 2}
                y2={xs ? height * 0.75 : height}
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FF0000" />
                <stop offset="1" stop-color="#52272D" />
              </linearGradient>
            </defs>

            <circle
              r="10"
              cx={width * 0.6 - 1.5}
              cy={xs ? height * 0.9 + 10 : height - 10}
              fill="url(#paint0_linear_414_960)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_414_960"
                x1={width * 0.6 - 10}
                y1="10"
                x2={width * 0.6 + 10}
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
    </div>
  );
}
