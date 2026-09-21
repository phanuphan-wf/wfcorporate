import React, { useRef, useEffect, useState } from "react";
import Axios from "axios";
import useCheckMobile from "../hook/useCheckMobile";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../layout/Footer";

export default function HomeMegaShow(props) {

  const { cp } = useParams();
  const navigate = useNavigate();

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_hms;

  const mobile = useCheckMobile();

  const interestedRef = useRef(null);

  const handleScrollToInterested = () => {
    if (interestedRef.current) {
      interestedRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const product = [
    { key: "1", name: "Furniture & Home Décor" },
    { key: "2", name: "Home Builder & Prefab" },
    { key: "3", name: "Solar & Smart Home" },
    { key: "4", name: "Tools & DIY" },
    { key: "5", name: "Garden & Outdoor Living" },
    { key: "6", name: "Electronics & Home Appliances" },
    { key: "7", name: "Craft & Lifestyle" },
    { key: "8", name: "Food & Beverage" },
    { key: "9", name: "อื่น ๆ" },
  ];

  const space = [
    { key: "1", name:"3 x 3 ม."},
    { key: "2", name:"3 x 6 ม."},
    { key: "3", name:"6 x 6 ม. ขึ้นไป"},
    { key: "4", name:"ยังไม่แน่ใจ ต้องการคำแนะนำ"},
  ];

  const con_time = [
    { key: "1", name: "09.00 - 12.00 น."},
    { key: "2", name: "12.00 - 15.00 น."},
    { key: "3", name:"15.00 - 18.00 น."},
    { key: "4", name:"หลัง 18.00 น."},
    { key: "5", name:"ติดต่อได้ทุกช่วงเวลา"},
  ];

  

  const initExhibitors = {
    name: "",
    surname: "",
    mobile: "",
    email: "",
    company: "0",
    product: "0",
    space: "0",
    con_time: "0",
    campaign: "",
  };

  const [exhibitorData, setExhibitorData] = useState(initExhibitors);

  const handleSubmit = async (e) =>{
      e.preventDefault();

      const formData = new FormData(e.currentTarget);

      const payload = {
        name: formData.get("name") || "",
        surname: formData.get("surname") || "",
        mobile: formData.get("mobile") || "",
        email: formData.get("email") || "",
        company: formData.get("company") || "",
        product: parseInt(formData.get("product"), 10) || 0, 
        space: parseInt(formData.get("space"), 10) || 0,     
        con_time: parseInt(formData.get("con_time"), 10) || 0,         
        campaign: cp || "0",
      };

      // setExhibitorData(payload);
      // navigate("/homemegashow/submit");
      

      try {        
        const res = await Axios.post(url + "/submit", payload); 

        if (res.status === 200) {
          //alert("บันทึกข้อมูลสำเร็จเรียบร้อย!");
          setExhibitorData(payload);
          navigate("/homemegashow/submit");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
      }
  };
  

  useEffect(() => {
    console.log(exhibitorData);
  }, [exhibitorData]);

  return (
    <section className="HomeMegaShow w-full flex flex-col items-center justify-center bg-[#100249]">

      {/* Container หลักสำหรับควบคุมระยะ Padding ด้านข้างของเนื้อหา */}
      <div className="w-full flex flex-col items-center justify-center px-8 md:px-8 gap-6">

        {/* 1. Hero Banner */}
        <img
          src={
            mobile
              ? "https://worldfair.blob.core.windows.net/hms2026landing/hero_banner_mb.jpg"
              : "https://worldfair.blob.core.windows.net/hms2026landing/hero_banner_pc.jpg"
          }
          alt="landing_hero"
          className="mx-auto w-full h-auto max-w-[1040px] object-contain"
        />

        {/* 2. Atmosphere Section */}
        <div className="w-full max-w-[1040px] flex justify-center">
          <img            
            src={"https://worldfair.blob.core.windows.net/hms2026landing/atmosphere.png"}  
            alt="atmosphere_event"
            className="w-full h-auto object-contain block"
          />
        </div>

        <div className="w-full max-w-[1040px] bg-[#1c0b66] rounded-b-2xl p-4 md:p-6 flex flex-col gap-6 shadow-xl -mt-5">
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/JcSN2Fr4cR4"
              title="Home Mega Show"
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
                src="https://www.youtube.com/embed/jpuYspzCazw"
                title="Home MEGA SHOW Impressions 2"
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
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 bg-white p-6 sm:p-10 text-slate-800">

              {/* ชื่อ*/}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-800 text-sm font-semibold">ชื่อ<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"   
                  required
                  placeholder="กรอกชื่อ"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>
              
              {/* นามสกุล */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-800 text-sm font-semibold">นามสกุล<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="surname"   
                  required
                  placeholder="กรอกนามสกุล"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              {/* เบอร์โทรศัพท์ */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-800 text-sm font-semibold">
                  เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  minLength={9}
                  maxLength={10}
                  pattern="^[0-9]{9,10}$"
                  title="กรุณากรอกเบอร์โทรศัพท์เป็นตัวเลข 9 ถึง 10 หลัก (เช่น 0812345678)"
                  placeholder="08X-XXX-XXXX"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  onInput={(e) => {
                    // ช่วยกรองให้พิมพ์ได้เฉพาะตัวเลข 0-9 เท่านั้น
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                />
              </div>

              {/* email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-800 text-sm font-semibold">อีเมล<span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="example@mail.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              {/* ชื่อบริษัท / ร้านค้า */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-800 text-sm font-semibold">ชื่อบริษัท / ร้านค้า</label>
                <input
                  type="text"
                  name="company"
                  required
                  placeholder="กรอกชื่อบริษัท / ร้านค้า"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-800 text-sm font-semibold">
                  สินค้าหรือบริการของคุณอยู่ในกลุ่มใด <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {product.map((item) => (
                    <label key={item.key} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                     
                      <input
                        type="radio"
                        name="product"
                        value={item.key}
                        required
                        className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                      />
                      <span className="text-sm text-slate-700">{item.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ขนาดพื้นที่ที่สนใจ */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-800 text-sm font-semibold">ขนาดพื้นที่ที่สนใจ <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                  {space.map((item) => (
                    <label key={item.key} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                      <input
                        type="radio"
                        name="space"
                        value={item.key}
                        required
                        className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                      />
                      <span className="text-sm text-slate-700">{item.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ช่วงเวลาที่สะดวกให้ทีมงานติดต่อกลับ */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-800 text-sm font-semibold">ช่วงเวลาที่สะดวกให้ทีมงานติดต่อกลับ <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {con_time.map((item) => (
                    <label key={item.key} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                      <input
                        type="radio"
                        name="con_time"
                        value={item.key}
                        required
                        className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                      />
                      <span className="text-sm text-slate-700">{item.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ปุ่มลงทะเบียน */}
              <button
                type="submit"
                className="w-full mt-4 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-3 text-center leading-5 shadow-lg hover:scale-[1.005] active:scale-[0.995] transition-all duration-200"
                //onClick={submitData}
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