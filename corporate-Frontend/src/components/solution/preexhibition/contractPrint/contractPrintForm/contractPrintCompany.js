import React, { useContext } from "react";
import { dataContext } from "../contractPrint";

export default function ContractPrintCompany() {
  const { contractC } = useContext(dataContext);

  const [contract, setContract] = contractC;

  const blank = "........................................";
  return (
    <div id="contractprintcompany">
      <div className="flex justify-between">
        <div>
          <p>เลขที่ {contract.conno}</p>
        </div>
        <div className="text-right">
          <p>
            ทำที่{" "}
            {contract.at != ""
              ? contract.at
              : ".........................................."}
          </p>
          <p>
            วันที่ {contract.day !== "" ? contract.day : "...................."}{" "}
            เดือน{" "}
            {contract.month !== ""
              ? contract.month
              : ".........................."}{" "}
            พ.ศ.{" "}
            {contract.year !== ""
              ? contract.year + 543
              : "...................."}
          </p>
        </div>
      </div>
      <div className="my-3">
        <div className="flex w-full gap-4">
          <p className="min-w-fit">สัญญานี้ทำขึ้นระหว่าง</p>
          <span className="w-full border-b border-dotted text-center border-gray-800">
            {contract.company !== "" ? (
              <strong>{" " + contract.company + " "}</strong>
            ) : (
              ""
            )}
          </span>
        </div>
        <div className="flex w-full gap-4">
          <p className="min-w-fit">โดย</p>
          <div className={`${contract.pos != "" ? "w-3/5" : "w-full"}`}>
            {contract.name !== "" ? (
              <strong className="min-w-fit flex">
                (
                {["นาย", "นาง", "นางสาว"].map((p, i, arr) => (
                  <span
                    className={`${
                      i != contract.prefix ? "line-through decoration-2" : ""
                    }`}>
                    {p + (i < arr.length - 1 ? "/" : "")}
                  </span>
                ))}
                )
                <div className="w-full border-b border-dotted text-center border-gray-800">
                  {contract.name}
                </div>
              </strong>
            ) : (
              <div className="flex">
                <span className="min-w-fit pr-4">(นาย/นาง/นางสาว)</span>
                <div className="w-full border-b border-dotted text-center border-gray-800"></div>
              </div>
            )}
          </div>

          {contract.pos !== "" && (
            <div className="w-2/5 flex gap-4">
              <span className="min-w-fit">ตำแหน่ง</span>
              <strong className="w-full border-b border-dotted text-center border-gray-800">
                {contract.pos}
              </strong>
            </div>
          )}
        </div>
        <div className="w-full flex gap-4">
          <p className="min-w-fit">บัตรประจำตัวประชาชนเลขที่</p>
          {contract.pid !== "" ? (
            <strong className="w-full border-b border-dotted text-center border-gray-800">
              {contract.pid}
            </strong>
          ) : (
            <strong className="w-full border-b border-dotted text-center border-gray-800">
              {""}
            </strong>
          )}
        </div>
        <div className="flex w-full gap-4">
          <p className="min-w-fit">ที่อยู่เลขที่</p>
          <div className="w-full border-b border-dotted text-center border-gray-800">
            {contract.addr !== "" ? (
              <strong>{" " + contract.addr + " "}</strong>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="min-w-[25%] flex-grow">
            <div className="flex gap-2">
              <p className="min-w-fit">โทรศัพท์</p>
              <strong className="w-full min-w-fit border-b border-dotted text-center border-gray-800">
                {contract.tel !== "" ? contract.tel : ""}
              </strong>
            </div>
          </div>
          {contract.fax !== "" && (
            <div className="min-w-[25%] flex-grow">
              <div className="flex gap-2">
                <p className="min-w-fit">โทรสาร</p>
                <strong className="w-full min-w-fit border-b border-dotted text-center border-gray-800">
                  {contract.fax}
                </strong>
              </div>
            </div>
          )}
          {contract.email !== "" && (
            <div className="min-w-[25%] flex-grow">
              <div className="flex gap-2">
                <p className="min-w-fit">อีเมล</p>
                <strong className="w-full min-w-fit border-b border-dotted text-center border-gray-800">
                  {contract.email}
                </strong>
              </div>
            </div>
          )}
          {contract.line !== "" && (
            <div className="min-w-[25%] flex-grow">
              <div className="flex gap-2">
                <p className="min-w-fit">ไลน์ไอดี</p>
                <strong className="w-full min-w-fit border-b border-dotted text-center border-gray-800">
                  {contract.line}
                </strong>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="my-3">
        <p className="indent-8">
          ซึ่งต่อไปในสัญญานี้เรียกว่า “ผู้แสดงสินค้า” ฝ่ายหนึ่ง กับ บริษัท
          เวิลด์ แฟร์ จำกัด ตั้งอยู่เลขที่ 1,3,5,7 ซอยลาดพร้าว128/1 ถนนลาดพร้าว
          แขวงคลองจั่น เขตบางกะปิ กรุงเทพมหานคร ซึ่งต่อไปในสัญญานี้เรียกว่า
          “ผู้จัดงาน” อีกฝ่ายหนึ่ง
          คู่สัญญาทั้งสองฝ่ายได้ตกลงทำสัญญากันโดยมีรายละเอียดดังแสดงไว้ตามตารางและเงื่อนไขของสัญญาบริการพื้นที่แสดงสินค้าข้างล่างนี้
        </p>
      </div>
    </div>
  );
}
