import React, { useState, useContext } from "react";

import { dataContext } from "./survey";

export default function VisQOffent(props) {
  const { dataC } = useContext(dataContext);

  const [data, setData] = dataC;

  return (
    <div id="section1" className="mb-3">
      <label htmlFor="offent" className="block md:text-lg">
        ท่านเข้ามาเยี่ยมชมงานแสดงสินค้าเกี่ยวกับบ้านบ่อยแค่ไหน?
      </label>
      <select
        className="cmb min-w-fit md:text-lg"
        id="offent"
        onChange={(e) => setData({ ...data, offen: e.target.value })}
      >
        <option value={0} selected hidden disabled>
          กรุณาเลือก
        </option>
        {[
          "ทุกงาน",
          "เดือนละครั้ง",
          "เฉพาะโอกาสที่ต้องการซื้อสินค้า",
          "ครั้งแรก",
        ].map((o, i) => (
          <option value={i + 1}>{o}</option>
        ))}
      </select>
    </div>
  );
}
