import React, { useState, useContext } from "react";
import { dataContext } from "../contractPrint";

export default function ContractPrintFooter() {
  const { contractC } = useContext(dataContext);

  const [contract, setContract] = contractC;

  const blank = "........................................";
  return (
    <div id="contractprintfooter" className="mt-5">
      <div className="grid grid-cols-2">
        <div className="text-center">
          ลงชื่อ .....................................................
          ผู้แสดงสินค้า
          <br />
          (......
          {contract.name !== "" ? (
            <strong>
              {["นาย", "นาง", "นางสาว"].filter(
                (x, i) => i == contract.prefix
              )[0] +
                contract.name +
                " "}
            </strong>
          ) : (
            blank
          )}
          ......)
        </div>
        <div className="text-center">
          ลงชื่อ ..................................................... ผู้จัดงาน
          <br />
          (..............................................)
        </div>
      </div>
      <div className="grid grid-cols-2 mt-3">
        <div className="text-center">
          ลงชื่อ ..................................................... พยาน
          <br />
          (..............................................)
        </div>
        <div className="text-center">
          ลงชื่อ ..................................................... พยาน
          <br />
          (..............................................)
        </div>
      </div>
    </div>
  );
}
