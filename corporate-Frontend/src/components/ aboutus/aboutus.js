import React, { useRef, useEffect, useState } from "react";

import WhorUs from "./whorus";
import WhyUs from "./whyus";
import Picsvg_ver from "./picsvg_vertical";
import Vision from "./vision";

export default function Aboutus(props) {
  return (
    <section className="ourservice">
      <div>
        <div className="text-4xl md:text-5xl lg:text-6xl pt-8 text-center">
          เกี่ยวกับเรา
        </div>
        <div className="flex justify-center py-4">
          <svg height={10} width={160}>
            <line
              x1="0"
              y1="0"
              x2="160"
              y2="0"
              style={{ stroke: "rgb(255,0,0)", strokeWidth: "5px" }}
            />
          </svg>
        </div>
      </div>
      <div className="grid md:block grid-cols-3 gap-x-5 sm:gap-x-10 px-5 sm:px-10 container md:px-5">
        <div className="block row-span-2 md:hidden overflow-hidden relative">
          <Picsvg_ver />
        </div>
        <div className="col-span-2 md:block">
          <WhorUs />
        </div>
        <div className="col-span-2 md:block">
          <WhyUs />
        </div>
      </div>
      <Vision />
    </section>
  );
}
