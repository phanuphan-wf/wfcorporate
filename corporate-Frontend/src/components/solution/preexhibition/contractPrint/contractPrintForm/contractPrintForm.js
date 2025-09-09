import React, { useContext, useState, forwardRef } from "react";
import ContractPrintCompany from "./contractPrintCompany";
import ContractPrintInfo from "./contractPrintInfo";
import ContractPrintCondition from "./contractPrintCondition";
import ContractPrintFooter from "./contractPrintFooter";

function ContractPrintForm(ref, props) {
  return (
    <section
      id="contractPrintForm"
      className="w-[215mm] h-[355mm] px-[5mm] py-[10mm] text-[12px] font-sans"
    >
      <div className="flex justify-center ">
        <div className="h-[40px]">
          <img
            src={require("../img/WorldFairPNG.png")}
            alt="logo"
            className="object-cover h-full"
          />
        </div>
      </div>
      <div>
        <p className="text-center">
          บริษัท เวิลด์ แฟร์ จำกัด เลขที่ 1,3,5,7 ซอยลาดพร้าว 128/1 ถนนลาดพร้าว
          แขวงคลองจั่น เขตบางกะปิ กรุงเทพฯ 10240
          <br />
          โทรศัพท์. 02-731-1331 โทรสาร. 02-377-1121 www.worldfair.co.th email:
          operation@worldfair.co.th
        </p>
      </div>
      <div className="my-[10px]">
        <p className="text-center font-bold text-[14px] underline">
          สัญญาบริการพื้นที่แสดงสินค้า
        </p>
      </div>
      <ContractPrintCompany />
      <ContractPrintInfo />
      <ContractPrintCondition />
      <ContractPrintFooter />
    </section>
  );
}

export default ContractPrintForm;
