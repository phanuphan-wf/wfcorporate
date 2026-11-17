import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

import ClickRegist from "./clickRegist";
import ZoneCard, { ZONES } from "./zoneCard";

const EVENT_IMAGES = [
  require("./img/fur_img1.jpg"),
  require("./img/fur_img2.jpg"),
  require("./img/fur_img3.jpg"),
  require("./img/fur_img4.jpg"),
  require("./img/fur_img5.jpg"),
  require("./img/fur_img6.jpg"),
];

export default function Landingpage() {
  const { cp } = useParams();
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_reg;
  const exId = "b526";

  const clickPos = useRef(null); // ปุ่มลงทะเบียนใน hero
  const clickBottom = useRef(null); // ปุ่มลงทะเบียนในส่วน register (ด้านล่าง)
  const [fixedClick, setFixedClick] = useState(false);

  // ตั้งชื่อหน้า + ส่ง UTM (ทำครั้งเดียว)
  useEffect(() => {
    document.title = "Home Mega Show | มหกรรมสินค้าเพื่อบ้าน";

    if (cp !== undefined) {
      Axios.post(url + "/postUTM", { code: cp });
    }
  }, []);

  // ปุ่มลอยด้านบน: แสดงเมื่อเลื่อนผ่านปุ่มใน hero และซ่อนเมื่อปุ่มด้านล่างเข้ามาในหน้าจอ
  useEffect(() => {
    const onScroll = () => {
      if (!clickPos.current || !clickBottom.current) return;
      const heroTop = clickPos.current.getBoundingClientRect().top;
      const bottomTop = clickBottom.current.getBoundingClientRect().top;
      setFixedClick(heroTop < 12 && bottomTop > window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);



  return (
    <section className={`landing_${exId} text-slate-800 bg-white antialiased`}>
      <header className="relative isolate overflow-hidden bg-slate-900 text-white">
        <img
          src={require("./img/hero_banner.jpg")}
          alt="landing hero"
          id="hero_banner"         
          className="absolute inset-0 -z-10 h-full w-full origin-[50%_35%] scale-[1.3] object-cover object-[50%_35%] md:scale-100 md:object-[50%_20%] [-webkit-mask-image:linear-gradient(to_bottom,black,rgba(0,0,0,0.5))] [mask-image:linear-gradient(to_bottom,black,rgba(0,0,0,0.5))]"
        />

        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 5%, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0) 100%)",
          }}
        />

        <div className="mx-auto max-w-6xl px-5 pt-5 pb-28 md:px-8 md:pb-32">
          <a href="/b526" className="inline-block">
            <img src={require("./img/logo.png")} alt="World Fair" className="h-8 w-auto md:h-10" />
          </a>

          <div className="mt-8 flex flex-col items-center md:mt-12">
        
            <div class="flex flex-col mt-2 md:-mt-6 lg:-mt-5">
                <h1 className="mt-0 md:mt-4 lg:mt-20">
                <img
                  src={require("./img/hero.png")}
                  alt="Home Mega Show"
                  className="mx-auto block h-auto w-[240px] sm:w-[280px] md:w-[380px] lg:w-[600px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                />
              </h1>
            </div>

            {/* ข้อความ: มือถืออยู่กลาง เว้นช่องให้เห็นโซฟา / PC ชิดซ้ายใต้ชื่องาน */}
            <div className="mt-[6.5rem] text-center text-sm leading-relaxed sm:mt-[9.5rem] md:mt-5 md:self-start md:text-left md:text-base [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
              <p>ที่สุดของงานแสดงเฟอร์นิเจอร์</p>
              <p>มหกรรมสินค้าเพื่อบ้าน จัดใหญ่ส่งท้ายปี</p>
              <p>5 - 13 ธ.ค. นี้ ที่ไบเทค บางนา</p>
              <p>Hall 101-104 &nbsp;10.30-20.30 น.</p>

              <div ref={clickPos} className="mt-6 flex justify-center md:justify-start">
                <ClickRegist cp={cp} exId={exId} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ปุ่มลอย */}
      {fixedClick && (
        <div className="pointer-events-none fixed inset-x-0 top-3 z-[999] flex justify-center px-4">
          <div className="pointer-events-auto">
            <ClickRegist cp={cp} exId={exId} />
          </div>
        </div>
      )}

      <main>
        {/* ================= ZONES ================= */}
        <section className="relative -mt-16 rounded-t-[2rem] bg-[#0a3578] px-4 pt-3 pb-6 md:-mt-10 md:rounded-t-[2.5rem] md:pb-8">
          <div className="mx-auto max-w-6xl px-5 pt-5 pb-4 md:pb-6">
            <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-white sm:text-base">
              มหกรรมเพื่อบ้านที่ยิ่งใหญ่ที่สุด รวบรวมทุกความต้องการเรื่องบ้านไว้ ครบจบที่งานเดียว! <br />
              จัดเต็มทุกโซนสินค้าดีลพิเศษเฉพาะภายในงาน ที่จะทำให้การแต่งบ้านเป็นเรื่องง่ายและสนุกกว่าเดิม!
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
              {ZONES.map((z, i) => (
                <ZoneCard key={i} z={z} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= EVENT PHOTOS ================= */}
        <section id="event" className="bg-white px-4 py-4 md:py-12">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3 lg:gap-5">
            {EVENT_IMAGES.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`บรรยากาศภายในงาน ${i + 1}`}
                className="aspect-[5/5] w-full rounded-xl object-cover"
              />
            ))}
          </div>
        </section>

        {/* ================= REGISTER / GIFT ================= */}
        <section id="register" className="bg-white px-4 py-4 md:py-3">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-slate-700">
              ลงทะเบียนเข้าชมงาน
              <br />
              เพื่อรับของสมนาคุณ และสิทธิพิเศษมากมาย
            </p>

            {/* ปุ่มลงทะเบียนด้านล่าง: ใช้เป็นจุดอ้างอิงให้ปุ่มลอยซ่อนตัว */}
            <div ref={clickBottom} className="mt-2 flex justify-center">
              <ClickRegist cp={cp} exId={exId} />
            </div>

            {/* กล่องครอป: ซ่อนขอบขาวรอบรูป */}
            <div className="mx-auto aspect-[5/4] w-[90%] overflow-hidden lg:w-full">
              <img
                src={require("./img/gift_B526.jpg")}
                alt="premium bag"
                id="premium"
                className="h-full w-full scale-[1.35] object-cover object-center"
              />
            </div>
          </div>
        </section>

        {/* ================= SPONSOR ================= */}
        <section className="bg-white px-4 pb-16 md:pb-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-lg font-medium text-[#1f2a8a]">Sponsored by</h2>
            <img
              src={require("./img/sponsor_B526.jpg")}
              alt="sponsor"
              className="mx-auto mt-4 w-[90%] rounded-2xl lg:w-full"
            />
            <img
              src={require("./img/sponsor_B526_2.jpg")}
              alt="sponsor"
              className="mx-auto mt-2 w-[90%] rounded-2xl lg:w-full"
            />
          </div>
        </section>
      </main>
    </section>
  );
}