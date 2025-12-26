import { useState, useEffect, useContext, useRef } from "react";
import Axios from "axios";
import { dataContext } from "./index";

import ModalSeach from "./modalSearch";

export default function QuotaShow() {
  const { serv, show, modalTextC, cidC } = useContext(dataContext);
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_squ;

  const [qrcode, setQrcode] = useState("");
  const [user, setUser] = useState({});
  const [cid, setCid] = cidC;

  const [isShow, setIsShow] = show;
  const [modalText, setModalText] = modalTextC;

  const [isSearch, setIsSearch] = useState(false);

  const getUser = async () => {
    try {
      const res = await Axios.get(url + "/getUser/" + qrcode + "/" + serv).then(
        (r) => {
          if (r.status == 200) {
            setUser(r.data);
            setCid(r.data.customerID);
          }
        }
      );
    } catch (err) {
      if (err.response.status == 404) {
        setModalText({
          header: "Warning",
          hcolor: "red",
          body: "User is not registed for this show exhibitor",
          bcolor: "",
          button: "Ok",
          btncolor: "",
          cancel: false,
        });
      }
      setIsShow(true);
    }
  };

  const qrInput = () => {
    if (qrcode.length == 8) {
      if (serv == 0) {
        setModalText({
          header: "Info",
          hcolor: "red",
          body: "Please select service before receiving",
          bcolor: "",
          button: "Ok",
          btncolor: "",
          cancel: false,
        });
        setIsShow(true);
        return;
      }
      getUser();
    } else {
      setUser({});
      setOnsubmit(false);
      setCid(0);
      document.getElementById("qrcode").focus();
    }
  };

  const quotabox = useRef(null);
  const [boxWidth, setBoxWidth] = useState(0);

  useEffect(() => {
    setBoxWidth(quotabox.current.offsetWidth);
  }, []);

  const [onSubmit, setOnsubmit] = useState(false);

  const submit = async () => {
    const data = { uid: qrcode, service: serv };
    try {
      setOnsubmit(true);
      const res = await Axios.post(url + "/usedService", data).then((r) => {
        if (r.status == 200) {
          setModalText({
            header: "Success",
            hcolor: "green",
            body:
              "Confirm use coupon already<br/><font style={{color:red}}>{Remain : " +
              r.data.remain +
              " }</font>",
            bcolor: "",
            button: "Ok",
            btncolor: "",
            cancel: false,
          });
          setIsShow(true);
        }
      });
    } catch (err) {
      if (err.response.status == 404) {
        setModalText({
          header: "Warning",
          hcolor: "red",
          body: "User is not registed for this show exhibitor",
          bcolor: "",
          button: "Ok",
          btncolor: "",
          cancel: false,
        });
        setIsShow(true);
      } else if (err.response.status == 409) {
        setModalText({
          header: "Warning",
          hcolor: "red",
          body: "No coupon left for this customer",
          bcolor: "",
          button: "Ok",
          btncolor: "",
          cancel: false,
        });
        setIsShow(true);
      }
    }
    setQrcode("");
    setUser({});
    setOnsubmit(false);
    setCid(0);
    document.getElementById("qrcode").focus();
  };

  useEffect(() => {
    qrInput();
  }, [qrcode]);

  const closeModal = () => {
    setIsSearch(false);
  };

  const searchCustomer = (id, cus) => {
    setCid(id);
    setUser({ ...user, customerName: cus });
    setIsSearch(false);
  };

  return (
    <section className="quotashow mt-8">
      <div>
        <label htmlFor="qrcode">Exhibitor Code : </label>
        <input
          id="qrcode"
          maxLength={8}
          onChange={(e) => setQrcode(e.target.value)}
          value={qrcode}
        />
      </div>
      <div className="mt-4" style={{ width: boxWidth }}>
        <label htmlFor="c_name" className="block">
          Company Name :{" "}
        </label>
        <div className="flex max-lg:flex-col justify-start lg:justify-between">
          <span className="px-20 text-red-500">
            {Object.keys(user).length ? user.customerName : ""}
          </span>

          <button
            className="text-white bg-amber-500 rounded-lg min-w-24 px-4 py-1 hover:bg-amber-600"
            onClick={() => setIsSearch(true)}>
            Search
          </button>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="name" className="block">
          Exhibitor Name :{" "}
        </label>
        <span className="px-20 text-red-500">
          {Object.keys(user).length
            ? user.name == undefined
              ? ""
              : user.name + " " + user.surname
            : ""}
        </span>
      </div>
      <div className="flex mt-4 justify-end" style={{ width: boxWidth }}>
        <button
          className="text-white bg-green-500 rounded-lg min-w-24 px-4 py-1 hover:bg-green-600 disabled:bg-slate-400 disabled:text-slate-200"
          disabled={
            (Object.keys(user).length &&
              Number(user.quota) - Number(user.used) == 0) ||
            onSubmit
          }
          onClick={submit}>
          {!onSubmit ? "Confirm Used" : "Saving..."}
        </button>
      </div>
      <div
        className="mt-4 flex max-lg:flex-col gap-4 lg:gap-7 w-full lg:w-fit"
        ref={quotabox}>
        <div className="w-full h-52 lg:size-52 border-4 border-emerald-600 rounded-xl flex flex-col justify-between p-4">
          <div>Remain</div>
          <div className="flex w-full justify-center text-7xl text-emerald-500">
            {Object.keys(user).length
              ? user.quota == undefined
                ? ""
                : Number(user.quota) - Number(user.used)
              : ""}
          </div>
          <div className="flex w-full justify-end">coupon</div>
        </div>
        <div className="w-full h-52 lg:size-52 border-4 border-amber-600 rounded-xl flex flex-col justify-between p-4">
          <div>Total Used</div>
          <div className="flex w-full justify-center text-7xl text-amber-500">
            {Object.keys(user).length
              ? user.used == undefined
                ? ""
                : Number(user.used)
              : ""}
          </div>
          <div className="flex w-full justify-end">coupon</div>
        </div>
        <div className="w-full h-52 lg:size-52 border-4 border-indigo-600 rounded-xl flex flex-col justify-between p-4">
          <div>Today Used</div>
          <div className="flex w-full justify-center text-7xl text-indigo-500">
            {Object.keys(user).length
              ? user.today == undefined
                ? ""
                : Number(user.today)
              : ""}
          </div>
          <div className="flex w-full justify-end">coupon</div>
        </div>
      </div>
      <ModalSeach show={isSearch} onHide={closeModal} fill={searchCustomer} />
    </section>
  );
}
