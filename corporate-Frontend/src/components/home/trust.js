import React from "react";

import handico from "./img/hand.svg";
import trustico from "./img/trust.svg";
import believeico from "./img/believe.svg";

export default function Trust(props) {
  return (
    <section className="home_trust">
      <div className="py-14 px-8 sm:px-24 md:px-5 lg:container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="flex flex-col items-center">
            <div className="text-red-500 text-5xl font-medium">40+</div>
            <div className="text-center pt-2">
              ประสบการณ์ และความเชี่ยวชาญมากกว่า 40 ปี
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-red-500 text-5xl font-medium">300+</div>
            <div className="text-center pt-2">
              มากกว่า 300 งาน การจัดแสดงที่ประสบความสำเร็จ
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-red-500 text-5xl font-medium">2500+</div>
            <div className="text-center pt-2">
              ด้วยจำนวนคู่ค้ามากกว่า 2,500 ราย ที่ไว้ใจและร่วมกับเรา
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-red-500 text-5xl font-medium">200+</div>
            <div className="text-center pt-2">
              ลูกค้าระดับองค์กร บริษัทและ แบรนด์ชั้นนำ มากกว่า 200 แบรนด์
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-4">
          <div className="flex flex-col items-center bg-gray-300 p-6">
            <img src={handico} alt="hand" />
            <div className="font-medium py-1">เชื่อมือ</div>
            <div className="text-center px-1 text-sm">
              การเปลี่ยนแปลงของสังคมในโลกยุคดิจิทัล จึงจำเป็นต้องมีฐานข้อมูล
              ความรู้ และนี่คือประสบการณ์ 40 ปีของ เวิลด์ แฟร์
            </div>
          </div>
          <div className="flex flex-col items-center bg-gray-300 p-6">
            <img src={trustico} alt="trust" />
            <div className="font-medium py-1">เชื่อใจ</div>
            <div className="text-center px-1 text-sm">
              ความซื่อสัตย์ และจริงใจ ที่มีต่อพันธมิตรคู่ค้า จึงเชื่อใจได้ว่า
              ในทุกอีเวนท์ของเวิลด์ แฟร์ จะไม่ทำให้พันธมิตรคู่ค้าผิดความคาดหวัง
            </div>
          </div>
          <div className="flex flex-col items-center bg-gray-300 p-6">
            <img src={believeico} alt="believe" />
            <div className="font-medium py-1">เชื่อมั่น</div>
            <div className="text-center px-1 text-sm">
              การพัฒนาอย่างไม่หยุดยั้ง เพื่อคงความเป็นมืออาชีพ
              และปณิธานที่ต้องเป็นที่หนึ่งในใจ ของพันธมิตรคู่ค้า
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
