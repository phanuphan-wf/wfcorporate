import React from "react";

export default function Vision(props) {
  return (
    <section className="vision px-5 sm:px-10 container md:px-5">
      <div className="bg-black w-full h-fit text-center text-white py-4 px-10 sm:py-5 sm:px-24 mb-10 mt-10 md:mt-0">
        ตลอดระยะเวลาที่ผ่านมา เวิลด์ แฟร์
        มุ่งมั่นพัฒนารูปแบบของการจัดงานแสดงสินค้าอย่างต่อเนื่อง
        เพื่อยกระดับมาตรฐานการจัดงานให้เป็นที่ยอมรับในระดับสากล
        พร้อมสร้างพันธมิตรทางธุรกิจกับผู้ประกอบการทุกราย
        เพื่อก้าวไปสู่ความสำเร็จทางธุรกิจ
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mb-10">
        <div className="bg-gray-300 text-center grid place-content-center py-20 md:py-0 order-2 md:order-none">
          <h1 className="text-2xl md:text-3xl text-[#ff0000] mb-2">
            วิสัยทัศน์ (VISION)
          </h1>
          <p className="text-lg">
            “ความสำเร็จของผู้แสดงสินค้า คือธุรกิจของเรา”
            <br />
            Your success is our business
          </p>
        </div>
        <div className="order-1 md:order-none">
          <img
            src={require("./img/vision.png")}
            alt="vision"
            id="visionimg"
            className="object-cover w-full"
          />
        </div>
        <div className=" order-3 md:order-none">
          <img
            src={require("./img/mission.png")}
            alt="vision"
            id="visionimg"
            className="object-cover w-full"
          />
        </div>
        <div className="bg-gray-300 text-center grid place-content-center py-14 md:py-0 order-4 md:order-none">
          <h1 className="text-2xl md:text-3xl text-[#ff0000]">
            พันธกิจ (MISSION)
          </h1>
          <ul className="list-disc text-sm text-left pl-6">
            <li>
              พัฒนารูปแบบการจัดแสดงสินค้าภายในประเทศ ให้มีมาตรฐานเทียบเท่าสากล
            </li>
            <li>
              ส่งเสริมให้ผู้ประกอบการภายในประเทศ
              มีศักยภาพแข่งขันได้ในรูปแบบการค้าที่เปิดกว้าง
              และสร้างความแข็งแกร่งให้เกิดในธุรกิจ
            </li>
            <li>
              สร้างนวัตกรรมใหม่ของการจัดงานแสดงสินค้า
              เพื่อพัฒนารูปแบบการจัดงานให้เป็นที่ยอมรับในวงกว้าง
            </li>
            <li>
              มุ่งมั่นให้ความรู้ ความเข้าใจ ในการจัดงานแสดงสินค้า
              แก่ทั้งผู้ร่วมแสดงสินค้า และผู้ชมงาน
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
