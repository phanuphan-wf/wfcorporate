import React from "react";

import bg from "./img/serviceBg.png";

import Badge from "./badge";
import show from "./img/show.svg";
import exhibit from "./img/exhibit.svg";
import design from "./img/design.svg";

export default function Services(props) {
  return (
    <div
      className="serve bg-bottom h-[1200px] md:h-[800px] lg:h-[720px] bg-cover md:relative w-full overflow-hidden sm:px-10 md:px-[100px]"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="mx-auto mt-10 md:mt-0 md:absolute md:top-5 md:left-1/2 md:-translate-x-1/2 w-[320px] md:w-[350px] lg:w-[400px] h-[380px]">
        <Badge
          icon={show}
          title={"SHOW MANAGER"}
          text={
            "บริการให้คำปรึกษา และบริหารงานแสดงสินค้า (Exhibition organizer) และนิทรรศการ (Event organizer)"
          }
        />
      </div>
      <div className="mx-auto md:absolute md:bottom-[20px] md:left-[5%] lg:left-[10%] w-[320px] md:w-[350px] lg:w-[400px] h-[380px]">
        <Badge
          icon={exhibit}
          title={"EXHIBITION"}
          text={
            "ผู้นำด้านการจัดงานแสดงสินค้า บริการจัดงานแสดงสินค้าระดับมาตรฐานสากล"
          }
        />
      </div>
      <div className="mx-auto md:absolute md:bottom-[20px] md:right-[5%] lg:right-[10%] w-[320px] md:w-[350px] lg:w-[400px] h-[380px]">
        <Badge
          icon={design}
          title={"SPECIAL DESIGN"}
          text={
            "บริการออกแบบ ดิสเพลย์บูธแสดงสินค้า และติดตั้งด้วยทีมงานมืออาชีพ"
          }
        />
      </div>
    </div>
  );
}
