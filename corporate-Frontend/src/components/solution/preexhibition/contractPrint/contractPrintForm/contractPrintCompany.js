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
        <p className="whitespace-normal break-all indent-8">
          สัญญานี้ทำขึ้นระหว่าง
          {contract.company !== "" ? (
            <strong>{" " + contract.company + " "}</strong>
          ) : (
            blank
          )}
          โดย
          {contract.name !== "" ? (
            <strong>
              (
              {["นาย", "นาง", "นางสาว"].map((p, i, arr) => (
                <span
                  className={`${
                    i != contract.prefix ? "line-through decoration-2" : ""
                  }`}
                >
                  {p + (i < arr.length - 1 ? "/" : "")}
                </span>
              ))}
              ){" " + contract.name + " "}
            </strong>
          ) : (
            "(นาย/นาง/นางสาว) " + blank + " "
          )}
          {contract.pos !== "" && (
            <span>
              ตำแหน่ง
              <strong>{" " + contract.pos + " "}</strong>
            </span>
          )}
          บัตรประจำตัวประชาชนเลขที่
          {contract.pid !== "" ? (
            <strong>{" " + contract.pid + " "}</strong>
          ) : (
            " " + blank + " "
          )}
          ที่อยู่เลขที่
          <strong>
            {contract.addr !== "" ? (
              <strong>{" " + contract.addr + " "}</strong>
            ) : (
              " " + blank + " "
            )}
          </strong>
          โทรศัพท์
          <strong>
            {contract.tel !== "" ? (
              <strong>{" " + contract.tel + " "}</strong>
            ) : (
              " " + blank + " "
            )}
          </strong>
          {contract.fax !== "" && (
            <>
              โทรสาร
              <strong>{" " + contract.fax + " "}</strong>
            </>
          )}
          {contract.email !== "" && (
            <>
              อีเมล
              <strong>{" " + contract.email + " "}</strong>
            </>
          )}
          {contract.line !== "" && (
            <>
              ไลน์ไอดี
              <strong>{" " + contract.line + " "}</strong>
            </>
          )}
        </p>
      </div>
      <div className="my-3">
        <p className="indent-8">
          ซึ่งต่อไปในสัญญานี้เรียกว่า “ผู้แสดงสินค้า” ฝ่ายหนึ่ง และ บริษัท
          เวิลด์ แฟร์ จำกัด ตั้งอยู่เลขที่ 1,3,5,7 ซอยลาดพร้าว128/1 ถนนลาดพร้าว
          แขวงคลองจั่น เขตบางกะปิ กรุงเทพมหานคร ซึ่งต่อไปในสัญญานี้เรียกว่า
          “ผู้จัดงาน” อีกฝ่ายหนึ่ง
          คู่สัญญาทั้งสองฝ่ายได้ตกลงทำสัญญากันโดยมีรายละเอียดดังแสดงไว้ตามตารางและเงื่อนไขของสัญญาบริการพื้นที่แสดงสินค้าข้างล่างนี้
        </p>
      </div>
    </div>
  );
}
