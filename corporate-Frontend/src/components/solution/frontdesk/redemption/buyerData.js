import Axios from "axios";
import React, { useEffect, useState } from "react";

import ModalInfo from "./modalInfo";

export default function BuyerData(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_Coupon_api;
  var CryptoJS = require("crypto-js");
  const initVisitor = {
    Name: "",
    Surname: "",
    PersonalID: "",
    Street: "",
    SubDis: "",
    District: "",
    Province: "",
    Sex: "",
    Tel: "",
    email: "",
    birthday: "",
    premium: "",
    emID: CryptoJS.AES.decrypt(
      JSON.parse(localStorage.getItem("user")).EmID,
      process.env.REACT_APP_KEY
    ).toString(CryptoJS.enc.Utf8),
  };
  const [visitor, setVisitor] = useState(initVisitor);

  const [pidCheck, setPidCheck] = useState(false);

  const pCheck = (id) => {
    setVisitor({ ...visitor, PersonalID: id });
    let check = id.match(/^\d[-]\d{4}[-]\d{5}[-]\d{2}[-]\d{1}$/);
    if (check) {
      setPidCheck(true);
    } else {
      setPidCheck(false);
    }
  };

  const [mobileCheck, setMobileCheck] = useState(true);

  const mCheck = (m) => {
    setVisitor({ ...visitor, Tel: m });
    if (m != "") {
      let check = m.match(/^\d{10}$/);
      if (check) {
        setMobileCheck(true);
      } else {
        setMobileCheck(false);
      }
    } else {
      setMobileCheck(true);
    }
  };

  const [birthCheck, setBirthCheck] = useState(false);
  const bCheck = (b) => {
    setVisitor({ ...visitor, birthday: b });
    let check = b.match(/^\d{1,2}[/]\d{1,2}[/]\d{4}$/);
    if (check) {
      setBirthCheck(true);
    } else {
      setBirthCheck(false);
    }
  };

  useEffect(() => {
    props.data(visitor);
    if (qrcode.length == 10) {
      idCheck();
    }
  }, [visitor]);

  const clearData = () => {
    setVisitor(initVisitor);
    setMobileCheck(true);
    setPidCheck(false);
    setBirthCheck(false);
    setQrcode("");
  };

  useEffect(() => {
    document.getElementById("qrcode").focus();
  }, []);

  useEffect(() => {
    clearData();
  }, [props.reset]);

  const idCheck = async () => {
    const data = {
      id: qrcode.length == 10 ? visitor.Tel : visitor.PersonalID,
      exid: props.exID,
      qr: qrcode.length == 10,
    };

    const res = await Axios.post(url + "/visCheck", data).then((res) => {
      if (res.data == false) {
        setInfoText({
          header: "Information",
          body: "This buyer is already redeemed premium within today",
          headerStyle: "text-red-500",
        });
        setModalInfo(true);
      }
    });
  };

  const [modalInfoShow, setModalInfo] = useState(false);

  const [infoText, setInfoText] = useState({});

  const closeModalInfo = () => {
    setModalInfo(false);
  };

  const exSelectCheck = () => {
    if (visitor.Name != "" && props.exID == "") {
      alert("Please select exhibition name before input data");
    }
  };

  const [qrcode, setQrcode] = useState("");

  const getVisData = async () => {
    const res = await Axios.get(url + "/qrVis/" + qrcode)
      .then((r) => {
        if (r.status === 200) {
          let v = r.data;
          setVisitor({
            ...visitor,
            Name: v.name,
            Surname: v.surname,
            PersonalID: "0-0000-00000-00-0",
            Street: "",
            SubDis: "",
            District: v.district,
            Province: v.province,
            Sex: v.sex,
            Tel: v.mobile,
            email: v.email,
            birthday: v.birth,
          });
        }
      })
      .catch((err) => {
        if (err.response.status == 404) {
          alert("Warning! QR Code is expire");
        }
      });
  };

  useEffect(() => {
    if (qrcode.length == 10) {
      getVisData();
    }
  }, [qrcode]);

  return (
    <section>
      <div className="flex items-center gap-4 my-8">
        <label htmlFor="qrcode">QR Code</label>
        <input
          id="qrcode"
          className="w-1/4 disabled:bg-gray-200"
          value={qrcode}
          onChange={(e) => setQrcode(e.target.value)}
          disabled={!props.exID}
          maxLength={10}
        />
      </div>
      <div className="border rounded-md p-3 mt-8 mb-2 border-slate-400 relative">
        <div className="text-lg absolute -top-4 left-2 px-3 bg-white h-fit">
          Buyer Data
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <div>
            <label for="bname" className="block">
              Name:
            </label>
            <input
              id="bname"
              className="w-full"
              onChange={(e) => setVisitor({ ...visitor, Name: e.target.value })}
              value={visitor.Name}
              onBlur={exSelectCheck}
            />
          </div>
          <div>
            <label for="bsurname" className="block">
              Surame:
            </label>
            <input
              id="bsurname"
              className="w-full"
              onChange={(e) =>
                setVisitor({ ...visitor, Surname: e.target.value })
              }
              value={visitor.Surname}
            />
          </div>
          <div>
            <label for="bid" className="block">
              Personal ID:
            </label>
            <input
              id="bid"
              className="w-full"
              onChange={(e) => pCheck(e.target.value)}
              value={visitor.PersonalID}
              onBlur={idCheck}
            />
            <span className={`text-red-500 ${pidCheck ? "hidden" : ""}`}>
              format: x-xxxx-xxxxx-xx-x
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div className="col-span-2 md:col-span-3">
            <label for="bstreet" className="block">
              Address Street:
            </label>
            <input
              id="bstreet"
              className="w-full"
              onChange={(e) =>
                setVisitor({ ...visitor, Street: e.target.value })
              }
              value={visitor.Street}
            />
          </div>
          <div>
            <label for="bsubdis" className="block">
              Subdistrict:
            </label>
            <input
              id="bsubdis"
              className="w-full"
              onChange={(e) =>
                setVisitor({ ...visitor, SubDis: e.target.value })
              }
              value={visitor.SubDis}
            />
          </div>
          <div>
            <label for="bdis" className="block">
              District:
            </label>
            <input
              id="bdis"
              className="w-full"
              onChange={(e) =>
                setVisitor({ ...visitor, District: e.target.value })
              }
              value={visitor.District}
            />
          </div>
          <div className="col-span-2 sm:col-auto">
            <label for="bprovince" className="block">
              Province:
            </label>
            <input
              id="bprovince"
              className="w-full"
              onChange={(e) =>
                setVisitor({ ...visitor, Province: e.target.value })
              }
              value={visitor.Province}
            />
          </div>
          <div>
            <label for="bbirth" className="block">
              Birthday:
            </label>
            <input
              id="bbirth"
              className="w-full"
              onChange={(e) => bCheck(e.target.value)}
              value={visitor.birthday}
            />
            <span className={`text-red-500 ${birthCheck ? "hidden" : ""}`}>
              format: dd/mm/yyyy
            </span>
          </div>
          <div>
            <label for="bsex" className="block">
              Sex:
            </label>
            <input
              id="bsex"
              className="w-full"
              onChange={(e) => setVisitor({ ...visitor, Sex: e.target.value })}
              value={visitor.Sex}
            />
          </div>
          <div className="col-span-2 sm:col-start-1 sm:col-span-1">
            <label htmlFor="bmobile" className="block">
              Mobile:
            </label>
            <input
              id="bmobile"
              className="w-full"
              onChange={(e) => mCheck(e.target.value)}
              value={visitor.Tel}
            />
            <span className={`text-red-500 ${mobileCheck ? "hidden" : ""}`}>
              mobile number format is not right
            </span>
          </div>
          <div className="col-span-2">
            <label for="bother" className="block">
              Other Info:
            </label>
            <input
              id="bother"
              className="w-full"
              onChange={(e) =>
                setVisitor({ ...visitor, email: e.target.value })
              }
              value={visitor.email}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <div
          className="border-2 border-slate-400 px-4 py-1 rounded-md w-fit bg-slate-400 text-white hover:bg-white hover:text-slate-400"
          onClick={clearData}>
          Clear Data
        </div>
      </div>
      <ModalInfo
        show={modalInfoShow}
        onHide={closeModalInfo}
        infoText={infoText}
      />
    </section>
  );
}
