import React, { useState, useContext, useEffect } from "react";
import { dataContext } from "../contractPrint";

export default function ContractPrintCompany() {
  const { contractC } = useContext(dataContext);

  const [contract, setContract] = contractC;

  const blank = "........................................";

  useEffect(() => {
    console.log("contractC", contract);
  }, [contract]);
  return (
    <div id="contractprintinfo" className="my-3">
      <table className="w-full">
        <tbody>
          <tr className="border border-black">
            <td className="pl-4">รายละเอียดของงานแสดงสินค้า</td>
            <td className="border-l border-black px-2">
              งานแสดงสินค้า <strong>{" " + contract.exname}</strong>
              <br />
              สถานที่ <strong>{" " + contract.venue}</strong> <br />
              วันที่แสดง <strong>{" " + contract.date + " "}</strong> เวลา{" "}
              <strong>{" " + contract.time}</strong>
            </td>
          </tr>
          <tr className="border border-black">
            <td className="pl-4">รายละเอียดของพื้นที่แสดงสินค้า</td>
            <td className="border-l border-black px-2">
              หมายเลขบูธ{" "}
              {contract.booth !== "" ? (
                <strong>{" " + contract.booth.toUpperCase() + " "}</strong>
              ) : (
                blank
              )}
              พื้นที่โดยประมาณ{" "}
              {contract.space !== "" ? (
                <strong>{" " + contract.space + " "}</strong>
              ) : (
                blank
              )}
              ตารางเมตร
            </td>
          </tr>
          <tr id="product" className="border border-black h-[52px]">
            <td className="pl-4">
              รายละเอียดของสินค้าที่นำมาแสดง
              <br />
              (โปรดระบุให้ละเอียด)
            </td>
            <td className="border-l border-black px-2">
              <strong>{" " + contract.product}</strong>
            </td>
          </tr>
          <tr className="border border-black">
            <td className="pl-4">ค่าบริการพื้นที่แสดงสินค้า</td>
            <td className="border-l border-black px-2">
              <div className="flex flex-col justify-center w-fit">
                <div className="text-left">
                  รวมเป็นเงินทั้งสิ้น{" "}
                  {contract.cost !== "" ? (
                    <strong>
                      {" " +
                        Number(contract.cost)
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
                        " "}
                    </strong>
                  ) : (
                    blank
                  )}
                  บาท (ราคารวมภาษีมูลค่าเพิ่มแล้ว)
                </div>
                <div className="text-center" id="costtext">
                  (จำนวนเงินเป็นตัวอักษร)
                </div>
                <div className="text-center" id="costtext-text">
                  {contract.cost !== "" ? (
                    <strong>{" " + contract.costtext}</strong>
                  ) : (
                    "........................................................................................................."
                  )}
                </div>
              </div>
            </td>
          </tr>
          <tr className="border border-black">
            <td className="pl-4">การชำระเงิน</td>
            <td className="border-l border-black px-2">
              1.ชำระเงินส่วนแรก{" "}
              <strong>
                {contract.deposit !== "" ? (
                  <strong>
                    {" " +
                      Number(contract.deposit)
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
                      " "}
                  </strong>
                ) : (
                  blank
                )}
              </strong>
              บาท ภายใน{" "}
              <strong>
                {contract.wtndep !== "" ? (
                  <strong>{" " + contract.wtndep + " "}</strong>
                ) : (
                  blank
                )}
              </strong>
              <br />
              2.ชำระเงินส่วนที่สอง{" "}
              <strong>
                {contract.pay1 !== "" ? (
                  <strong>
                    {" " +
                      Number(contract.pay1)
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
                      " "}
                  </strong>
                ) : (
                  blank
                )}
              </strong>
              บาท ภายใน{" "}
              <strong>
                {contract.wtn1 !== "" ? (
                  <strong>{" " + contract.wtn1 + " "}</strong>
                ) : (
                  blank
                )}
              </strong>
              <br />
              3.ชำระเงินส่วนที่เหลือ{" "}
              {contract.pay2 !== "" ? (
                <strong>
                  {" " +
                    Number(contract.pay2)
                      .toFixed(2)
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
                    " "}
                </strong>
              ) : (
                blank
              )}
              บาท ภายใน{" "}
              {contract.pay2 !== "" ? (
                <strong>{" " + contract.wtn2}</strong>
              ) : (
                blank
              )}
              {contract.cheque !== "" ? (
                <div>
                  โดยสั่งจ่ายเป็นเช็คล่วงหน้า ภายในวันที่ {contract.cheque}
                </div>
              ) : (
                ""
              )}
            </td>
          </tr>
          <tr className="border border-black">
            <td className="pl-4">กำหนดการงานแสดงสินค้า</td>
            <td className="border-l border-black grid grid-cols-[1.2fr_1fr_1.2fr]">
              <div className="text-center border-r border-black">
                <div>วันตกแต่งพื้นที่และนำสินค้าเข้าพื้นที่</div>
                <div>
                  วันที่{" "}
                  <strong>
                    {contract.movein1 !== "" ? (
                      <strong>{" " + contract.movein1}</strong>
                    ) : (
                      blank
                    )}
                  </strong>{" "}
                </div>
                <div>
                  เวลา{" "}
                  <strong>
                    {contract.mit1 !== "" ? (
                      <strong>{" " + contract.mit1}</strong>
                    ) : (
                      blank
                    )}
                  </strong>
                </div>
                {contract.movein2 !== "" && (
                  <div>
                    <div className="px-6">
                      <div className="border-t"></div>
                    </div>
                    <div>
                      วันที่ <strong>{" " + contract.movein2 + " "}</strong>{" "}
                    </div>
                    <div>
                      เวลา <strong>{" " + contract.mit2}</strong>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-r border-black text-center">
                <div>วันแสดงสินค้าระหว่างวันที่</div>
                <div>
                  <strong>
                    {contract.date !== "" ? (
                      <strong>{" " + contract.date}</strong>
                    ) : (
                      blank
                    )}
                  </strong>{" "}
                </div>
                <div>
                  เวลา{" "}
                  <strong>
                    {contract.time !== "" ? (
                      <strong>{" " + contract.time}</strong>
                    ) : (
                      blank
                    )}
                  </strong>
                </div>
              </div>
              <div className="text-center">
                <div>วันรื้อถอนคูหาและขนย้ายสินค้ากลับ</div>
                <div>
                  วันที่{" "}
                  <strong>
                    {contract.moveout1 !== "" ? (
                      <strong>{" " + contract.moveout1 + " "}</strong>
                    ) : (
                      blank
                    )}
                  </strong>{" "}
                </div>
                <div>
                  เวลา{" "}
                  <strong>
                    {contract.mot1 !== "" ? (
                      <strong>{" " + contract.mot1 + " "}</strong>
                    ) : (
                      blank
                    )}
                  </strong>
                </div>
                {contract.moveout2 !== "" && (
                  <div>
                    <div className="px-6">
                      <div className="border-t"></div>
                    </div>
                    <div>
                      วันที่ <strong>{" " + contract.moveout2 + " "}</strong>
                    </div>
                    <div>
                      เวลา <strong>{" " + contract.mot2}</strong>
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
          {/*
          <tr className="border border-black">
            <td className="pl-4">ประเภทของคูหาแสดงสินค้า</td>
            <td className="border-l border-black px-2">
              <strong>
                {
                  [
                    "คูหาแสดงสินค้าพร้อมอุปกรณ์ไฟฟ้ามาตรฐาน",
                    "พื้นที่ว่างเปล่าผู้ จัดงานเตรียมให้เฉพาะอุปกรณ์ไฟฟ้ามาตรฐาน",
                    "พื้นที่ว่างเปล่า ผู้แสดงสินค้าเป็นผู้ดำเนินการเองทั้งสิ้น",
                  ].filter((item, i) => contract.type === i)[0]
                }
              </strong>
            </td>
          </tr>
          */}
        </tbody>
      </table>
    </div>
  );
}
