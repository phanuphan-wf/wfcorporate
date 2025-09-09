import React, { useState, useEffect } from "react";

export default function PrintFooter(props) {
  const [sum, setSum] = useState({});
  const [total, setTotal] = useState({});
  const [listsum, setListsum] = useState({});

  useEffect(() => {
    setSum(props.summary);
  }, [props.summary]);

  useEffect(() => {
    setTotal(props.total);
  }, [props.total]);

  useEffect(() => {
    setListsum(props.listsum);
  }, [props.listsum]);

  return (
    <div
      id="print-footer"
      className="grid grid-cols-2 grid-flow-col auto-cols-auto gap-4 mb-4"
    >
      <div>
        <div className="grid grid-cols-3 mt-3">
          <div className="text-center relative">
            รวมเช็ค.................................ฉบับ
            <div className="text-center w-[90px] absolute -top-[5px] left-[70px] text-[12px]">
              {listsum.cheque}
            </div>
          </div>
          <div className="text-center relative">
            รวม TAX.................................ฉบับ
            <div className="text-center w-[90px] absolute -top-[5px] left-[75px] text-[12px]">
              {listsum.Tax}
            </div>
          </div>
          <div className="text-center relative">
            รวมเงินสด.................................บาท
            <div className="text-right w-[90px] absolute -top-[5px] left-[80px] text-[12px]">
              {Object.keys(listsum).length != 0
                ? listsum.TotalCa.toFixed(2).replace(
                    /(\d)(?=(\d{3})+(?!\d))/g,
                    "$1,"
                  )
                : "0.00"}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 mt-5">
          <div className="text-center">
            ผู้ส่งเช็ค..................................................................
          </div>
          <div className="text-center">
            ผู้รับเช็ค..................................................................
          </div>
        </div>
      </div>
      {Object.keys(sum).length !== 0 && (
        <div>
          <div className="grid grid-cols-[1fr_1.5fr_1fr_1.5fr]  border-zinc-600 first:border-l-2 *:border-r-2 *:border-zinc-600 border-t-2 *:border-b-2">
            <div className="px-1">ยอดรับยกมา</div>
            <div
              className={`px-1 ${
                sum.preBalance !== "" ? "text-right" : "text-center"
              }`}
            >
              {sum.preBalance !== ""
                ? sum.preBalance
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                : "-"}
            </div>
            <div className="px-1">TAX ยกมา</div>
            <div
              className={`px-1 ${
                sum.preTax !== "" ? "text-right" : "text-center"
              }`}
            >
              {sum.preTax !== ""
                ? sum.preTax
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                : "-"}
            </div>

            <div className="px-1">ยอดรับหน้านี้</div>
            <div
              className={`px-1 ${
                sum.pageAmount !== "" ? "text-right" : "text-center"
              }`}
            >
              {sum.pageAmount !== ""
                ? sum.pageAmount
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                : "-"}
            </div>
            <div className="px-1">TAX หน้านี้</div>
            <div
              className={`px-1 ${
                sum.pageTax !== "" ? "text-right" : "text-center"
              }`}
            >
              {sum.pageTax !== ""
                ? sum.pageTax
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                : "-"}
            </div>
            <div className="px-1">ยอดรับรวมทั้งสิ้น</div>
            <div
              className={`px-1 ${
                sum.AccAmount !== "" ? "text-right" : "text-center"
              }`}
            >
              {sum.AccAmount !== ""
                ? sum.AccAmount.toFixed(2).replace(
                    /(\d)(?=(\d{3})+(?!\d))/g,
                    "$1,"
                  )
                : "-"}
            </div>
            <div className="px-1">TAX รับรวม</div>
            <div
              className={`px-1 ${
                sum.AccTax !== "" ? "text-right" : "text-center"
              }`}
            >
              {sum.AccTax !== ""
                ? sum.AccTax.toFixed(2).replace(
                    /(\d)(?=(\d{3})+(?!\d))/g,
                    "$1,"
                  )
                : "-"}
            </div>
            <div className="px-1">ยอดขายรวม</div>
            <div className={`px-1 ${total ? "text-right" : "text-center"}`}>
              {total
                ? total.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                : "-"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
