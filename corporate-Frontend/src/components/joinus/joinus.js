import React, { useState } from "react";

export default function Joinus(props) {
  const [data, setData] = useState([
    {
      title: "HR Officer",
      post: "18/6/2023",
      urgent: false,
    },
    {
      title: "ผู้ช่วยผู้จัดการฝ่ายขาย",
      post: "14/6/2023",
      urgent: true,
    },
    {
      title: "เจ้าหน้าที่ฝ่ายขายพื้นที่แสดงสินค้า",
      post: "14/6/2023",
      urgent: false,
    },
  ]);
  return (
    <section className="join my-10">
      <div className="headline mb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-center">
            ร่วมงานกับเรา
          </h1>
        </div>
        <div className="flex justify-center py-4 mb-5">
          <svg height={10} width={160}>
            <line
              x1="0"
              y1="0"
              x2="160"
              y2="0"
              style={{ stroke: "rgb(255,0,0)", strokeWidth: "5px" }}
            />
          </svg>
        </div>
      </div>
      <div className="lg:container px-4">
        <img
          src={require("./img/joinwf.png")}
          alt="joinus"
          id="joinwf"
          className="block mx-auto"
        />
      </div>
      <div className="px-4 sm:px-11 lg:px-20 xl:px-28 my-6">
        <p className="w-full sm:w-3/4 md:w-2/3 text-center mx-auto mb-6">
          เราผู้ดำเนินธุรกิจด้านการจัดงานแสดงสินค้าและออร์กาไนเซอร์
          ที่มีประสบการณ์มากกว่า 40 ปี
          เราเป็นผู้นำด้านการจัดงานแสดงสินค้าเฟอร์นิเจอร์และของตกแต่งบ้านของประเทศไทย
          อาทิเช่น Home Mega Show , Furniture Mega Show, Home Décor, Bangkok
          Furniture Fair, Furniture Living & Design, เฟอร์นิเจอร์โชว์,
          เฟอร์นิเจอร์แฟร์, และ Furniture Fair
        </p>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-5 w-full sm:w-[90%] lg:w-4/5 mx-auto">
          <div className="md:col-span-2 py-1 bg-slate-200 text-center">
            ตำแหน่งที่เปิดรับ
          </div>
          <div className="py-1 bg-slate-200 text-center hidden md:block">
            สนใจฝากข้อมูล
          </div>
        </div>
        {data.map((d, i) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full sm:w-[90%] lg:w-4/5 mx-auto mt-5 mb-3">
            <div
              className={`text-center sm:text-left md:col-span-2 ${
                d.urgent && "text-red-500"
              }`}
            >
              {d.title}
              {d.urgent && " ** ด่วน!"}
            </div>
            <div className="grid grid-cols-2 gap-4 w-1/2 sm:w-full mx-auto">
              <div className="text-white bg-red-500 text-center h-fit py-1">
                รายละเอียด
              </div>
              <div className="text-white bg-red-500 text-center h-fit py-1 cursor-pointer">
                <a href="mailto:saychon.p@worldfair.co.th">ส่งใบสมัคร</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
