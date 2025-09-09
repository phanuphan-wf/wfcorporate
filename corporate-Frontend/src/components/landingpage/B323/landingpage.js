import React, { useEffect } from "react";
import useCheckMobile from "../../hook/useCheckMobile";
import { MdOutlineAdsClick } from "react-icons/md";
import { useParams } from "react-router-dom";
import Axios from "axios";

export default function Landingpage(props) {
  const mobile = useCheckMobile();

  const { cp } = useParams();
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_reg;
  const exId = "b323";

  useEffect(() => {
    document.title = "Furniture Fair Information";

    if (cp != undefined) {
      let tag = { code: cp };
      const res = async () => await Axios.post(url + "/postUTM", tag);
      res();
    }
  }, []);

  return (
    <section className={`landing_${exId}`}>
      <div className="w-full md:h-fit lg:h-[520px]">
        <img
          src={require("./img/hero_banner.webp")}
          alt="landing hero"
          id="hero_banner"
          className="mx-auto lg:h-full"
        />
      </div>
      <div className="text-center text-xl sm:text-2xl lg:text-4xl my-6 md:my-9 lg:my-12 font-medium">
        เฟอร์นิเจอร์ แฟร์ 2023{mobile ? <br /> : " | "}วันที่ 22-30 ก.ค. 2566
      </div>
      <div className="md:flex md:justify-center mx-5 lg:mx-0 mb-4 sm:mb-6 md:mb-10">
        {/*--------แก้ hidden เป็น flex เพื่อเปิด register----*/}
        <div className="flex justify-center gap-4 sm:gap-8 md:gap-2 bg-red-500 rounded-3xl md:rounded-xl text-white py-4 md:w-3/4 max-w-[800px] hover:bg-red-800">
          <div className="text-5xl md:text-3xl">
            <MdOutlineAdsClick />
          </div>
          <div className="text-center md:text-start text-xl sm:text-2xl md:text-3xl">
            <a
              href={
                "/" +
                exId +
                "/preregistration" +
                (cp != undefined ? "/" + cp : "")
              }
            >
              Click !! ลงทะเบียนเพื่อ{mobile ? <br /> : " "}รับ Gift Set ฟรี!
            </a>
          </div>
        </div>
      </div>
      <div className="relative h-fit overflow-hidden mx-5 lg:mx-0">
        <div className="mx-5 md:mx-0">
          <img
            src={require("./img/fur_banner.png")}
            alt="furniture banner"
            id="fur_banner"
            className="mx-auto"
          />
        </div>
        <div className="absolute -top-[19%]">
          <svg viewBox="0 0 1640 150" fill="none">
            <path d="M 0 0 Q820 280 1620 0 V150 H0 Z" fill="blue" />
          </svg>
        </div>
      </div>
      <div className="relative mx-5 lg:mx-0">
        <div className="w-fit mx-auto mt-7 md:mt-14 relative z-[900] mix-blend-multiply">
          <img
            src={require("./img/fur_logo.png")}
            alt="furniture logo"
            id="fur_logo"
            className="w-2/3 md:w-full mx-auto "
          />
        </div>
        <div className="absolute -top-[70%] lg:-top-[100%] lg:left-[20%] xl:left-[25%] lg:-translate-x-[50%]">
          <img
            src={require("./img/fur_img.png")}
            alt="furniture img"
            id="fur_img1"
            className="w-1/3 sm:w-1/2 md:w-4/6 lg:w-full"
          />
        </div>
        <div className="absolute -top-[130%] sm:-top-[180%] lg:-top-[240%] right-[0] md:-right-[3%] lg:right-[19%] xl:right-[22%] lg:translate-x-[50%]">
          <div className="relative w-[300px]">
            <img
              src={require("./img/fur_img3.png")}
              alt="furniture img"
              id="fur_img3"
              className="absolute -right-[5%] w-1/4 sm:w-1/2 md:w-4/6 lg:w-full"
            />
            <img
              src={require("./img/fur_img2.png")}
              alt="furniture img"
              id="fur_img2"
              className="absolute w-[30%] sm:w-[60%] md:w-[80%] lg:w-full top-[50px] sm:top-[80px] md:top-[130px] lg:top-[180px] right-0 sm:right-[10px] md:right-[20px] lg:right-[60px]"
            />
          </div>
        </div>
      </div>
      <div className="fur-text container max-w-[700px]">
        <ul className="list-disc px-14 my-4">
          <li>
            เฟอร์นิเจอร์ทุกชนิด อาทิ โซฟา โซฟาเบด เก้าอี้ โต๊ะกลาง โต๊ะอาหาร
            เตียงนอน ที่นอน เก้าอี้นวด ฯลฯ เป็นต้น
          </li>
          <li>
            เฟอร์นิเจอร์บิวท์อิน / น็อคดาวน์ / ลอยตัว / เฟอร์นิเจอร์เอ้าท์ดอร์ /
            เฟอร์นิเจอร์ไม้
          </li>
          <li>ออกแบบและตกแต่งภายใน</li>
          <li>อุปกรณ์อำนวยความสะดวกภายในบ้าน</li>
          <li>โคมไฟ / ผ้าม่าน / มู่ลี่ / วอลล์เปเปอร์ / พรม</li>
          <li>ชุดเครื่องนอน หมอน</li>
          <li>สินค้าตกแต่งบ้าน</li>
        </ul>
      </div>
      <div className="relative h-fit overflow-hidden mx-5 lg:mx-0">
        <div className="mx-5 md:mx-0">
          <img
            src={require("./img/elec_banner.png")}
            alt="elec banner"
            id="elec_banner"
            className="mx-auto"
          />
        </div>
      </div>
      <div className="relative left-1/2 -translate-x-1/2 lg:mx-0 max-w-7xl">
        <div className="w-fit mx-auto mt-7 md:mt-14 relative z-[900] mix-blend-multiply">
          <img
            src={require("./img/elec_logo.png")}
            alt="electronic logo"
            id="elec_logo"
            className="w-2/3 md:w-full mx-auto pt-4 sm:pt-0"
          />
        </div>
        <div className="absolute -top-[90%] sm:-top-[150%] lg:left-[10%] xl:left-[15%]">
          <div className="relative w-[300px]">
            <img
              src={require("./img/elec_img1.png")}
              alt="electronic img"
              id="elec_img1"
              className="absolute w-1/4 sm:w-1/2 lg:w-fit"
            />
            <img
              src={require("./img/elec_img2.png")}
              alt="electronic img"
              id="elec_img2"
              className="absolute w-1/5 sm:w-1/3 lg:w-fit left-[60px] top-[10px] sm:left-[100px] sm:top-[40px] lg:left-[140px] lg:top-[50px]"
            />
          </div>
        </div>
        <div className="absolute -top-[50%] right-0 sm:-top-[80%] sm:-right-[10%] lg:right-0 xl:right-[10%]">
          <div className="relative w-[300px]">
            <img
              src={require("./img/elec_img4.png")}
              alt="electronic img"
              id="elec_img4"
              className="absolute w-1/4 sm:w-1/2 lg:w-fit right-0 -top-[50px] sm:-top-[100px] sm:left-[80px] lg:left-[50px]"
            />
            <img
              src={require("./img/elec_img3.png")}
              alt="electronic img"
              id="elec_img3"
              className="absolute w-1/4 sm:w-1/2 right-[40px] lg:w-fit sm:right-[120px] lg:right-[50%]"
            />
          </div>
        </div>
      </div>
      <div className="elec-text container max-w-[700px]">
        <ul className="list-disc px-14 my-4">
          <li>
            พร้อมรับโปรโมชั่นสุดพิเศษภายในงาน ลดทุกแบรนด์ สูงสุดถึง 70%
            +ลงทะเบียนรับส่วนลดเพิ่ม 5% + ผ่อน 0% นาน 24 เดือน +
            รับเงินคืนสูงสุด 42,000 บาท
          </li>
          <li>
            เครื่องใช้ไฟฟ้าในบ้านและครัวเรือน อาทิ ทีวี แอร์ ตู้เย็น
            เครื่องซัก-อบผ้า เครื่องดูดฝุ่น เครื่องฟอกอากาศ เครื่องทำน้ำอุ่น
            เตารีด เครื่องดูดควัน เครื่องล้างจาน เตาแม่เหล็ก ไมโครเวฟ
            หม้อหุงข้าว เครื่องปั่นคั้นแยกกาก เครื่องทำกาแฟ หม้อทอดไร้น้ำมัน ฯลฯ
          </li>
        </ul>
      </div>
      <div className="powerbuy bg-slate-300">
        <div className="relative h-fit overflow-hidden py-5 sm:py-10 mx-5 lg:mx-0">
          <div className="mx-5 md:mx-0">
            <img
              src={require("./img/pb_banner.png")}
              alt="powerbuy banner"
              id="pb_banner"
              className="mx-auto"
            />
          </div>
        </div>
      </div>
      <div className="pb-text container max-w-[700px]">
        <ul className="list-disc px-14 my-4">
          <li>Power Buy Mid Year Sale</li>

          <li>
            เครื่องใช้ไฟฟ้า ลดกระหน่ำจัดเต็มทั้งงาน
            มาพร้อมเครื่องเสียงและสินค้าไอที ทั้งลด ทั้งแถม
            พร้อมรับของสมนาคุณพิเศษอีกเพียบ
          </li>
        </ul>
      </div>
      <div className="premium my-5">
        <img
          src={require("./img/sponsor.png")}
          alt="premium bag"
          id="premium"
          className="mx-auto w-3/4"
        />
      </div>
      <div className="md:flex md:flex-col md:gap-4 md:items-center mx-5 lg:mx-0 mb-4 sm:mb-6 md:mb-10">
        {/*--------แก้ hidden เป็น flex เพื่อเปิด register----*/}
        <div className="flex justify-center gap-4 sm:gap-8 md:gap-2 bg-red-500 rounded-3xl md:rounded-xl text-white py-4 md:w-3/4 max-w-[800px] hover:bg-red-800">
          <div className="text-5xl md:text-3xl">
            <MdOutlineAdsClick />
          </div>
          <div className="text-center md:text-start text-xl sm:text-2xl md:text-3xl">
            <a
              href={
                "/" +
                exId +
                "/preregistration" +
                (cp != undefined ? "/" + cp : "")
              }
            >
              Click !! ลงทะเบียนเพื่อ{mobile ? <br /> : " "}รับ Gift Set ฟรี!
            </a>
          </div>
        </div>

        <div className="flex justify-center gap-4 sm:gap-8 md:gap-2 bg-red-500 rounded-3xl md:rounded-xl text-white py-4 md:w-3/4 max-w-[800px] hover:bg-red-80 mt-4">
          <div className="text-center md:text-start text-xl sm:text-2xl md:text-3xl">
            <a href="/">กลับไปที่ World Fair เว็บไซต์</a>
          </div>
        </div>
      </div>
    </section>
  );
}
