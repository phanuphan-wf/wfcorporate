import React from "react";
import { useTranslation } from "react-i18next";

// ข้อมูลโซน: เก็บเฉพาะค่าที่ไม่ขึ้นกับภาษา
// ข้อความ caption / DESC ดึงจากไฟล์แปล: landing2.zones.<id>.caption / .desc
// title เป็นชื่อโซนภาษาอังกฤษ ใช้เหมือนกันทั้งสองภาษา
export const ZONES = [
  {
    id: "z1",
    hColor: "text-[#cc6340]",
    title: <>Furniture &amp;<br />Home Décor</>,
    accent: "from-orange-400 to-orange-600",
    image: require("./img/zone1.jpg"),
  },
  {
    id: "z2",
    hColor: "text-[#7895cd]",
    title: <>Solar Cell &amp;<br />Smart Home</>,
    accent: "from-sky-400 to-blue-600",
    image: require("./img/zone2.jpg"),
  },
  {
    id: "z3",
    hColor: "text-[#7c3b94]",
    title: <>Home Builder &amp;<br />Prefab</>,
    accent: "from-purple-400 to-purple-700",
    image: require("./img/zone3.jpg"),
  },
  {
    id: "z4",
    hColor: "text-[#7895cd]",
    title: <>Electronics &amp;<br />Home Appliances</>,
    accent: "from-sky-300 to-sky-500",
    image: require("./img/zone4.jpg"),
  },
  {
    id: "z5",
    hColor: "text-[#3f6c3e]",
    title: <>Garden &amp;<br />Outdoor Living</>,
    accent: "from-green-500 to-green-700",
    image: require("./img/zone5.jpg"),
  },
  {
    id: "z6",
    hColor: "text-[#c71189]",
    title: <>Lifestyle Product,<br />Art &amp; Craft</>,
    accent: "from-pink-400 to-pink-600",
    image: require("./img/zone6.jpg"),
  },
  {
    id: "z7",
    hColor: "text-[#cf613c]",
    title: <>Food &amp;<br />Beverage</>,
    accent: "from-orange-300 to-orange-500",
    image: require("./img/zone7.jpg"),
  },
  {
    id: "z8",
    hColor: "text-[#cc6340]",
    title: <>Power Buy<br />EXPO</>,
    accent: "from-red-500 to-red-700",
    image: require("./img/zone8.jpg"),
  },
];

export default function ZoneCard({ z }) {
  // hook ต้องเรียกภายใน component เท่านั้น
  const { t } = useTranslation("landing", { keyPrefix: "landing2" });

  return (
    <article className="flex items-center gap-3 overflow-hidden rounded-2xl bg-white p-2 shadow-md sm:gap-5 sm:p-3">
      {/* ซ้าย: รูปโปสเตอร์ */}
      <div className="relative w-[46%] shrink-0 overflow-hidden rounded-xl sm:w-[44%]">
        {z.image ? (
          <img src={z.image} alt={t(`zones.${z.id}.caption`)} className="block h-auto w-full" />
        ) : (
          <div className={`relative aspect-[4/3.4] w-full bg-gradient-to-br ${z.accent}`}>
            <div className="absolute inset-x-0 bottom-0 bg-[#1f2a8a] px-2 py-1 text-center text-[10px] font-medium text-white sm:text-xs">
              {t(`zones.${z.id}.caption`)}
            </div>
          </div>
        )}
      </div>

      {/* ขวา: ชื่อโซน + คำอธิบาย */}
      <div className="min-w-0 flex-1 pr-2 sm:pr-4">
        <h3 className={`text-base font-bold leading-tight sm:text-xl lg:text-2xl ${z.hColor}`}>
          {z.title}
        </h3>
        <p className="mt-2 text-[10px] leading-relaxed text-slate-600 sm:text-xs">
          {t(`zones.${z.id}.desc`)}
        </p>
      </div>
    </article>
  );
}