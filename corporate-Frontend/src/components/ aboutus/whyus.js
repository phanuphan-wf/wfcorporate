import React from "react";

import PicsvgReverse from "./picsvg_reverse";

export default function WhyUs(props) {
  return (
    <section className="whyus">
      <div className="w-full h-fit md:h-80 sm:relative overflow-hidden mt-5 mb-10 sm:mb-0 md:my-9">
        <div className="md:w-2/3 lg:w-1/2 md:left-7 lg:left-20 md:top-10 md:absolute z-10">
          <div className="text-4xl text-[#ff0000]">ทำไมต้องเลือกเรา</div>
          <div className="sm:mt-6 md:mt-10">
            เราเป็นผู้เชี่ยวชาญด้านการตลาด เพื่องานแสดงสินค้า ด้วยตระหนักดีว่า
            เป้าหมายความสำเร็จในการเจรจาธุรกิจของลูกค้า
            เป็นสิ่งสำคัญในการเข้าร่วมงานแสดงสินค้าแต่ละงาน เวิลด์ แฟร์
            จึงพยายามอย่างดีที่สุดในการวางแผนการประชาสัมพันธ์
            ให้ตรงกลุ่มเป้าหมาย โดยใช้สื่อที่ครอบคลุมทั้งสื่อ ออฟไลน์ และ
            ออนไลน์ เพื่อดึงกำลังซื้อเข้าสู่งานแสดงสินค้า
            และสร้างความสำเร็จให้แก่ผู้ประกอบการ ที่เข้าร่วมแสดงสินค้าภายในงาน
          </div>
        </div>
        <PicsvgReverse />
      </div>
    </section>
  );
}
