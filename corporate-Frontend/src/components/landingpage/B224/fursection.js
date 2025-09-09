import React from "react";

import { MdLocationOn } from "react-icons/md";
import { MdAvTimer } from "react-icons/md";

export default function FurSection() {
  return (
    <section id="fur-section">
      <div className="mx-5 lg:mx-0">
        <img
          src={require("./img/fur_banner.png")}
          alt="furniture banner"
          id="fur_banner"
          className="mx-auto rounded-lg md:rounded-3xl md:w-[90%] lg:w-[60%] xl:w-[50%]"
        />
      </div>

      <div className="relative mx-5 lg:mx-0">
        <div className="grid grid-cols-2 md:grid-cols-3 w-full sm:w-3/4 lg:w-[800px] gap-4 md:gap-7 place-items-center mx-auto mt-6">
          <img
            src={require("./img/fur_img1.png")}
            alt="fur-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/fur_img2.png")}
            alt="fur-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/fur_img3.png")}
            alt="fur-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/fur_img4.png")}
            alt="fur-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/fur_img5.png")}
            alt="fur-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/fur_img6.png")}
            alt="fur-img"
            className="rounded-lg"
          />
        </div>
        <div className="w-fit mx-auto mt-7 relative z-[900] mix-blend-multiply">
          <img
            src={require("./img/fur_logo.png")}
            alt="furniture logo"
            id="fur_logo"
            className="w-2/3 mx-auto"
          />
        </div>
      </div>
      <div className="fur-text container max-w-[700px] md:text-xl lg:text-2xl">
        <ul className="list-disc px-14 my-4">
          <li>
            เฟอร์นิเจอร์ห้องรับแขก ห้องนั่งเล่น อาทิ โซฟา เก้าอี้ โต๊ะกลาง
            รีไคลเนอร์ พรมปูพื้น เป็นต้น
          </li>
          <li>
            เฟอร์นิเจอร์ห้องนอน อาทิ เตียงนอน ที่นอน ชุดเครื่องนอน ตู้เสื้อผ้า
            หมอน โคมไฟ
          </li>
          <li>
            เฟอร์นิเจอร์บิวท์อิน / น็อคดาวน์ / ลอยตัว / เฟอร์นิเจอร์เอ้าท์ดอร์ /
            เฟอร์นิเจอร์ไม้ / ห้องอาหาร
          </li>
          <li>ออกแบบและตกแต่งภายใน</li>
          <li>อุปกรณ์อำนวยความสะดวกภายในบ้าน</li>
          <li>โคมไฟ / ผ้าม่าน / มู่ลี่ / วอลล์เปเปอร์ / พรม</li>
          <li>สินค้าตกแต่งบ้าน</li>
        </ul>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3 md:container px-10 sm:max-md:px-20 mb-5 lg:w-[800px]">
        {[1, 2, 3, 4].map((i) => (
          <img src={require("./img/fur_pix" + i + ".jpg")} alt="fur-img" />
        ))}
      </div>
      <div className="xl:container w-full bg-[#fff200] flex items-center justify-evenly py-2 mb-4">
        <div className="w-1/2 md:w-1/3 lg:w-1/4">
          <img
            src={require("./img/fur_logo.png")}
            alt="furniture logo white"
            id="fur_banner"
            className="mx-auto"
          />
        </div>
        <div>
          <div className="flex gap-0.5 items-center md:text-xl lg:text-2xl">
            <MdLocationOn className="drop-shadow-md" />
            <span className="drop-shadow-md">ฮอลล์ EH 102-104</span>
          </div>
          <div className="flex gap-0.5 items-center md:text-xl lg:text-2xl">
            <MdAvTimer className="drop-shadow-md" />
            <span className="drop-shadow-md">10.30-20.30 น.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
