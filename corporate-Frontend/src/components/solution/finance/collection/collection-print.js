import React, { useEffect, useState, useContext } from "react";
import { CollectionContext } from "./collectionContext";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";

import PrintFooter from "./collection-print-footer";

export default function Reportprint(props) {
  const url = process.env.PUBLIC_URL + process.env.REACT_APP_Finance_api;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { collection } = useContext(CollectionContext);

  const f_month = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  function correctDate(d) {
    let dd = "";
    let mm = "";
    let yy = "";

    d = d.substring(0, d.indexOf("T"));

    yy = d.substring(0, d.indexOf("-"));
    let mi = d.substring(d.indexOf("-") + 1, d.indexOf("-") + 3);
    dd = d.substring(d.length - 2);

    const month = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];

    month.map((m, i) => {
      if (i + 1 === Number(mi)) {
        mm = m;
      }
    });

    return dd + " " + mm + " " + (Number(yy) + 543);
  }

  const [data, setData] = useState([]);
  const [sum, setSum] = useState({});
  const [total, setTotal] = useState({});
  const [pdate, setPdate] = useState({});

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    setSum(props.summary);
  }, [props.summary]);

  useEffect(() => {
    setTotal(props.total);
  }, [props.total]);

  useEffect(() => {
    setPdate(props.date);
  }, [props.date]);

  const datalist = () => {
    if (data.length > 0) {
      let td = [];

      for (var i = 0; i < 13; i++) {
        if (data[i]) {
          td.push(
            <tr className="last:border-b border-zinc-600">
              <td className="text-center border-l border-r border-zinc-600">
                {i + 1}
              </td>
              <td className="border-l border-r border-zinc-600">
                {data[i].sales}
              </td>
              <td className="border-l border-r border-zinc-600">
                {data[i].customer}
              </td>
              <td className="border-l border-r border-zinc-600">
                <div className="flex items-center justify-between w-full">
                  <div>{data[i].detail}</div>
                  <div className="min-w-fit">{correctDate(data[i].due)}</div>
                </div>
              </td>
              <td
                className={`border-l border-r border-zinc-600 ${
                  data[i].paidby !== 3 && data[i].amount !== 0
                    ? "text-right"
                    : "text-center"
                }`}
              >
                {data[i].paidby !== 3
                  ? data[i].amount !== 0
                    ? data[i].amount
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                    : "-"
                  : "-"}
              </td>
              <td
                className={`border-l border-r border-zinc-600 ${
                  data[i].paidby !== 3 && data[i].tax !== 0
                    ? "text-right"
                    : "text-center"
                }`}
              >
                {data[i].paidby !== 3 && data[i].paidby !== 8
                  ? data[i].tax !== 0
                    ? data[i].tax
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                    : "-"
                  : "-"}
              </td>
              <td
                className={`border-l border-r border-zinc-600 ${
                  data[i].paidby !== 3 && (data[i].amount || data[i].tax !== 0)
                    ? "text-right"
                    : "text-center"
                }`}
              >
                {data[i].paidby !== 3 && data[i].paidby !== 8
                  ? (data[i].amount + data[i].tax)
                      .toFixed(2)
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                  : "-"}
              </td>
              <td
                className={`border-l border-r border-zinc-600 ${
                  data[i].paidby === 3 && data[i].amount !== 0
                    ? "text-right"
                    : "text-center"
                }`}
              >
                {data[i].paidby === 3
                  ? data[i].amount !== 0
                    ? data[i].amount
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                    : "-"
                  : "-"}
              </td>
              <td
                className={`border-l border-r border-zinc-600 ${
                  (data[i].paidby === 3 || data[i].paidby === 8) &&
                  data[i].tax !== 0
                    ? "text-right"
                    : "text-center"
                }`}
              >
                {data[i].paidby === 3 || data[i].paidby === 8
                  ? data[i].tax !== 0
                    ? data[i].tax
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                    : "-"
                  : "-"}
              </td>
              <td
                className={`border-l border-r border-zinc-600 ${
                  (data[i].paidby === 3 || data[i].paidby === 8) &&
                  (data[i].amount || data[i].tax) !== 0
                    ? "text-right"
                    : "text-center"
                }`}
              >
                {data[i].paidby === 3 || data[i].paidby === 8
                  ? (data[i].amount + data[i].tax)
                      .toFixed(2)
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                  : "-"}
              </td>
              <td className="text-center border-l border-r border-zinc-600">
                {data[i].booth}
              </td>
              <td className="border-l border-r border-zinc-600"></td>
            </tr>
          );
        } else {
          td.push(
            <tr className="last:border-b border-zinc-600">
              <td className="border-l border-r border-zinc-600 text-center">
                {i + 1}
              </td>
              <td className="border-l border-r border-zinc-600"></td>
              <td className="border-l border-r border-zinc-600"></td>
              <td className="border-l border-r border-zinc-600"></td>
              <td className="border-l border-r border-zinc-600"></td>
              <td className="border-l border-r border-zinc-600"></td>
              <td className="border-l border-r border-zinc-600"></td>
              <td className="border-l border-r border-zinc-600"></td>
              <td className="border-l border-r border-zinc-600"></td>
              <td className="border-l border-r border-zinc-600"></td>
              <td className="border-l border-r border-zinc-600"></td>
              <td className="border-l border-r border-zinc-600"></td>
            </tr>
          );
        }
      }
      return td;
    }
  };

  const initListSum = {
    AmountC: 0,
    TaxC: 0,
    TotalC: 0,
    AmountCa: 0,
    TaxCa: 0,
    TotalCa: 0,
    cheque: 0,
    Tax: 0,
  };
  const [listSum, setListSum] = useState(initListSum);

  useEffect(() => {
    if (data.length > 0) {
      let sum = {
        AmountC: 0,
        TaxC: 0,
        TotalC: 0,
        AmountCa: 0,
        TaxCa: 0,
        TotalCa: 0,
        cheque: 0,
        Tax: 0,
      };
      data.map((d) => {
        if (d.paidby !== 3) {
          sum.AmountC += d.amount;
          if (d.paidby !== 8) {
            sum.TaxC += d.tax;
            sum.TotalC += d.amount + d.tax;
          }
        } else {
          sum.AmountCa += d.amount;
          if (d.paidby === 8) {
            sum.TaxCa += d.tax;
            sum.TotalCa += d.amount + d.tax;
          } else {
            sum.TotalCa += d.amount;
          }
        }
        if (d.paidby === 1 || d.paidby === 2) {
          sum.cheque += 1;
        }
        if (d.tax != 0) {
          sum.Tax += 1;
        }
      });
      setListSum(sum);
    }
  }, [data]);

  return (
    <div
      className="w-[34cm] h-[20cm] text-[13px] pr-1 font-sans"
      id="pagePrint"
    >
      <table className="mb-2">
        <thead>
          <tr>
            <td className="border-none align-top" colSpan={13}>
              <div className="flex">
                <img
                  src={require("../../../img/logo-wf.png")}
                  alt="wflogo"
                  id="logo"
                  className="w-20 h-16 object-contain"
                />
                <div className="w-full relative">
                  <div className="text-center font-semibold">
                    รายการรับเช็ค,เงินสด,เงินโอน,รูดบัตร
                  </div>
                  <div className="text-center font-semibold">
                    ประจำวันที่{" "}
                    {pdate.d +
                      " " +
                      f_month[Number(pdate.m) - 1] +
                      " " +
                      (Number(pdate.y) + 543)}
                  </div>
                  <div className="pb-2 text-center font-semibold">
                    งานแสดงสินค้า {props.exdata.name} วันที่{" "}
                    {props.exdata.sDate &&
                      correctDate(props.exdata.sDate) +
                        "-" +
                        correctDate(props.exdata.eDate) +
                        " " +
                        props.exdata.venue}
                  </div>
                  <div className="absolute top-0 right-0">
                    แผ่นที่ {data.length != 0 && data[0].page}
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr className="border-t border-b border-zinc-600">
            <th
              className="border-l border-r border-zinc-600"
              style={{ width: "2.5%" }}
            >
              ลำดับ
            </th>
            <th
              className="border-l border-r border-zinc-600"
              style={{ width: "7.5%" }}
            >
              ฝ่ายขาย
            </th>
            <th
              className="border-l border-r border-zinc-600"
              style={{ width: "15%" }}
            >
              บริษัท/หจก/ร้านค้า
            </th>
            <th
              className="border-l border-r border-zinc-600"
              style={{ width: "25%" }}
            >
              รายการรับ
            </th>
            <th
              className="border-l border-r border-zinc-600"
              style={{ width: "7.5%" }}
            >
              จำนวนเงินในเช็ค
            </th>
            <th className="border-l border-r border-zinc-600">TAX</th>
            <th
              className="border-l border-r border-zinc-600"
              style={{ width: "7.5%" }}
            >
              ยอดรับเช็ค
            </th>
            <th
              className="border-l border-r border-zinc-600"
              style={{ width: "7.5%" }}
            >
              จำนวน เงินสด
            </th>
            <th className="border-l border-r border-zinc-600">TAX</th>
            <th
              className="border-l border-r border-zinc-600"
              style={{ width: "7.5%" }}
            >
              ยอดรับเงินสด
            </th>
            <th
              className="border-l border-r border-zinc-600"
              style={{ width: "6.5%" }}
            >
              หมายเลขบูธ
            </th>

            <th className="border-l border-r border-zinc-600">หมายเหตุ</th>
          </tr>
        </thead>
        <tbody className="text-[12px]">{datalist()}</tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="border-none"></td>
            <td
              className={`border-x border-zinc-600 border-b-2 ${
                listSum.AmountC !== 0 ? "text-right" : "text-center"
              }`}
            >
              {listSum.AmountC !== 0
                ? listSum.AmountC.toFixed(2).replace(
                    /(\d)(?=(\d{3})+(?!\d))/g,
                    "$1,"
                  )
                : "-"}
            </td>
            <td
              className={`border-x border-zinc-600 border-b-2 ${
                listSum.TaxC !== 0 ? "text-right" : "text-center"
              }`}
            >
              {listSum.TaxC !== 0
                ? listSum.TaxC.toFixed(2).replace(
                    /(\d)(?=(\d{3})+(?!\d))/g,
                    "$1,"
                  )
                : "-"}
            </td>
            <td
              className={`border-x border-zinc-600 border-b-2 ${
                listSum.TotalC !== 0 ? "text-right" : "text-center"
              }`}
            >
              {listSum.TotalC !== 0
                ? listSum.TotalC.toFixed(2).replace(
                    /(\d)(?=(\d{3})+(?!\d))/g,
                    "$1,"
                  )
                : "-"}
            </td>
            <td
              className={`border-x border-zinc-600 border-b-2 ${
                listSum.AmountCa !== 0 ? "text-right" : "text-center"
              }`}
            >
              {listSum.AmountCa !== 0
                ? listSum.AmountCa.toFixed(2).replace(
                    /(\d)(?=(\d{3})+(?!\d))/g,
                    "$1,"
                  )
                : "-"}
            </td>
            <td
              className={`border-x border-zinc-600 border-b-2 ${
                listSum.TaxCa !== 0 ? "text-right" : "text-center"
              }`}
            >
              {listSum.TaxCa !== 0
                ? listSum.TaxCa.toFixed(2).replace(
                    /(\d)(?=(\d{3})+(?!\d))/g,
                    "$1,"
                  )
                : "-"}
            </td>
            <td
              className={`border-x border-zinc-600 border-b-2 ${
                listSum.TotalCa !== 0 ? "text-right" : "text-center"
              }`}
            >
              {listSum.TotalCa !== 0
                ? listSum.TotalCa.toFixed(2).replace(
                    /(\d)(?=(\d{3})+(?!\d))/g,
                    "$1,"
                  )
                : "-"}
            </td>
            <td colSpan={2} className="border-none"></td>
          </tr>
        </tfoot>
      </table>
      <PrintFooter summary={sum} total={total} listsum={listSum} />
    </div>
  );
}
