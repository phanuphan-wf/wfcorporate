import React, { useContext, useState, useEffect } from "react";
import { dataContext } from "./contractPrint";

export default function ContractDeco() {
  const { contractC, selectShowC } = useContext(dataContext);

  const [contract, setContract] = contractC;
  const [selectShow, setSelectShow] = selectShowC;

  const [auto1, setAuto1] = useState(true);
  const [auto2, setAuto2] = useState(false);
  const [auto3, setAuto3] = useState(true);

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

  useEffect(() => {
    if (selectShow.startDate && auto1 && !auto2) {
      setContract({
        ...contract,
        movein1: convertAddDate(selectShow.startDate, -1),
        mit1: "8.30-21.00น.",
        movein2: "",
        mit2: "",
      });
    }
  }, [auto1]);

  useEffect(() => {
    if (selectShow.startDate && auto1 && auto2) {
      setContract({
        ...contract,
        movein1: convertAddDate(selectShow.startDate, -2),
        mit1: "13.00-21.00น.",
        movein2: convertAddDate(selectShow.startDate, -1),
        mit2: "8.30-21.00น.",
      });
    } else if (selectShow.startDate && auto1 && !auto2) {
      setContract({
        ...contract,
        movein1: convertAddDate(selectShow.startDate, -1),
        mit1: "8.30-21.00น.",
        movein2: "",
        mit2: "",
      });
    }
  }, [auto2]);

  useEffect(() => {
    if (selectShow.startDate && auto3) {
      setContract({
        ...contract,
        moveout1: convertAddDate(selectShow.endDate, 0),
        mot1: "20.30-24.00น.",
        moveout2: convertAddDate(selectShow.endDate, 1),
        mot2:
          selectShow.venueName ==
          "ศูนย์แสดงสินค้าและการประชุม อิมแพ็ค เมืองทองธานี"
            ? "00.00-10.00น."
            : "00.00-04.00น.",
      });
    }
  }, [auto3]);

  useEffect(() => {
    if (selectShow.startDate) {
      if (auto1 && !auto2) {
        setContract((prev) => ({
          ...prev,
          movein1: convertAddDate(selectShow.startDate, -1),
          mit1: "8.30-21.00น.",
        }));
      } else if (auto1 && auto2) {
        setContract((prev) => ({
          ...prev,
          movein1: convertAddDate(selectShow.startDate, -2),
          mit1: "13.00-21.00น.",
          movein2: convertAddDate(selectShow.startDate, -1),
          mit2: "8.30-21.00น.",
        }));
      }

      if (auto3) {
        setContract((prev) => ({
          ...prev,
          moveout1: convertAddDate(selectShow.endDate, 0),
          mot1: "20.30-24.00น.",
          moveout2: convertAddDate(selectShow.endDate, 1),
          mot2:
            selectShow.venueName ==
            "ศูนย์แสดงสินค้าและการประชุม อิมแพ็ค เมืองทองธานี"
              ? "00.00-10.00น."
              : "00.00-04.00น.",
        }));
      }
    }
  }, [selectShow]);

  return (
    <section id="contract-deco">
      <div className="flex items-start max-sm:flex-wrap">
        <div className="my-2 w-[150px]">
          <label htmlFor="txt-set" className="min-w-fit">
            เข้าตกแต่งพื้นที่
          </label>
        </div>
        <div>
          <div className="flex items-center max-sm:flex-wrap gap-3">
            <div className="my-1 flex items-center">
              <label htmlFor="txt-mov1" className="w-[80px]">
                วันที่
              </label>
              <input
                type="text"
                id="txt-mov1"
                className="w-[250px] disabled:bg-gray-200"
                placeholder="movein 1"
                value={contract.movein1}
                onChange={(e) =>
                  setContract({ ...contract, movein1: e.target.value })
                }
                disabled={auto1}
              />
            </div>
            <div className="my-1 flex items-center">
              <label htmlFor="txt-mit1" className="w-[80px]">
                เวลา
              </label>
              <input
                type="text"
                id="txt-mit1"
                className="w-[250px] disabled:bg-gray-200"
                placeholder="within 1"
                value={contract.mit1}
                onChange={(e) =>
                  setContract({ ...contract, mit1: e.target.value })
                }
                disabled={auto1}
              />
            </div>
            <div className="my-1 flex items-center">
              <input
                type="checkbox"
                id="auto1"
                checked={auto1}
                onChange={(e) => setAuto1(!auto1)}
                className="size-4 accent-red-500"
              />
              <label htmlFor="auto1" className="ml-2">
                Auto
              </label>
            </div>
          </div>
          <div className="flex items-center max-sm:flex-wrap gap-3">
            <div className="my-1 flex items-center">
              <label htmlFor="txt-mov2" className="w-[80px]">
                วันที่
              </label>
              <input
                type="text"
                id="txt-mov2"
                className="w-[250px] disabled:bg-gray-200"
                placeholder="movein 2"
                value={contract.movein2}
                onChange={(e) =>
                  setContract({ ...contract, movein2: e.target.value })
                }
                disabled={auto2}
              />
            </div>
            <div className="my-1 flex items-center">
              <label htmlFor="txt-mit2" className="w-[80px]">
                เวลา
              </label>
              <input
                type="text"
                id="txt-mit2"
                className="w-[250px] disabled:bg-gray-200"
                placeholder="within 2"
                value={contract.mit2}
                onChange={(e) =>
                  setContract({ ...contract, mit2: e.target.value })
                }
                disabled={auto2}
              />
            </div>
            <div className="my-1 flex items-center">
              <input
                type="checkbox"
                id="auto1"
                checked={auto2}
                onChange={(e) => setAuto2(!auto2)}
                className="size-4 accent-red-500"
              />
              <label htmlFor="auto2" className="ml-2">
                Auto
              </label>
            </div>
          </div>
        </div>
      </div>
      {/*--------------------------*/}
      <div className="flex items-start max-sm:flex-wrap">
        <div className="my-2 w-[150px]">
          <label htmlFor="txt-tear" className="min-w-fit">
            รื้อถอนพื้นที่
          </label>
        </div>
        <div>
          <div className="flex items-center max-sm:flex-wrap gap-3">
            <div className="my-1 flex items-center">
              <label htmlFor="txt-mvo1" className="w-[80px]">
                วันที่
              </label>
              <input
                type="text"
                id="txt-mvo1"
                className="w-[250px] disabled:bg-gray-200"
                placeholder="moveout 1"
                value={contract.moveout1}
                onChange={(e) =>
                  setContract({ ...contract, moveout1: e.target.value })
                }
                disabled={auto3}
              />
            </div>
            <div className="my-1 flex items-center">
              <label htmlFor="txt-mot1" className="w-[80px]">
                เวลา
              </label>
              <input
                type="text"
                id="txt-mot1"
                className="w-[250px] disabled:bg-gray-200"
                placeholder="within 1"
                value={contract.mot1}
                onChange={(e) =>
                  setContract({ ...contract, mot1: e.target.value })
                }
                disabled={auto3}
              />
            </div>
            <div className="my-1 flex items-center">
              <input
                type="checkbox"
                id="auto3"
                checked={auto3}
                onChange={(e) => setAuto3(!auto3)}
                className="size-4 accent-red-500"
              />
              <label htmlFor="auto3" className="ml-2">
                Auto
              </label>
            </div>
          </div>
          <div className="flex items-center max-sm:flex-wrap gap-3">
            <div className="my-1 flex items-center">
              <label htmlFor="txt-mvo2" className="w-[80px]">
                วันที่
              </label>
              <input
                type="text"
                id="txt-mvo2"
                className="w-[250px] disabled:bg-gray-200"
                placeholder="moveout 2"
                value={contract.moveout2}
                onChange={(e) =>
                  setContract({ ...contract, moveout2: e.target.value })
                }
                disabled={auto3}
              />
            </div>
            <div className="my-1 flex items-center">
              <label htmlFor="txt-mot2" className="w-[80px]">
                เวลา
              </label>
              <input
                type="text"
                id="txt-mot2"
                className="w-[250px] disabled:bg-gray-200"
                placeholder="within 2"
                value={contract.mot2}
                onChange={(e) =>
                  setContract({ ...contract, mot2: e.target.value })
                }
                disabled={auto3}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
