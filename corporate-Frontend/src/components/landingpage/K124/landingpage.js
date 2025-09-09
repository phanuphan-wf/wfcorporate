import React, { useEffect, useState, useRef } from "react";
import useCheckMobile from "../../hook/useCheckMobile";
import { useParams } from "react-router-dom";
import Axios from "axios";

import { MdLocationOn } from "react-icons/md";
import { MdAvTimer } from "react-icons/md";

import FurSection from "./fursection";
import ClickRegist from "./clickRegist";

export default function Landingpage(props) {
  const mobile = useCheckMobile();

  const { cp } = useParams();
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_reg;
  const exId = "k124";

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

  const bannerRef = useRef(null);

  const [bannerH, setBannerH] = useState(0);

  useEffect(() => {
    setBannerH(bannerRef.current.clientHeight);
  });

  useEffect(() => {
    //setBannerH(bannerRef.current.clientHeight);
  }, [bannerH]);

  return (
    <section className={`landing_${exId}`}>
      <div
        className="w-full absolute top-0 left-1/2 -translate-x-1/2"
        ref={bannerRef}
      >
        <img
          src={require("./img/hero_banner.png")}
          alt="landing hero"
          id="hero_banner"
          className="mx-auto"
        />
      </div>
      <div
        className="text-center text-xl sm:text-2xl lg:text-4xl font-medium mb-4"
        style={{ marginTop: `${bannerH * 1.1}px` }}
      >
        เฟอร์นิเจอร์ แฟร์ @ขอนแก่น{mobile ? <br /> : " | "}
        17-25 สิงหาคม 2567
      </div>
      <div className="flex gap-4 lg:gap-10 w-full justify-center mb-4">
        <div className="bg-[#252525] text-white px-4 py-1 text-sm md:text-2xl lg:text-3xl flex items-center gap-1 rounded-full">
          <MdLocationOn />
          ฮอลล์ 1-3
        </div>
        <div className="bg-[#252525] text-white px-4 py-1 text-sm md:text-2xl lg:text-3xl flex items-center gap-1 rounded-full">
          <MdAvTimer />
          10.30-20.00 น.
        </div>
      </div>
      <div
        ref={clickPos}
        className={`md:flex md:justify-center mx-5 lg:mx-0 mb-4 sm:mb-6 md:mb-10`}
      >
        <ClickRegist cp={cp} exId={exId} />
      </div>
      {fixedClick && (
        <div
          className={`md:flex md:justify-center mx-5 lg:mx-0 mb-4 sm:mb-6 md:mb-10 fixed top-3 z-[999] w-full max-md:pr-10
        `}
        >
          <ClickRegist cp={cp} exId={exId} />
        </div>
      )}
      <FurSection />
      {/*----------------- ส่วนของ sponsor -----------------*/}

      <div className="premium my-6">
        <img
          src={require("./img/sponsor_k124.png")}
          alt="premium bag"
          id="premium"
          className="mx-auto w-1/2 lg:w-1/3 xl:w-1/4"
        />
      </div>
      <div
        ref={clickBottom}
        className="md:flex md:flex-col md:gap-4 md:items-center mx-5 lg:mx-0 mb-4 sm:mb-6 md:mb-10"
      >
        {/*--------แก้ hidden เป็น flex เพื่อเปิด register----*/}
        <ClickRegist cp={cp} exId={exId} />

        <div className="flex justify-center gap-4 sm:gap-8 md:gap-2 bg-red-500 rounded-3xl md:rounded-xl text-white py-4 md:w-1/2 max-w-[800px] hover:bg-red-800 max-md:mt-4">
          <div className="text-center md:text-xl lg:text-2xl">
            <a href="/">กลับไปที่ World Fair เว็บไซต์</a>
          </div>
        </div>
      </div>
    </section>
  );
}
