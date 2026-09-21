import React from "react";

import { MdLocationOn } from "react-icons/md";
import { MdAvTimer } from "react-icons/md";

import Footer from "../layout/Footer";

export default function Submit(props) {
  return (
    <section className="Submit w-full min-h-screen flex flex-col items-center justify-between bg-[#100249] pt-12 pb-0 px-4">
      
      {/* Card Container สำหรับข้อความขอบคุณ */}
      <div className="w-full max-w-[800px] bg-[#1c0b66]/90 border border-purple-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm text-center my-auto flex flex-col items-center gap-6">
        
        {/* ไอคอนเครื่องหมายถูก (Check Icon) */}
        <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center text-emerald-400 text-4xl shadow-[0_0_20px_rgba(52,211,153,0.3)] animate-bounce">
          ✓
        </div>

        {/* หัวข้อหลัก */}
        <h1 className="text-xl sm:text-3xl font-bold text-yellow-400 leading-relaxed tracking-wide">
          ขอบคุณที่สนใจเป็นส่วนหนึ่งของ <br className="hidden sm:block" />
          <span className="text-white">HOME MEGA SHOW 2026</span>
        </h1>

        {/* ข้อความแจ้งเตือน */}
        <p className="text-base sm:text-lg text-slate-200 font-medium">
          ทีมงานได้รับข้อมูลของคุณเรียบร้อยแล้ว
        </p>

        {/* ข้อความรายละเอียด */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl bg-white/5 p-4 sm:p-6 rounded-2xl border border-white/10">
          ฝ่ายขายจะติดต่อกลับเพื่อส่ง <strong className="text-yellow-300 font-semibold">Floor Plan, Booth Rate และ Special Package</strong> พร้อมแนะนำพื้นที่ที่เหมาะกับธุรกิจของคุณ
        </p>

        {/* เส้นแบ่ง */}
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent my-2" />

        {/* รายละเอียดวัน-สถานที่ */}
        <div className="flex flex-col gap-2">
          <p className="text-base sm:text-lg font-semibold text-yellow-400">
            แล้วพบกันที่ HOME MEGA SHOW 2026
          </p>
          <p className="text-xs sm:text-sm text-purple-200 tracking-wider uppercase font-medium">
            The Ultimate Event for Home, Furniture & Living
          </p>
          <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 bg-purple-900/60 text-slate-100 px-5 py-2.5 rounded-full border border-purple-400/40 text-xs sm:text-sm font-semibold shadow-inner">
            {/* วันที่ */}
            <span className="inline-flex items-center gap-1.5">
              <MdAvTimer className="text-yellow-400 text-base sm:text-lg flex-shrink-0" />
              <span>5–13 ธันวาคม 2569</span>
            </span>

            {/* เส้นแบ่ง */}
            <span className="text-purple-400/60 hidden sm:inline">|</span>

            {/* สถานที่ */}
            <span className="inline-flex items-center gap-1.5">
              <MdLocationOn className="text-red-400 text-base sm:text-lg flex-shrink-0" />
              <span>ไบเทค บางนา</span>
            </span>
          </div>
        </div>

      </div>

      {/* Footer ติดขอบล่าง */}
      <div className="w-full mt-10">
        <Footer show={1} />
      </div>

    </section>
  );
}