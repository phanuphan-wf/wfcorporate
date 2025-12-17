import { useEffect, useRef, useState, forwardRef, createContext } from "react";
import ReactToPrint from "react-to-print";
import Axios from "axios";
import * as d3 from "d3";
import useHeader from "../../../hook/useHeader";

import ReceiveList from "./receivelist";
import ReceiveHist from "./receiveHist";
import ModalSeach from "./modalSearch";
import PrintBadge from "./printBadge";
import ModalQR from "./modalQR";

export const dataContext = createContext();

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
      setRegData({ ...regData, exID: res.data });
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

  const [canPrint, setCanPrint] = useState(false);

  const printChange = (value) => {
    setCanPrint(value);
  };

  const [loc, setLoc] = useState(0);
  const [type, setType] = useState("0");

  const [qrIsShow, setQrIsShow] = useState(false);

  const closeQR = () => {
    setQrIsShow(false);
  };

  const [regCode, setRegCode] = useState("");

  const [regData, setRegData] = useState({});

  const getRegistData = async () => {
    const res = await Axios.post(
      url + "/getRegData",
      {},
      { params: { code: regCode } }
    ).then((r) => {
      try {
        if (r.status == 200) {
          setRegData(r.data);
        }
      } catch (err) {
        alert("Error! " + err);
      }
    });
  };

  useEffect(() => {
    if (regCode.length == 8 && loc != 0 && type != "0") {
      getRegistData();
    }
    if (regCode == "") {
      setExData(initExData);
      setRegData({
        exID: exID,
      });
      setExName("");
    }
  }, [regCode]);

  const getCustomer = async (id) => {
    const res = await Axios.get(url + "/getExName/" + id).then((r) => {
      if (r.status == 200) {
        let c = r.data;
        fillName(c.id, c.name);
      }
    });
  };

  useEffect(() => {
    let r = regData;
    if (
      r.customerID != undefined &&
      r.exID != undefined &&
      r.mobile != undefined &&
      r.name != undefined &&
      (r.recNum != 0 || r.recName != undefined) &&
      Object.keys(regData).length
    ) {
      setReady(true);
    } else {
      setReady(false);
    }
    if (regCode.length == 8) {
      getCustomer(regData.customerID);
    }

    console.log(regData);
  }, [regData]);

  useEffect(() => {
    if (exData.id != "" && regCode.length != 8) {
      setRegData({ ...regData, customerID: exData.id });
    }
  }, [exData]);

  const onSubmit = async () => {
    if (!ready) {
      alert("Warning! Data not complete, please fill all data");
      return;
    }
    let data = regData;
    data.exID = exID;
    data.loc = loc;
    data.bType = type;

    try {
      const res = await Axios.post(url + "/postBadgeRec", data).then((r) => {
        if (r.status == 200) {
          alert("Insert data complete");
          setRegCode("");
          setExData(initExData);
          setExName("");
          setRegData({ exID: exID });
        }
      });
    } catch (err) {
      alert("Error - " + err);
    }
  };

  return (
    <dataContext.Provider
      value={{
        exID: exID,
        regDataC: [regData, setRegData],
        exDataC: [exData, setExData],
        badge: type,
      }}>
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
                <label htmlFor="btype" className="mr-3">
                  Location :
                </label>
                <select
                  id="btype"
                  className="cmb w-full sm:w-3/4 md:w-1/3"
                  onChange={(e) => setType(e.target.value)}>
                  <option value="0" selected disabled hidden>
                    select Badge Type
                  </option>
                  <option value={"c"}>Contractor Badge</option>
                  <option value={"e"}>Exhibitor Badge</option>
                </select>
              </div>
              <div className="flex w-full max-md:flex-col mb-5 md:items-center">
                <label htmlFor="excode" className="mr-3">
                  Regist Code
                </label>

                <input
                  id="excode"
                  className="w-3/4 md:w-1/3"
                  onChange={(e) => setRegCode(e.target.value)}
                  value={regCode}
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
                    className={`btn-primary px-3 ${
                      regCode.length == 8 ? "hidden" : ""
                    }`}
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

              <ReceiveList />

              <div className="flex justify-center md:justify-start my-6">
                <button
                  className={`btn-primary w-full sm:w-1/2 lg:w-1/4 px-4 py-1 ${
                    ready
                      ? "bg-green-600 border-green-600 hover:text-green-600 hover:border-green-600"
                      : ""
                  }`}
                  onClick={onSubmit}
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

          <ReceiveHist />
        </div>
        {/*
        <div className={`hidden print:block print:ml-[3mm]`} ref={printRef}>
          {[...Array(count)].map((e, i) => (
            <div className="w-[56mm] h-[30mm] flex items-center overflow-hidden">
              <div className="text-center font-semibold text-2xl w-full">
                {exData.name}
              </div>
            </div>
          ))}
        </div>
        */}
        <ModalSeach
          show={modalShow}
          exID={exID}
          onHide={closeModal}
          search={exName}
          fill={getCustomer}
        />
        <ModalQR
          show={qrIsShow}
          onHide={closeQR}
          customer={{ id: exData.id, ex: exID }}
        />
      </section>
    </dataContext.Provider>
  );
}
