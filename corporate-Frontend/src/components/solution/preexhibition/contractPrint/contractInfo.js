import React, { useContext, useEffect, useState } from "react";
import { dataContext } from "./contractPrint";
import { NumericFormat } from "react-number-format";
import ThaiBaht from "thai-baht-text";

export default function ContractInfo() {
  const { contractC, selectShowC } = useContext(dataContext);

  const [contract, setContract] = contractC;
  const [selectShow, setSelectShow] = selectShowC;

  const smonth = [
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

  const tmonth = [
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

  const extDay = (d) => {
    let da = d.substring(d.search("-") + 4, d.indexOf("T", d.search("-") + 4));

    return parseInt(da);
  };

  const extMonth = (d) => {
    let mo = d.substring(d.indexOf("-") + 1, d.indexOf("-") + 3);

    return parseInt(mo) - 1;
  };

  const extSMonth = (d) => {
    let mo = d.substring(d.indexOf("-") + 1, d.indexOf("-") + 3);

    return smonth[mo - 1];
  };

  const extYear = (d) => {
    let ye = d.substring(0, d.search("-"));
    return parseInt(ye) + 543;
  };

  const convertAddDate = (d, a) => {
    let cdate = new Date(extYear(d), extMonth(d), extDay(d));
    cdate.setDate(cdate.getDate() + parseInt(a));
    let formattedDate =
      cdate.getDate() +
      " " +
      smonth[cdate.getMonth()] +
      " " +
      cdate.getFullYear();
    return formattedDate;
  };

  const autoDepDate = () => {
    let cdate = new Date(
      contract.year,
      tmonth.indexOf(contract.month),
      contract.day
    );
    cdate.setDate(cdate.getDate() + 7);
    let formattedDate =
      cdate.getDate() +
      " " +
      smonth[cdate.getMonth()] +
      " " +
      (cdate.getFullYear() + 543);
    return formattedDate;
  };

  const [payAuto, setPayAuto] = useState(true);

  useEffect(() => {
    if (selectShow.startDate && payAuto) {
      setContract({
        ...contract,
        wtndep: autoDepDate(),
        wtn1: convertAddDate(selectShow.startDate, -30),
        wtn2: convertAddDate(selectShow.startDate, -15),
        cheque: convertAddDate(selectShow.startDate, -30),
      });
    }
  }, [selectShow, payAuto]);

  useEffect(() => {
    let number = Number(contract.cost);
    let baht = Math.floor(number);
    let satang = Math.round((number - baht) * 100);

    let bahtText = "";
    let satangText = "";

    if (satang > 0) {
      bahtText = ThaiBaht(baht).replace("ถ้วน", "");
      satangText = ThaiBaht(satang).replace("บาทถ้วน", "สตางค์");
    } else {
      bahtText = ThaiBaht(baht);
    }

    let text = "(" + bahtText + (satang > 0 ? satangText : "") + ")";
    if (contract.cost != "") {
      setContract({ ...contract, costtext: text });
    } else {
      setContract({ ...contract, costtext: "", pay1: "", pay2: "" });
    }
    if (contract.cost && payAuto) {
      setContract((prev) => ({
        ...prev,
        pay1: Number(contract.cost) - Number(contract.deposit) / 2,
        pay2: Number(contract.cost) - Number(contract.deposit) / 2,
      }));
    }
  }, [contract.cost]);

  useEffect(() => {
    if (contract.cost && payAuto) {
      setContract((prev) => ({
        ...prev,
        pay1: Number(contract.cost) - Number(contract.deposit) / 2,
        pay2: Number(contract.cost) - Number(contract.deposit) / 2,
      }));
    }
  }, [contract.deposit]);

  return (
    <section id="contract-info">
      <div className="flex items-center max-sm:flex-wrap gap-3">
        <div className="my-1 flex items-center">
          <label htmlFor="txt-booth" className="w-[150px]">
            หมายเลขบูธ
          </label>
          <input
            type="text"
            id="txt-booth"
            className="w-[300px]"
            placeholder="Booth No"
            value={contract.booth}
            onChange={(e) =>
              setContract({ ...contract, booth: e.target.value })
            }
          />
        </div>
        <div className="my-1 flex items-center">
          <label htmlFor="txt-space" className="w-[150px]">
            พื้นที่โดยประมาณ
          </label>
          <input
            type="text"
            id="txt-space"
            className="w-[300px]"
            placeholder="Space"
            value={contract.space}
            onChange={(e) =>
              setContract({ ...contract, space: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex items-center max-sm:flex-wrap gap-3">
        <div className="my-1 flex items-center">
          <label htmlFor="txt-cost" className="w-[150px]">
            เป็นเงินค่าพื้นที่
          </label>
          <NumericFormat
            value={contract.cost}
            thousandSeparator=","
            decimalSeparator="."
            decimalScale={2}
            onValueChange={(n) => setContract({ ...contract, cost: n.value })}
          />
          <label htmlFor="txt-currency" className="mx-3">
            บาท
          </label>
          <input
            type="text"
            id="txt-Baht"
            className="w-[500px] disabled:bg-gray-200"
            placeholder="cost text"
            disabled
            value={contract.costtext}
          />
        </div>
      </div>
      <div className="flex items-start max-sm:flex-wrap">
        <div className="my-2 w-[150px]">
          <label htmlFor="txt-pay" className="min-w-fit">
            การชำระเงิน
          </label>
        </div>
        <div>
          <div className="flex items-center max-sm:flex-wrap gap-3">
            <div className="my-1 flex items-center">
              <label htmlFor="txt-pay1" className="w-[130px]">
                ชำระเงินมัดจำ
              </label>
              <NumericFormat
                value={contract.deposit}
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                onValueChange={(n) =>
                  setContract({ ...contract, deposit: n.value })
                }
                className="w-[200px] disabled:bg-gray-200"
              />
            </div>
            <div className="my-1 flex items-center">
              <label htmlFor="txt-within1" className="w-[80px]">
                ภายใน
              </label>
              <input
                type="text"
                id="txt-within1"
                className="w-[250px] disabled:bg-gray-200"
                placeholder="within 1"
                disabled={payAuto}
                value={contract.wtndep}
                onChange={(e) =>
                  setContract({ ...contract, wtndep: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex items-center max-sm:flex-wrap gap-3">
            <div className="my-1 flex items-center">
              <label htmlFor="txt-pay1" className="w-[130px]">
                ชำระเงินส่วนแรก
              </label>
              <NumericFormat
                value={contract.pay1}
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                onValueChange={(n) =>
                  setContract({ ...contract, pay1: n.value })
                }
                disabled={payAuto}
                className="w-[200px] disabled:bg-gray-200"
              />
            </div>
            <div className="my-1 flex items-center">
              <label htmlFor="txt-within1" className="w-[80px]">
                ภายใน
              </label>
              <input
                type="text"
                id="txt-within1"
                className="w-[250px] disabled:bg-gray-200"
                placeholder="within 1"
                disabled={payAuto}
                value={contract.wtn1}
                onChange={(e) =>
                  setContract({ ...contract, wtn1: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex items-center max-sm:flex-wrap gap-3">
            <div className="my-1 flex items-center">
              <label htmlFor="txt-pay2" className="w-[130px]">
                ชำระเงินส่วนที่เหลือ
              </label>
              <NumericFormat
                value={contract.pay2}
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                onValueChange={(n) =>
                  setContract({ ...contract, pay2: n.value })
                }
                disabled={payAuto}
                className="w-[200px] disabled:bg-gray-200"
              />
            </div>
            <div className="my-1 flex items-center">
              <label htmlFor="txt-within2" className="w-[80px]">
                ภายใน
              </label>
              <input
                type="text"
                id="txt-within2"
                className="w-[250px] disabled:bg-gray-200"
                placeholder="within 2"
                disabled={payAuto}
                value={contract.wtn2}
                onChange={(e) =>
                  setContract({ ...contract, wtn2: e.target.value })
                }
              />
            </div>
          </div>
          <div className="my-1 flex items-center">
            <label htmlFor="txt-paycheque" className="w-[220px]">
              โดยเป็นเช็คสั่งจ่าย ภายในวันที่
            </label>
            <input
              type="text"
              id="txt-paycheque"
              className="w-[250px]"
              placeholder="Pay cheque within"
              value={contract.cheque}
              onChange={(e) =>
                setContract({ ...contract, cheque: e.target.value })
              }
            />
          </div>
        </div>
        <div className="my-1 flex items-center ml-3">
          <input
            type="checkbox"
            id="chb-pay-auto"
            className="size-4 accent-red-500"
            checked={payAuto}
            onChange={(e) => setPayAuto(!payAuto)}
          />
          <label htmlFor="chb-pay-auto" className="mx-3">
            Auto
          </label>
        </div>
      </div>
    </section>
  );
}
