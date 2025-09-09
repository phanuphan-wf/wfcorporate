import React, { useContext, useEffect, useState, useRef, use } from "react";
import { dataContext } from "./report";
import CorrectDate from "../correctDate";
import ReactToPrint from "react-to-print";

function Reportlist() {
  const { reportC, printDateC, filterC } = useContext(dataContext);
  const [report, setReport] = reportC;
  const [filter, setFilter] = filterC;
  const [printDate, setPrintDate] = printDateC;

  const [sum, setSum] = useState({ count: 0, amount: 0 });
  const [sumt, setSumt] = useState({ count: 0, tax: 0 });

  useEffect(() => {
    if (report.length > 0) {
      let sum = report.reduce((acc, cur) => acc + cur.amount, 0);
      let count = report.length;
      setSum({ ...sum, amount: sum, count: count });
      let sumt = report.reduce((acc, cur) => acc + cur.tax, 0);
      count = report.filter((x) => x.tax > 0).length;
      setSumt({ ...sumt, tax: sumt, count: count });
    } else {
      setSum({ ...sum, amount: 0, count: 0 });
      setSumt({ ...sumt, tax: 0, count: 0 });
    }
  }, [report]);

  const [headtype, setHeadtype] = useState("");

  useEffect(() => {
    switch (filter.type) {
      case "6":
        setHeadtype("เครดิตการ์ด");
        break;
      case "3":
        setHeadtype("เงินสด");
        break;
      case "9":
        setHeadtype("Barter");
        break;
      default:
        setHeadtype("เงินโอน");
        break;
    }
  }, [filter.type]);

  const printReport = useRef(null);

  return (
    <div>
      <ReactToPrint
        trigger={() => (
          <div className="flex justify-end w-full lg:w-3/4">
            <button className="btn-primary px-4 my-4">Print</button>
          </div>
        )}
        content={() => printReport.current}
      />
      <div
        className="w-full max-w-5xl print:w-[210mm] print:h-[297mm] px-[7mm] py-[5mm]"
        ref={printReport}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
  @media print {
    @page {
      size: A4 portrait;
      margin: 10mm;
    }

    html, body {
      width: 210mm;
      height: 297mm;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      page-break-inside: auto;
    }

    thead {
      display: table-header-group;
    }

    tfoot {
      display: table-footer-group;
    }

    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    td, th {
      page-break-inside: avoid;
    }

    .page-break {
      page-break-after: always;
    }
  }
`,
          }}
        />
        <div className="hidden print:grid grid-cols-[15mm_1fr_15mm] mb-3">
          <div className="w-full">
            <img
              src={require("../../../img/logo-wf.png")}
              alt="logo-wf"
              className="object-contain"
            />
          </div>
          <div className="w-full text-center print:text-[11px]">
            <div className="font-semibold">**รายงานเก็บเงิน**</div>
            <div className="font-semibold">{"ประเภท: " + headtype}</div>
            <div>
              {(printDate.due ? "ตั้งแต่วันที่ " : "วันที่ ") +
                printDate.date1 +
                (printDate.due ? " ถึง " + printDate.date2 : "")}
            </div>
          </div>
          <div className="after:content-[counter(page)]"></div>
        </div>

        <table
          className="print:text-[10px] w-full border-collapse"
          style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th className="border text-center py-1.5 px-1">No</th>
              <th className="border text-center py-1.5">Tr Date</th>
              <th className="border text-center py-1.5">Tr No</th>
              <th className="border text-center py-1.5">ลูกค้า</th>
              <th className="border text-center py-1.5">จำนวนเงิน</th>
              <th className="border text-center py-1.5">TAX</th>
              <th className="border text-center py-1.5">งาน</th>
              <th className="border text-center py-1.5">ฝ่ายขาย</th>
              <th className="border text-center py-1.5">เข้าบัญชี</th>
            </tr>
          </thead>
          <tbody>
            {report.map((x, i) => (
              <tr key={i}>
                <td className="border break-words text-center">{i + 1}</td>
                <td className="border break-words py-1 px-0.5">
                  {CorrectDate(x.trdate, "n")}
                </td>
                <td className="border break-words py-1 px-0.5">{x.tr_no}</td>
                <td className="border break-words py-1 px-0.5">{x.customer}</td>
                <td className="border break-words py-1 px-0.5 text-right">
                  {x.amount
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                </td>
                <td
                  className={`border break-words py-1 px-0.5  ${
                    x.tax == 0 ? "text-center" : "text-right"
                  }`}>
                  {x.tax != 0
                    ? x.tax.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                    : "-"}
                </td>
                <td className="border break-words py-1 px-0.5 text-center">
                  {x.exid}
                </td>
                <td className="border break-words py-1 px-0.5">{x.sales}</td>
                <td
                  className={`border break-words py-1 px-0.5 text-center ${
                    x.account == "Waiting" ? "text-red-500" : ""
                  }`}>
                  {x.account}
                </td>
              </tr>
            ))}
          </tbody>

          {Object.keys(sum).length && (
            <tfoot>
              <tr className="border">
                <td colSpan="2" className="px-5">
                  {"รวมทั้งสิ้น " + sum.count + " รายการ"}
                </td>
                <td colSpan="3" className="px-1 text-right border-none">
                  {"รวมเป็นเงิน " +
                    (Object.keys(sum).length &&
                      sum.amount
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")) +
                    " บาท"}
                </td>

                <td colSpan="3" className="px-1 text-right border-none">
                  {"รวมเป็น TAX " +
                    (Object.keys(sumt).length &&
                      sumt.tax
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")) +
                    " บาท"}
                </td>
                <td colSpan="1" className="border-none"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

export default Reportlist;
