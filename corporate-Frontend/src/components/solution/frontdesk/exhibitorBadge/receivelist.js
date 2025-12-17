import { useEffect, useState, useContext } from "react";

import useCheckMobile from "../../../hook/useCheckMobile";
import { RiDeleteBin6Line } from "react-icons/ri";

import { dataContext } from "./exhibitorBadge";

export default function ReceiveList(props) {
  const { regDataC, badge } = useContext(dataContext);
  const [regData, setRegData] = regDataC;

  const [pidCheck, setPidCheck] = useState(true);
  const pidChange = (p) => {
    setRegData({ ...regData, pid: p });
    const re = /^[1-8]-\d{4}-\d{5}-\d{2}-\d$/;
    if (re.test(p) || p == "") {
      setPidCheck(true);
    } else {
      setPidCheck(false);
    }
  };

  const [mobCheck, setMobCheck] = useState(true);
  const mobChange = (m) => {
    setRegData({ ...regData, mobile: m });
    const re = /^0[6-9]\d{8}$/;
    if (re.test(m) || m == "") {
      setMobCheck(true);
    } else {
      setMobCheck(false);
    }
  };

  useEffect(() => {
    if (Object.keys(regData).length && regData.recNum == undefined) {
      setRegData({ ...regData, recNum: 1 });
    }
  }, [regData]);

  useEffect(() => {
    if (badge == "e") {
      setRegData({ ...regData, recNum: 1 });
    }
  }, [badge]);

  return (
    <div>
      {/* ไม่ใช้งานเนื่องจากเปลี่ยนระบบเป็นรับผ่าน QR ซึ่งเป็น 1:1
      regData.length > 1 && (
        <div className="mt-3 border-b">
          <table className="w-full">
            <thead>
              <tr>
                <td className="w-1/6">Name:</td>
                <td className="w-1/6">Surname:</td>
                <td className="w-1/5">Id Card:</td>
                <td className="w-1/6">Mobile:</td>
                <td className="w-1/6">Request:</td>
                <td className="w-1/12"></td>
              </tr>
            </thead>
            <tbody>
              {regData.map((l, i) => (
                <tr>
                  <td>{l.name}</td>
                  <td>{l.surname}</td>
                  <td>{l.pid}</td>
                  <td>{l.mobile}</td>
                  <td>{l.receive}</td>
                  <td>
                    <div
                      className="hover:text-red-500 w-fit"
                      onClick={() => deleteName(i)}>
                      <RiDeleteBin6Line />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )*/}
      <div className="mt-3 flex gap-2 items-start flex-auto w-full max-sm:flex-wrap">
        <div className="w-1/2 lg:w-1/4">
          <label htmlFor="fname" className="block">
            Name:
          </label>
          <input
            id="fname"
            className="w-full"
            onChange={(e) => setRegData({ ...regData, name: e.target.value })}
            value={regData.name != undefined ? regData.name : ""}
          />
        </div>
        <div className="w-1/2 lg:w-1/4">
          <label htmlFor="fsurname" className="block">
            Surname:
          </label>
          <input
            id="fsurname"
            className="w-full"
            onChange={(e) =>
              setRegData({ ...regData, surname: e.target.value })
            }
            value={regData.surname != undefined ? regData.surname : ""}
          />
        </div>
        <div className="w-full md:w-2/3 lg:w-1/2">
          <label htmlFor="pid" className="block">
            Id card:
          </label>
          <input
            id="pid"
            className="w-full"
            onChange={(e) => pidChange(e.target.value)}
            value={regData.pid != undefined ? regData.pid : ""}
          />
          <span className={`${pidCheck ? "hidden" : ""} text-red-500`}>
            format: x-xxxx-xxxxx-xx-x
          </span>
        </div>
      </div>
      <div className="mt-3 flex gap-2 items-start flex-auto max-sm:flex-wrap">
        <div className="w-1/2 sm:w-1/3 md:w-1/2 lg:w-1/4">
          <label htmlFor="mobile" className="block">
            Mobile:
          </label>
          <input
            id="mobile"
            className="w-full"
            onChange={(e) => mobChange(e.target.value)}
            value={regData.mobile != undefined ? regData.mobile : ""}
            max={10}
          />
          <span className={`${mobCheck ? "hidden" : ""} text-red-500`}>
            Mobile not correct format
          </span>
        </div>
        <div className="w-1/3 lg:w-1/6">
          <label htmlFor="receive" className="block">
            Request:
          </label>
          <input
            id="receive"
            type="number"
            className="w-full disabled:bg-gray-100"
            onChange={(e) => setRegData({ ...regData, recNum: e.target.value })}
            value={regData.name != undefined ? regData.recNum : ""}
            disabled={badge == "e"}
          />
        </div>
        {/*}
        <div
          className="btn-primary px-6 md:px-4 h-fit bg-green-600 border-green-600 hover:bg-white hover:border-green-600 hover:text-green-600 sm:mt-6"
          onClick={addName}>
          Add
        </div>
        */}
      </div>
    </div>
  );
}
