import React from "react";

export default function Exp(props) {
  const files = [
    "Logo Ex.png",
    "Logo Ex-1.png",
    "Logo Ex-2.png",
    "Logo Ex-3.png",
    "Logo Ex-4.png",
    "Logo Ex-5.png",
    "Logo Ex-6.png",
    "Logo Ex-7.png",
  ];

  const logoShow = () => {
    files.map((l, i) => {
      console.log(l, i);
      return (
        <div>
          <img src={require("./img/" + l)} />
        </div>
      );
    });
  };

  return (
    <section className="home_exp">
      <div className="py-12 text-center lg:container">
        <h1 className="text-4xl md:text-6xl">เวิลด์ แฟร์</h1>
        <div className="flex justify-center py-4">
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
        <div className="px-6 sm:px-20 md:px-40">
          <p>
            เราเป็นผู้ดำเนินการจัดงานแสดงสินค้า ที่มีประสบการณ์มากกว่า 40 ปี
            และเป็นที่ยอมรับจากผู้ประกอบการทั่วประเทศ
            ทำให้เรามีศักยภาพในการจัดงานแสดงสินค้า มากกว่า 8 ครั้งต่อปี
            ด้วยประเภทงานแสดงสินค้าที่หลากหลาย
            เพื่อตอบโจทย์ความต้องการของผู้บริโภคและทิศทางการตลาด
            ที่ปรับเปลี่ยนไปตามยุคสมัย
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 pt-8 px-5 sm:px-10 md:px-16">
          {files.map((l, i) => (
            <div className="flex justify-center">
              <img src={require("./img/" + l)} key={"logo-ex-" + i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
