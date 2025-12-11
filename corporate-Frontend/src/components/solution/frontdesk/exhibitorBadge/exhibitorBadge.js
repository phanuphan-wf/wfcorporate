import React, { useEffect, useRef, useState, forwardRef } from "react";
import ReactToPrint from "react-to-print";
import Axios from "axios";
import * as d3 from "d3";
import useHeader from "../../../hook/useHeader";

import ReceiveList from "./receivelist";
import ReceiveHist from "./receiveHist";
import ModalSeach from "./modalSearch";
import PrintBadge from "./printBadge";
import ModalQR from "./modalQR";

export default function ExhibitorBadge(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_frontdesk;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef(null);
  const promiseResolveRef = useRef(null);

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  const [exName, setExName] = useState("");

  const initExData = { id: "", name: "" };
  const [exData, setExData] = useState(initExData);

  const [exID, setExID] = useState("");

  const getExID = async () => {
    const res = await Axios.get(url + "/getExID").then((res) => {
      setExID(res.data);
    });
  };

  useEffect(() => {
    getExID();
    document.getElementById("excode").focus();
  }, []);

  const [locList, setLocList] = useState([]);

  const getLoc = async () => {
    const res = await Axios.get(url + "/getLoc/" + exID).then((res) => {
      setLocList(res.data);
    });
  };

  useEffect(() => {
    if (exID) {
      getLoc();
    }
  }, [exID]);

  const [modalShow, setModalShow] = useState(false);

  const closeModal = () => {
    setModalShow(false);
  };

  const searchName = (e) => {
    if (e.key === "Enter") {
      setModalShow(true);
    }
  };

  const fillName = (id, name) => {
    setExData({ id: id, name: name });
    setExName(name);
    setModalShow(false);
  };

  const searchtxtChange = (value) => {
    setExName(value);
    setExData(initExData);
  };

  const [ready, setReady] = useState(false);

  const [recName, setRecName] = useState([]);

  const recFill = (data) => {
    setRecName(data);
  };

  const [canPrint, setCanPrint] = useState(false);

  const printChange = (value) => {
    setCanPrint(value);
  };

  const [loc, setLoc] = useState(0);

  useEffect(() => {
    if (loc != 0 && exData.id != "" && canPrint) {
      setReady(true);
    } else {
      setReady(false);
    }
  }, [loc, exData, canPrint]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    let c = 0;
    c = d3.sum(recName, (r) => r.receive);
    setCount(c);
  }, [recName]);

  const [save, setSave] = useState(false);

  const badgeAdd = async () => {
    if (regData.length) {
      let rec = recName;
      rec.map((r) => {
        r.customerID = exData.id;
        r.Loc = loc;
        r.recNum = r.receive;
        delete r.receive;
      });

      const res = await Axios.post(url + "/postBadgeRec", rec).then((res) => {
        if (res.status !== 200) {
          alert("Error! - Adding receiver data not success");
        }
      });
    } else {
      if (count == 1) {
        let rec = recName[0];
        let dat = regData;

        dat.Loc = loc;
        dat.Mobile = rec.mobile;
        dat.Name = rec.name;
        dat.Pid = "";
        dat.Surname = rec.surname;
        delete dat.loc;
        delete dat.mobile;
        delete dat.name;
        delete dat.pid;
        delete dat.surname;

        console.log(dat);

        const res = await Axios.put(url + "/putExReceive", dat).then((res) => {
          if (res.status !== 200) {
            alert("Error! - Adding receiver data not success");
          }
        });
        setRegData({});
        setRegCode({ regcode: "" });
      } else {
        alert("Error! - Receiving by QR Code cannot add more than 1");
        return;
      }
    }
    setExData(initExData);
    setExName("");
    setSave(!save);
    document.getElementById("excode").focus();
  };

  const [regCode, setRegCode] = useState({ regcode: "" });

  const [regData, setRegData] = useState({});

  const getExData = async () => {
    try {
      const res = await Axios.post(url + "/getRegData", regCode).then((r) =>
        setRegData(r.data)
      );
    } catch (err) {
      if (err.response.status == 404) {
        alert("Not found data of this register");
      }
    }
  };

  const getExName = async () => {
    try {
      const res = await Axios.get(
        url + "/getExName/" + regData.customerID
      ).then((r) => {
        setExData(r.data);
        setExName(r.data.name);
      });
    } catch (err) {
      if (err.response.status == 404) {
        alert("Not found Exhibition name");
      }
    }
  };

  useEffect(() => {
    if (regCode.regcode.length == 8) {
      getExData();
    } else {
      setExData(initExData);
      setSave(!save);
    }
  }, [regCode]);

  useEffect(() => {
    if (Object.keys(regData).length) {
      getExName();
    } else {
      setExName("");
    }
  }, [regData]);

  useEffect(() => {
    //console.log(regData);
  }, [regData]);

  const [qrIsShow, setQrIsShow] = useState(false);

  const closeQR = () => {
    setQrIsShow(false);
  };

  useEffect(() => {
    console.log(exData);
  }, [exData]);

  return (
    <section className="ex-badge">
      <div className="print:hidden">
        <div className="text-2xl">Badge Receiving</div>
        <div className="flex my-5 max-lg:flex-col flex-auto md:gap-x-2">
          <div className="w-full">
            <div className="flex w-full max-md:flex-col mb-5 md:items-center">
              <label htmlFor="loc" className="mr-3">
                Location :
              </label>
              <select
                id="loc"
                className="cmb w-full sm:w-3/4 md:w-1/3"
                onChange={(e) => setLoc(e.target.value)}>
                <option value="0" selected disabled hidden>
                  select Location
                </option>
                {locList.length > 0 &&
                  locList.map((l, i) => (
                    <option key={i} value={l.id}>
                      {l.loc}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex w-full max-md:flex-col mb-5 md:items-center">
              <label htmlFor="excode" className="mr-3">
                Regist Code
              </label>

              <input
                id="excode"
                className="w-3/4 md:w-1/3"
                onChange={(e) => setRegCode({ regcode: e.target.value })}
                value={regCode.regcode}
              />
            </div>
            <div className="flex w-full max-md:flex-col">
              <label htmlFor="exname" className="mr-3">
                Exhibitor Name
              </label>

              <div className="flex flex-grow gap-2 items-center">
                <input
                  id="exname"
                  className="w-3/4 md:w-1/2"
                  onChange={(e) => searchtxtChange(e.target.value)}
                  onKeyDown={(e) => searchName(e)}
                  value={exName}
                />
                <div
                  className="btn-primary px-3"
                  onClick={() => setModalShow(true)}>
                  Search
                </div>
                <div className="ml-10">
                  <button
                    className="btn-green px-3 py-1"
                    onClick={() => setQrIsShow(true)}>
                    Show QR
                  </button>
                </div>
              </div>
            </div>
            <ReceiveList
              data={recFill}
              btn={printChange}
              save={save}
              ready={ready}
              regData={regData}
            />
            <div className="flex justify-center md:justify-start my-6">
              <button
                className={`btn-primary w-full sm:w-1/2 lg:w-1/4 px-4 py-1 ${
                  ready
                    ? "bg-green-600 border-green-600 hover:text-green-600 hover:border-green-600"
                    : ""
                }`}
                onClick={badgeAdd}
                disabled={!ready}>
                Save
              </button>
            </div>
          </div>

          <div className="border w-[62mm] h-[85mm] p-[3mm] max-lg:mb-3 max-lg:order-first ">
            <PrintBadge exName={exData.name} />
          </div>
        </div>
        <div className="w-full flex justify-center md:justify-start lg:justify-end">
          <ReactToPrint
            trigger={() => (
              <div
                className={`btn-primary w-full sm:w-1/2 lg:w-[62mm] px-4 py-1 ${
                  ready
                    ? "bg-green-600 border-green-600 hover:text-green-600 hover:border-green-600"
                    : ""
                }`}>
                Print
              </div>
            )}
            content={() => {
              if (ready) {
                return printRef.current;
              } else {
                alert("Data for badge printing is not complete");
                promiseResolveRef.current = null;
                setIsPrinting(false);
              }
            }}
            onBeforeGetContent={() => {
              return new Promise((resolve) => {
                promiseResolveRef.current = resolve;
                setIsPrinting(true);
              });
            }}
            onAfterPrint={(event) => {
              // Reset the Promise resolve so we can print again
              //not save data to database when print
              //badgeAdd()
              promiseResolveRef.current = null;
              setIsPrinting(false);
            }}
          />
        </div>
        <ReceiveHist cus={exData.id} ex={exID} url={url} bearer={bearer} />
      </div>

      <div className={`hidden print:block print:ml-[3mm]`} ref={printRef}>
        {[...Array(count)].map((e, i) => (
          <div className="w-[56mm] h-[30mm] flex items-center overflow-hidden">
            <div className="text-center font-semibold text-2xl w-full">
              {exData.name}
            </div>
          </div>
        ))}
      </div>
      <ModalSeach
        show={modalShow}
        exID={exID}
        onHide={closeModal}
        search={exName}
        fill={fillName}
      />
      <ModalQR
        show={qrIsShow}
        onHide={closeQR}
        customer={{ id: exData.id, ex: exID }}
      />
    </section>
  );
}
