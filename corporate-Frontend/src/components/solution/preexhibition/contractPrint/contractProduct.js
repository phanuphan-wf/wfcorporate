import React, { useContext, useState, useEffect } from "react";
import { dataContext } from "./contractPrint";

export default function ContractProduct() {
  const { contractC } = useContext(dataContext);

  const [contract, setContract] = contractC;

  return (
    <section id="contract-product">
      {/*
      <div className="flex items-start max-sm:flex-wrap my-2">
        <div className="w-[150px]">
          <label htmlFor="txt-set" className="min-w-fit">
            ประเภทคูหาแสดงสินค้า
          </label>
        </div>
        <div>
          {[
            "คูหาแสดงสินค้าพร้อมอุปกรณ์ไฟฟ้ามาตรฐาน",
            "พื้นที่ว่างเปล่าผู้ จัดงานเตรียมให้เฉพาะอุปกรณ์ไฟฟ้ามาตรฐาน",
            "พื้นที่ว่างเปล่า ผู้แสดงสินค้าเป็นผู้ดำเนินการเองทั้งสิ้น",
          ].map((item, i) => (
            <div>
              <input
                type="radio"
                name="boothtype"
                id={`type-${i}`}
                value={item}
                onChange={(e) => setContract({ ...contract, type: i })}
                className="mr-2 accent-red-500"
              />
              <label htmlFor={`type-${i}`}>{item}</label>
            </div>
          ))}
        </div>
      </div>
      */}
      <div className="flex items-start max-sm:flex-wrap my-2">
        <label htmlFor="txt-product" className="w-[150px]">
          รายละเอียดสินค้า
        </label>
        <textarea
          id="txt-product"
          rows="3"
          value={contract.product}
          onChange={(e) =>
            setContract({ ...contract, product: e.target.value })
          }
          className="w-[500px] border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition duration-300 ease-in-out"
          placeholder="show product (please explain in full detail...)"
        />
      </div>
    </section>
  );
}
