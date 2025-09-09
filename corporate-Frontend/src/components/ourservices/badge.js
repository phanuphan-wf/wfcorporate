import React from "react";

export default function Bagde(props) {
  return (
    <div className="badge w-full h-full relative">
      <div className="absolute left-1/2 -translate-x-1/2">
        <svg width={100} height={100} viewBox="0 0 100 100" fill="none">
          <circle r={50} cx="50" cy="50" fill="#640000" />
        </svg>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-[50px] -translate-y-1/2">
        <img src={props.icon} />
      </div>
      <div className="absolute top-[50px] left-1/2 -translate-x-1/2">
        <svg
          width="397"
          height="318"
          viewBox="0 0 397 318"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M397 0.930176H271.603C271.603 41.254 238.868 73.933 198.5 73.933C158.132 73.933 125.397 41.254 125.397 0.930176H0V236H151.342L198.5 317.579L245.658 236H397V0.930176Z"
            fill="url(#paint0_linear_460_1122)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_460_1122"
              x1="198.5"
              y1="0.930176"
              x2="198.5"
              y2="317.579"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#FF0000" />
              <stop offset="1" stop-color="#640000" />
              <stop offset="1" stop-color="#640000" />
            </linearGradient>
          </defs>
        </svg>
        <div className="text-white text-3xl absolute top-[25%] w-full text-center">
          {props.title}
        </div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-fit">
          <svg width={100} height={3} viewBox="0 0 100 3" fill="none">
            <line
              x1="0"
              y1="0"
              x2="100"
              y2="0"
              style={{ stroke: "white", strokeWidth: "3px" }}
            />
          </svg>
        </div>
        <div className="text-white text-center absolute top-[45%] left-1/2 -translate-x-1/2 w-4/5">
          {props.text}
        </div>
      </div>
    </div>
  );
}
