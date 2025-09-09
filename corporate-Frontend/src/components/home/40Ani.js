import React from "react";

export default function Ani(props) {
  return (
    <section className="home_aniversary">
      <div className="bg-gray-300 text-center py-10">
        <div className="flex justify-center">
          <div>
            <img
              src={require("./img/logo-40ani.png")}
              alt="40 aniversary"
              id={"logo40"}
              className="w-1/2 sm:w-3/4 md:w-full block mx-auto"
            />
          </div>
        </div>
        <div>
          <h2 className="text-3xl pt-4">ครบรอบ 40 ปี</h2>
        </div>
        <div>บนเส้นทางการเป็นผู้จัดงานแสดงสินค้าของ เวิลด์ แฟร์</div>
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
        <div className="px-4 text-gray-500">
          เราจะดำรงไว้ซึ่งการเป็นผู้จัดงานที่ ซื่อสัตย์
          และมีจรรยาบรรณในการจัดงาน
          <br />
          โดยมีเป้าหมายสูงสุด คือความสำเร็จของผู้แสดงสินค้า
        </div>
      </div>
    </section>
  );
}
