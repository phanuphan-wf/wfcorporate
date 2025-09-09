import React from "react";

import { TbHandClick } from "react-icons/tb";

export default function ClickRegist(props) {
  const { cp, exId } = props;

  return (
    <div
      className={`flex justify-center gap-2 sm:gap-8 md:gap-2 rounded-full py-3 md:w-3/4 max-w-[800px] relative z-20 bg-gradient-to-b from-orange-400 to-amber-300 to-[50%] hover:to-orange-400 hover:text-white transition-all duration-150 group`}
    >
      <div className="text-center md:text-start text-lg md:text-3xl lg:text-4xl">
        <a
          href={
            "/" + exId + "/preregistration" + (cp != undefined ? "/" + cp : "")
          }
        >
          ลงทะเบียนรับ{" "}
          <font className="text-red-500 group-hover:text-red-700">
            Gift Set{" "}
            <font className="text-xl md:text-5xl lg:text-6xl">ฟรี!</font>
          </font>{" "}
          <font className="text-xl md:text-4xl lg:text-5xl underline">
            Click
          </font>
        </a>
      </div>
      <div className="text-3xl md:text-5xl lg:text-6xl -rotate-[30deg]">
        <TbHandClick />
      </div>
    </div>
  );
}
