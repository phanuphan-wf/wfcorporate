import React from "react";

import Services from "./services";
import OurSuccess from "./oursuccess";

export default function OurServices(props) {
  return (
    <section className="ourservice">
      <div>
        <div className="text-4xl md:text-5xl lg:text-6xl pt-8 text-center">
          บริการของเรา
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
      <Services />
      <div className="my-8">
        <OurSuccess />
      </div>
    </section>
  );
}
