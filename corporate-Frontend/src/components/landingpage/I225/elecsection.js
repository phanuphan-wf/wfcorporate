import React from "react";

import { MdLocationOn } from "react-icons/md";
import { MdAvTimer } from "react-icons/md";

export default function ElecSection() {
  return (
    <section id="elec-section">
      <div className="mx-5 md:mx-0">
        <img
          src={require("./img/elec_banner.png")}
          alt="elec banner"
          id="elec_banner"
          className="mx-auto rounded-lg md:rounded-3xl w-[90%] md:w-[80%] lg:w-[60%] xl:w-[50%] max-w-[810px] object-contain"
        />
      </div>
      <div className="relative mx-5 lg:mx-0">
        <div className="grid grid-cols-2 md:grid-cols-4 w-full sm:w-3/4 md:w-full lg:w-[800px] gap-7 place-items-center mx-auto mt-6">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src={require("./img/elec_img1.png")}
              alt="elec-img"
              className="object-cover aspect-square"
            />
          </div>
          <img
            src={require("./img/elec_img2.png")}
            alt="elec-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/elec_img3.png")}
            alt="elec-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/elec_img4.png")}
            alt="elec-img"
            className="rounded-lg"
          />
        </div>
        <div className="w-fit mx-auto mt-7 relative z-[900] mix-blend-multiply">
          <img
            src={require("./img/elec_logo.png")}
            alt="electronic logo"
            id="elec_logo"
            className="w-1/2 sm:2/3 lg:w-4/5 mx-auto max-w-[540px]"
          />
        </div>
      </div>
      <div className="elec-text container max-w-[700px] md:text-xl lg:text-2xl">
        <ul className="list-disc px-14 my-4">
          <li>ลดกระหน่ำกว่า 70% ทั้งเครื่องใช้ไฟฟ้าและสินค้าไอที</li>
          <li>จัดส่วนลด เล่นใหญ่ มาเต็ม ผ่อน 0% ทั้งงาน</li>
          <li>
            เครื่องใช้ไฟฟ้าในบ้านและครัวเรือน อาทิ ทีวี แอร์ ตู้เย็น
            เครื่องซัก-อบผ้า เครื่องดูดฝุ่น เครื่องฟอกอากาศ เครื่องทำน้ำอุ่น
            เตารีด เครื่องดูดควัน เครื่องล้างจาน เตาแม่เหล็ก ไมโครเวฟ
            หม้อหุงข้าว สินค้า IT ฯลฯ
          </li>
        </ul>
      </div>
      <div className="xl:container w-full bg-[#9EC9E7] flex items-center justify-evenly mb-4">
        <div className="w-1/2 lg:w-3/5 my-3 lg:my-1">
          <img
            src={require("./img/elec_logo_sm.png")}
            alt="elec_logo"
            id="elec_banner"
            className="mx-auto"
          />
        </div>
        <div>
          <div className="flex gap-0.5 items-center md:text-xl lg:text-2xl">
            <MdLocationOn className=" drop-shadow-md" />
            <span className=" drop-shadow-md">Hall 9-10</span>
          </div>
          <div className="flex gap-0.5 items-center md:text-xl lg:text-2xl">
            <MdAvTimer className=" drop-shadow-md" />
            <span className=" drop-shadow-md">10.30-20.30 น.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
