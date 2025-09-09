import React from "react";

import Picsvg from "./picsvg";

export default function WhorUs(props) {
  return (
    <section className="whorus">
      <div className="w-full h-fit md:h-80 sm:relative overflow-hidden my-9">
        <div className="md:w-2/3 lg:w-1/2 md:right-7 lg:right-20 md:top-10 md:absolute z-10">
          <div className="text-4xl text-[#ff0000]">เราคือใคร ... ?</div>
          <div className="mt-6 md:mt-10">
            <strong>ผู้นำด้านการจัดงานแสดงสินค้าในประเทศไทย</strong>
            <br />
            ด้วยประสบการณ์ที่มีมาอย่างยาวนานด้านการจัดงานแสดงสินค้าเพื่อผู้บริโภค
            และยังเป็นผู้ริเริ่มการจัดงานแสดงสินค้าด้าน Multi-show
            ซึ่งเป็นการนำสินค้าทั้งอุปโภคและบริโภคประเภทต่างๆ
            มารวมไว้ภายในงานเดียว
            เพื่อตอบโจทย์ทุกความต้องการของผู้เข้าชมงานอย่างครบวงจร ทำให้วันนี้
            เวิลด์ แฟร์
            ก้าวขึ้นเป็นผู้นำด้านการจัดงานแสดงสินค้าและได้รับการยอมรับจากผู้ประกอบการทั่วประเทศ
          </div>
        </div>
        <Picsvg />
      </div>
    </section>
  );
}
