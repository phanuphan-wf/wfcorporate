import React, { useEffect, useState, useRef } from "react";
import useCheckMobile from "../../hook/useCheckMobile";
import { BsFillHandIndexThumbFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import Axios from "axios";

export default function Landingpage(props) {
  const mobile = useCheckMobile();

  const { cp } = useParams();
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_reg;
  const exId = "i323";

  useEffect(() => {
    document.title = "Furniture Fair Information";

    if (cp != undefined) {
      let tag = { code: cp };
      const res = async () => await Axios.post(url + "/postUTM", tag);
      res();
    }
  }, []);

  const clickPos = useRef();

  const clickBottom = useRef();

  useEffect(() => {
    window.addEventListener("scroll", scrollYfixed);
    return () => {
      window.removeEventListener("scroll", scrollYfixed);
    };
  });

  const [fixedClick, setFixedClick] = useState(false);

  const scrollYfixed = () => {
    let y = clickPos.current.offsetTop;
    let y2 = clickBottom.current.offsetTop;
    let h = window.innerHeight;
    if (window.scrollY < y - 12 || window.scrollY > y2 - h) {
      setFixedClick(false);
    } else {
      setFixedClick(true);
    }
  };

  useEffect(() => {
    console.log(clickPos.current.offsetTop);
  }, [clickPos]);

  return (
    <section className={`landing_${exId}`}>
      <div className="w-full md:h-fit lg:h-[520px]">
        <img
          src={require("./img/hero_banner.png")}
          alt="landing hero"
          id="hero_banner"
          className="mx-auto lg:h-full"
        />
      </div>
      <div className="text-center text-xl sm:text-2xl lg:text-4xl my-6 md:my-9 lg:my-12 font-medium">
        Furniture Fair 2023{mobile ? <br /> : " | "}วันที่ 2-10 ก.ย. 2566
      </div>
      <div
        ref={clickPos}
        className={`md:flex md:justify-center mx-5 lg:mx-0 mb-4 sm:mb-6 md:mb-10`}
      >
        {/*--------แก้ hidden เป็น flex เพื่อเปิด register----*/}
        <div
          className={`flex justify-center gap-4 sm:gap-8 md:gap-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl md:rounded-xl text-white py-4 md:w-3/4 max-w-[800px] hover:bg-gradient-to-r hover:from-blue-800 hover:to-green-800 `}
        >
          <div className="text-3xl -rotate-45">
            <BsFillHandIndexThumbFill />
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
      {fixedClick && (
        <div
          className={`md:flex md:justify-center mx-5 lg:mx-0 mb-4 sm:mb-6 md:mb-10 fixed top-3 z-[999] w-full max-md:pr-10
        `}
        >
          <div
            className={`flex justify-center gap-4 sm:gap-8 md:gap-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl md:rounded-xl text-white py-4 md:w-3/4 max-w-[800px] hover:bg-gradient-to-r hover:from-blue-800 hover:to-green-800 `}
          >
            <div className="text-3xl -rotate-45">
              <BsFillHandIndexThumbFill />
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
      )}
      <div className="relative h-fit overflow-hidden mx-5 lg:mx-0">
        <div className="mx-5 md:mx-0">
          <img
            src={require("./img/fur_banner.png")}
            alt="furniture banner"
            id="fur_banner"
            className="mx-auto"
          />
        </div>
      </div>
      <div className="relative mx-5 lg:mx-0">
        <div className="grid grid-cols-2 md:grid-cols-4 w-full sm:w-3/4 md:w-full lg:w-[800px] gap-7 place-items-center mx-auto mt-6">
          <img
            src={require("./img/fur_img1.png")}
            alt="fur-img"
            className="round-lg"
          />
          <img
            src={require("./img/fur_img2.png")}
            alt="fur-img"
            className="round-lg"
          />
          <img
            src={require("./img/fur_img3.png")}
            alt="fur-img"
            className="round-lg"
          />
          <img
            src={require("./img/fur_img4.png")}
            alt="fur-img"
            className="round-lg"
          />
        </div>
        <div className="w-fit mx-auto mt-7 md:mt-14 relative z-[900] mix-blend-multiply">
          <img
            src={require("./img/fur_logo.png")}
            alt="furniture logo"
            id="fur_logo"
            className="w-2/3 md:w-full mx-auto "
          />
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
        <div className="grid grid-cols-2 md:grid-cols-4 w-full sm:w-3/4 md:w-full lg:w-[800px] gap-7 place-items-center mx-auto mt-6">
          <img
            src={require("./img/elec_img1.png")}
            alt="elec-img"
            className="round-lg"
          />
          <img
            src={require("./img/elec_img2.png")}
            alt="elec-img"
            className="round-lg"
          />
          <img
            src={require("./img/elec_img3.png")}
            alt="elec-img"
            className="round-lg"
          />
          <img
            src={require("./img/elec_img4.png")}
            alt="elec-img"
            className="round-lg"
          />
        </div>
        <div className="w-fit mx-auto mt-7 md:mt-14 relative z-[900] mix-blend-multiply">
          <img
            src={require("./img/elec_logo.png")}
            alt="electronic logo"
            id="elec_logo"
            className="w-2/3 md:w-full mx-auto "
          />
        </div>
      </div>
      <div className="elec-text container max-w-[700px]">
        <ul className="list-disc px-14 my-4">
          <li>
            พร้อมรับโปรโมชั่นสุดพิเศษภายในงาน ลดทุกแบรนด์ สูงสุดถึง 70%
            +ลงทะเบียนรับส่วนลดเพิ่ม 5%
          </li>
          <li>ผ่อน 0% นาน 24 เดือน + รับเงินคืนสูงสุด 42,000 บาท</li>
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
      <div className="relative left-1/2 -translate-x-1/2 lg:mx-0 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 w-full sm:w-3/4 md:w-full lg:w-[800px] gap-7 place-items-center mx-auto mt-6">
          <img
            src={require("./img/pb_img1.png")}
            alt="pb-img"
            className="round-lg"
          />
          <img
            src={require("./img/pb_img2.png")}
            alt="pb-img"
            className="round-lg"
          />
          <img
            src={require("./img/pb_img3.png")}
            alt="pb-img"
            className="round-lg"
          />
          <img
            src={require("./img/pb_img4.png")}
            alt="pb-img"
            className="round-lg"
          />
        </div>
        <div className="w-fit mx-auto mt-7 md:mt-14 relative z-[900] mix-blend-multiply">
          <img
            src={require("./img/pb_logo.png")}
            alt="powerbuy logo"
            id="pb_logo"
            className="w-2/3 md:w-full mx-auto "
          />
        </div>
      </div>
      <div className="pb-text container max-w-[700px]">
        <ul className="list-disc px-14 my-4">
          <li>Power Buy ELECTRONICS FAIR</li>
          <li>
            เครื่องใช้ไฟฟ้า ลดกระหน่ำจัดเต็มทั้งงาน
            มาพร้อมเครื่องเสียงและสินค้าไอที ทั้งลด ทั้งแถม
            พร้อมรับของสมนาคุณพิเศษอีกเพียบ
          </li>
        </ul>
      </div>
      <div className="premium my-6">
        <img
          src={require("./img/premium.png")}
          alt="premium bag"
          id="premium"
          className="mx-auto w-1/3"
        />
      </div>
      <div
        ref={clickBottom}
        className="md:flex md:flex-col md:gap-4 md:items-center mx-5 lg:mx-0 mb-4 sm:mb-6 md:mb-10"
      >
        {/*--------แก้ hidden เป็น flex เพื่อเปิด register----*/}
        <div className="flex justify-center gap-4 sm:gap-8 md:gap-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl md:rounded-xl text-white py-4 md:w-3/4 max-w-[800px] hover:bg-gradient-to-r hover:from-blue-800 hover:to-green-800">
          <div className="text-3xl -rotate-45">
            <BsFillHandIndexThumbFill />
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

        <div className="flex justify-center gap-4 sm:gap-8 md:gap-2 bg-red-500 rounded-3xl md:rounded-xl text-white py-4 md:w-1/2 max-w-[800px] hover:bg-red-800 max-md:mt-4">
          <div className="text-center md:text-start text-xl md:text-2xl">
            <a href="/">กลับไปที่ World Fair เว็บไซต์</a>
          </div>
        </div>
      </div>
    </section>
  );
}
