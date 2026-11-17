import React from "react";

// ข้อมูลโซนทั้งหมด (export ออกไปให้ landingpage.js ใช้ map)
export const ZONES = [
  {
    headline: <>ที่สุดของงานแสดงเฟอร์นิเจอร์<br />จัดใหญ่ส่งท้ายปี</>,
    hColor: "text-[#cc6340]",
    caption: "เฟอร์นิเจอร์และสินค้าตกแต่งบ้าน",
    title: <>Furniture &amp;<br />Home Décor</>,
    accent: "from-orange-400 to-orange-600",
    image: require("./img/zone1.jpg"),
    DESC: "รวมเฟอร์นิเจอร์และของแต่งบ้านลดราคาจัดหนัก ช้อปจุใจกับสินค้าคุณภาพที่ขนทัพมาจัดดีล ดีไซน์สวยคุณภาพดี ในราคาที่สุดคุ้ม",
  },
  {
    headline: <>นวัตกรรมโซล่าร์ <span className="text-red-600">เต็มอิ่ม</span></>,
    hColor: "text-[#7895cd]",
    caption: "โซล่าร์เซลล์และสินค้าสมาร์ทโฮม",
    title: <>Solar Cell &amp;<br />Smart Home</>,
    accent: "from-sky-400 to-blue-600",
    image: require("./img/zone2.jpg"),
    DESC: "เซฟค่าไฟ ปลอดภัย สบายกระเป๋า ด้วยพลังงานทางเลือก จัดเต็มสินค้าสมาร์ทโฮมและโซลาร์เซลล์ราคาพิเศษ ครบจบเรื่องเทคโนโลยีสุดล้ำเพื่อบ้านในงานเดียว",
  },
  {
    headline: <>อยากสร้างบ้าน <span className="text-blue-700">ต้องงานนี้!</span></>,
    hColor: "text-[#7c3b94]",
    caption: "รับสร้างและออกแบบบ้าน",
    title: <>Home Builder &amp;<br />Prefab</>,
    accent: "from-purple-400 to-purple-700",
    image: require("./img/zone3.jpg"),
    DESC: "รวมแพ็กเกจสร้างบ้านและบ้านน็อกดาวน์ราคาโดนใจ จัดเต็มโปรโมชั่นพร้อมของแถมสุดเอ็กซ์คลูซีฟเฉพาะงานนี้ หมดห่วงเรื่องงบบานปลาย คุยจบง่ายได้บ้านชัวร์",
  },
  {
    headline: <>มหกรรมเครื่องใช้ไฟฟ้า <span className="text-red-600">จัดเต็ม!</span></>,
    hColor: "text-[#7895cd]",
    caption: "เครื่องใช้ไฟฟ้าและสิ่งอำนวยความสะดวก",
    title: <>Electronics &amp;<br />Home Appliances</>,
    accent: "from-sky-300 to-sky-500",
    image: require("./img/zone4.jpg"),
    DESC: "มหกรรมเครื่องใช้ไฟฟ้าลดราคาพิเศษครั้งใหญ่ส่งท้ายปี ขนทัพสินค้าแบรนด์ชั้นนำ..เปลี่ยนเรื่องงานบ้านให้เป็นเรื่องง่ายคุ้มกว่านี้ไม่มีอีกแล้ว พลาดไม่ได้เด็ดขาด!",
  },
  {
    headline: <>ต้นไม้ จัดสวน <span className="text-red-600">เพียบ!</span></>,
    hColor: "text-[#3f6c3e]",
    caption: "สินค้าเกี่ยวกับต้นไม้และการจัดสวน",
    title: <>Garden &amp;<br />Outdoor Living</>,
    accent: "from-green-500 to-green-700",
    image: require("./img/zone5.jpg"),
    DESC: "โปรโมชั่นต้นไม้และของแต่งสวนราคาโดนใจ ช้อปคุ้มจุใจกับอุปกรณ์จัดสวนลดราคาพิเศษ จัดสวนสวยในงบประหยัด สบายกระเป๋า",
  },
  {
    headline: <>ของแต่งบ้าน งานคราฟต์ <span className="text-pink-600">เพียบ!</span></>,
    hColor: "text-[#c71189]",
    caption: "Lifestyle Product, Art & Craft",
    title: <>Lifestyle Product,<br />Art &amp; Craft</>,
    accent: "from-pink-400 to-pink-600",
    image: require("./img/zone6.jpg"),
    DESC: "ช้อปเพลินกับไอเทมแต่งบ้านและงานอาร์ตราคาเบาๆ รวมสินค้าสุดอาร์ตพร้อมโปรโมชั่นสุดพิเศษเฉพาะในงาน ได้ของถูกใจในราคาที่จ่ายง่าย คุ้มค่าที่งานเดียว",
  },
  {
    headline: <>คัดสรรอาหารที่คุณไม่เคยลิ้มลอง <span className="text-red-600">อร่อย เพียบ!</span></>,
    hColor: "text-[#cf613c]",
    caption: "โซนอาหาร, เครื่องดื่ม และมุมพักผ่อน",
    title: <>Food &amp;<br />Beverage</>,
    accent: "from-orange-300 to-orange-500",
    image: require("./img/zone7.jpg"),
    DESC: "เอ็นจอยไปกับช่วงเวลาแห่งความสุขและของอร่อย แวะเติมความอร่อยด้วยเมนูโปรดและมุมนั่งเล่น ชาร์จพลังให้เต็มอิ่มก่อนลุยช้อปปิ้งกันต่อ",
  },
  {
    headline: <>เพาเวอร์บาย เอ็กซ์โป</>,
    hColor: "text-[#cc6340]",
    caption: "Power Buy EXPO",
    title: <>Power Buy<br />EXPO</>,
    accent: "from-red-500 to-red-700",
    image: require("./img/zone8.jpg"),
    DESC: "ลดแรงแซงทุกโปร! สูงสุดถึง 50% พร้อมส่วนลด Top up ผ่อนสบาย 0% นานสูงสุด 24 เดือน กับบัตรที่ร่วมรายการ ช้อปเครื่องใช้ไฟฟ้าสุดคุ้ม ต้องมาที่งานนี้เท่านั้น!",
  },
];

// ชื่อ component ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่
export default function ZoneCard({ z }) {
  return (
    <article className="flex items-center gap-3 overflow-hidden rounded-2xl bg-white p-2 shadow-md sm:gap-5 sm:p-3">
      {/* ซ้าย: รูปโปสเตอร์ */}
      <div className="relative w-[46%] shrink-0 overflow-hidden rounded-xl sm:w-[44%]">
        {z.image ? (
          <img src={z.image} alt="" className="block h-auto w-full" />
        ) : (
          <div className={`relative aspect-[4/3.4] w-full bg-gradient-to-br ${z.accent}`}>           
            <div className="absolute inset-x-0 bottom-0 bg-[#1f2a8a] px-2 py-1 text-center text-[10px] font-medium text-white sm:text-xs">
              {z.caption}
            </div>
          </div>
        )}
      </div>

      {/* ขวา: ชื่อโซน + คำอธิบาย */}
      <div className="min-w-0 flex-1 pr-2 sm:pr-4">
        <h3 className={`text-base font-bold leading-tight sm:text-xl lg:text-2xl ${z.hColor}`}>
          {z.title}
        </h3>
        <p className="mt-2 text-[10px] leading-relaxed text-slate-600 sm:text-xs">{z.DESC}</p>
      </div>
    </article>
  );
}