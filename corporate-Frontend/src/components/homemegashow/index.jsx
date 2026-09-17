import React, { useRef, useEffect, useState } from "react";
import useCheckMobile from "../hook/useCheckMobile";
import Footer from "../layout/Footer";

export default function HomeMegaShow(props) {
  const mobile = useCheckMobile();

  const interestedRef = useRef(null);

  const handleScrollToInterested = () => {
    if (interestedRef.current) {
      interestedRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const Cotegory = [
    "Furniture & Home Décor",
    "Home Builder & Prefab",
    "Solar & Smart Home",
    "Tools & DIY",
    "Garden & Outdoor Living",
    "Electronics & Home Appliances",
    "Craft & Lifestyle",
    "Food & Beverage",
    "อื่น ๆ",
  ];

  const Floor_Area = [
    "3 × 3 ม.",
    "3 × 6 ม.",
    "6 × 6 ม. ขึ้นไป",
    "ยังไม่แน่ใจ ต้องการคำแนะนำ",
  ];

  const Contact_Back = [
    "09.00 - 12.00 น.",
    "12.00 - 15.00 น.",
    "15.00 - 18.00 น.",
    "หลัง 18.00 น.",
    "ติดต่อได้ทุกช่วงเวลา",
  ];


  const initExhibitors = {
    Full_Name: "",
    Phone: "",
    Company_Name: "",
    Cotegory: "",
    Floor_Area: "",
    Contact_Back: "",
  };

  const [exhibitorData, setExhibitorData] = useState(initExhibitors);



  return (
    <section className="HomeMegaShow w-full flex flex-col items-center justify-center bg-[#100249]">

      {/* Container หลักสำหรับควบคุมระยะ Padding ด้านข้างของเนื้อหา */}
      <div className="w-full flex flex-col items-center justify-center px-8 md:px-8 gap-6">

        {/* 1. Hero Banner */}
        <img
          src={
            mobile
              ? require("./img/hero_banner_mb.jpg")
              : require("./img/hero_banner_pc.jpg")
          }
          alt="landing_hero"
          className="mx-auto w-full h-auto max-w-[1040px] object-contain"
        />

        {/* 2. Atmosphere Section */}
        <div className="w-full max-w-[1040px] flex justify-center">
          <img
            src={require("./img/atmosphere.png")}
            alt="atmosphere_event"
            className="w-full h-auto object-contain block"
          />
        </div>

        <div className="w-full max-w-[1040px] bg-[#1c0b66] rounded-b-2xl p-4 md:p-6 flex flex-col gap-6 shadow-xl -mt-5">
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/bqOwSIhTau0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="overflow-hidden rounded-lg aspect-square md:aspect-auto">
              <img src={require("./img/fur_img1.jpg")} alt="furniture 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="overflow-hidden rounded-lg aspect-square md:aspect-auto">
              <img src={require("./img/fur_img2.jpg")} alt="furniture 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="overflow-hidden rounded-lg aspect-square md:aspect-auto">
              <img src={require("./img/fur_img3.jpg")} alt="furniture 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="overflow-hidden rounded-lg aspect-square md:aspect-auto">
              <img src={require("./img/fur_img4.jpg")} alt="furniture 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="overflow-hidden rounded-lg aspect-square md:aspect-auto">
              <img src={require("./img/fur_img5.jpg")} alt="furniture 5" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="overflow-hidden rounded-lg aspect-square md:aspect-auto">
              <img src={require("./img/fur_img6.jpg")} alt="furniture 6" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          </div>

        </div>

        {/* 3. Impressions Section */}
        <div className="w-full max-w-[1040px] flex justify-center -mt-3">
          <img
            src={require("./img/impressions.png")}
            alt="atmosphere_event"
            className="w-full h-auto object-contain block"
          />
        </div>

        <div className="w-full max-w-[1040px] bg-[#1c0b66] rounded-b-2xl p-3 sm:p-6 flex flex-col gap-6 shadow-xl -mt-5">

          {/* กำหนด flex-row ตลอดเวลาเพื่อให้อยู่ข้างกันทั้งบน PC และ มือถือ */}
          <div className="flex flex-row justify-center items-center gap-2 sm:gap-6 w-full">

            {/* วิดีโอที่ 1 */}
            <div className="w-1/2 max-w-[340px] h-[360px] xs:h-[420px] sm:h-[580px] rounded-xl overflow-hidden shadow-lg border border-white/10">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/ztf13d2TLjs"
                title="Home MEGA SHOW - Rama 9 Mattress"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            {/* วิดีโอที่ 2 */}
            <div className="w-1/2 max-w-[340px] h-[360px] xs:h-[420px] sm:h-[580px] rounded-xl overflow-hidden shadow-lg border border-white/10">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/KP2LqebwgGg"
                title="Home MEGA SHOW Highlight 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

          </div>

        </div>

        {/* 4. Banner อื่นๆ */}
        <div className="mx-auto w-full h-auto max-w-[1040px]">
          <img src={require("./img/home.png")} alt="hero" className="w-full h-auto object-contain" />
        </div>

        <div
          className="mx-auto w-full h-auto max-w-[1040px] coursor-pointer"
          onClick={handleScrollToInterested}
        >
          <img src={require("./img/book.png")} alt="book" className="w-full h-auto object-contain" />
        </div>

        <div className="mx-auto w-full h-auto max-w-[1040px]">
          <img src={require("./img/highlights.png")} alt="highlights" className="w-full h-auto object-contain" />
        </div>

        <div className="mx-auto w-full h-auto max-w-[1040px]">
          <img src={require("./img/why.png")} alt="why" className="w-full h-auto object-contain" />
        </div>

        <div className="mx-auto w-full h-auto max-w-[1040px]">
          <img src={require("./img/who.png")} alt="who" className="w-full h-auto object-contain" />
        </div>

        <div className="w-full flex flex-col items-center">
          {/* 1. รูป Header Interested */}
          <div
            ref={interestedRef}
            className="w-full max-w-[1040px] flex justify-center"
          >
            <img
              src={require("./img/interested.png")}
              alt="interested"
              className="w-full h-auto object-contain block"
            />
          </div>

          {/* 2. กล่อง Form ลงทะเบียน (เชื่อมต่อกับรูปภาพด้านบน) */}
          <div className="w-full max-w-[1040px] bg-[#1c0b66] rounded-b-2xl shadow-xl -mt-2 md:-mt-5 overflow-hidden">

            {/* ตัวฟอร์ม: ขยายเต็ม 100% ไม่จำกัด max-w */}
            <form className="w-full flex flex-col gap-5 bg-white p-6 sm:p-10 text-slate-800">

              {/* ชื่อ - นามสกุล */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-800 text-sm font-semibold">ชื่อ - นามสกุล <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="กรอกชื่อ-นามสกุล"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              {/* เบอร์โทรศัพท์ */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-800 text-sm font-semibold">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="08X-XXX-XXXX"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              {/* ชื่อบริษัท / ร้านค้า */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-800 text-sm font-semibold">ชื่อบริษัท / ร้านค้า</label>
                <input
                  type="text"
                  name="company"
                  placeholder="กรอกชื่อบริษัท / ร้านค้า"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-800 text-sm font-semibold">
                  สินค้าหรือบริการของคุณอยู่ในกลุ่มใด <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {Cotegory.map((item, index) => (
                    <label key={index} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        name="category"
                        value={item}
                        className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                      />
                      <span className="text-sm text-slate-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ขนาดพื้นที่ที่สนใจ */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-800 text-sm font-semibold">ขนาดพื้นที่ที่สนใจ <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                  {Floor_Area.map((item, index) => (
                    <label key={index} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        name="spaceSize"
                        value={item}
                        className="w-4 h-4 accent-yellow-500 rounded cursor-pointer"
                      />
                      <span className="text-sm text-slate-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ช่วงเวลาที่สะดวกให้ทีมงานติดต่อกลับ */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-800 text-sm font-semibold">ช่วงเวลาที่สะดวกให้ทีมงานติดต่อกลับ <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {Contact_Back.map((item, index) => (
                    <label key={index} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        name="contactTime"
                        value={item}
                        className="w-4 h-4 accent-yellow-500 rounded cursor-pointer"
                      />
                      <span className="text-sm text-slate-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ปุ่มลงทะเบียน */}
              <button
                type="submit"
                className="w-full mt-4 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-3 text-center leading-5 shadow-lg hover:scale-[1.005] active:scale-[0.995] transition-all duration-200"
              >
                ลงทะเบียนรับสิทธิพิเศษ
              </button>

            </form>
          </div>
          
        </div>


        <div className="w-full max-w-[1040px] flex justify-center mb-6">
          <img
            src={require("./img/exhibitor.png")}
            alt="exhibitor"
            className="w-full h-auto object-contain block"
          />
        </div>

      </div>


      {/* Footer ยืดเต็มขอบ โดยใช้ Margin Negative ลบค่า px-8 ออกไป */}
      <div className="w-full -mx-8 w-[calc(100%+4rem)] mt-6">
        <Footer show={1} />
      </div>

    </section>
  );
}