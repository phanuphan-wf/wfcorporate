import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

import useCheckMobile from "../../hook/useCheckMobile";

import RegistInfo from "./regist_info";
import Interest from "./regist_interest";
import Resident from "./regist_resident";
import Media from "./regist_media";

import ModalPolicy from "../modal_policy";
import ModalFillData from "../modal_filldata";

import { MdLocationOn } from "react-icons/md";
import { MdAvTimer } from "react-icons/md";

export default function Registration(props) {
  const mobile = useCheckMobile();
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_reg;
  const exId = "i125";
  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);

  const closeModal = () => {
    setModalShow(!modalShow);
  };

  const [modalFillShow, setModalFillShow] = useState({
    show: false,
    module: "",
  });

  const closeFillModal = () => {
    setModalFillShow(!modalFillShow.show);
  };

  useEffect(() => {
    if (props.preregister) {
      setUac({ ...uac, preregist: true, campaign: props.campaign });
    }
    document.title = "Home Mega Show | Visitor Registration";
  }, []);

  const initBio = {
    name: "",
    surname: "",
    mobile: "",
    email: "",
    sex: "0",
    month: "0",
    year: "0",
    income: "0",
    province: "0",
    district: "0",
    occupation: "0",
  };

  const initUac = {
    accept: false,
    promote: false,
    preregist: false,
    exID: "",
    campaign: "",
  };

  const initIntr = {
    uid: "",
    F_bed: 0,
    F_living: 0,
    F_sofa: 0,
    F_kitchen: 0,
    F_dining: 0,
    F_working: 0,
    E_av: 0,
    E_ha: 0,
    E_small: 0,
    H_decor: 0,
    H_material: 0,
    H_homeproduct: 0,
    G_garden: 0,
    W_wedding: 0,
    F_fashion: 0,
    F_food: 0,
  };
  const initResi = { uid: "", house: 0 };
  const initMedia = {
    uid: "",
    tv: 0,
    billboard: 0,
    newspaper: 0,
    facebook: 0,
    google: 0,
    youtube: 0,
    line: 0,
    friend: 0,
    other: 0,
    cutout: 0,
    radio: 0,
    tiktok: 0,
    sms: 0,
  };

  /* ไม่ได้ใช้งาน */
  const initQ1 = {
    uid: "",
    c33: 0,
    c35: 0,
    c30: 0,
    c23: 0,
    c31: 0,
    c27: 0,
    c22: 0,
    c32: 0,
    c34: 0,
    c36: 0,
    c29: 0,
    c18: 0,
    non: 0,
  };
  const initQ3 = { uid: "", drama: 0, news: 0, game: 0, doc: 0, sport: 0 };
  const initCov = { uid: "", vaccine: 0, test: null, rtype: "v" };

  /*------------*/

  const [bio, setBio] = useState(initBio);
  const [uac, setUac] = useState(initUac);
  const [qIntr, setQIntr] = useState(initIntr);
  const [qResi, setQResi] = useState(initResi);
  const [qMedia, setQMedia] = useState(initMedia);

  /* ไม่ได้ใช้งาน */
  const [q1, setQ1] = useState(initQ1);
  const [q3, setQ3] = useState(initQ3);
  const [qCov, setQCov] = useState(initCov);
  /*------------*/

  const getBio = (data) => {
    setBio(data);
  };

  const getQItr = (data) => {
    setQIntr(data);
  };

  const getResi = (data) => {
    setQResi(data);
  };

  const getMedia = (data) => {
    setQMedia(data);
  };

  const modalAccept = () => {
    setUac({ ...uac, accept: true });
    setModalShow(false);
  };

  useEffect(() => {
    //console.log(uac);
    document.title = "Home Mega Show | Visitor Registration";
  }, [uac]);

  const verifyFill = () => {
    if (
      bio.name != "" &&
      bio.surname != "" &&
      bio.mobile != "" &&
      bio.mobile.match(/^\d{10}$/) &&
      bio.sex != "0" &&
      bio.year != "0" &&
      bio.province != "0" &&
      bio.district != "0"
    ) {
      setBioVerify(true);
      return true;
    } else {
      setBioVerify(false);
      return false;
    }
  };

  const [bioVerify, setBioVerify] = useState(true);

  const [intrVerify, setIntrVerify] = useState(true);

  const verifyIntr = () => {
    if (JSON.stringify(qIntr) == JSON.stringify(initIntr)) {
      setIntrVerify(false);
      return false;
    } else {
      setIntrVerify(true);
      return true;
    }
  };

  const [submiting, setSubmiting] = useState(false);

  const submitData = () => {
    if (!verifyFill()) {
      setModalFillShow({
        ...modalFillShow,
        show: true,
        module: "ส่วนผู้ชมงาน",
      });
      return;
    }

    if (!verifyIntr()) {
      setModalFillShow({
        ...modalFillShow,
        show: true,
        module: "ส่วนประเภทสินค้าที่สนใจ",
      });
      return;
    }

    if (!uac.accept) {
      setModalFillShow({
        ...modalFillShow,
        show: true,
        module: "accept",
      });
      return;
    }
    setSubmiting(true);
    postBio();
  };

  const postBio = async () => {
    let vid = "";
    let result = false;
    let visdata = Object.assign(bio, uac);
    try {
      const res = await Axios.post(url + "/Visitor", visdata).then((res) => {
        if (res.status === 200) {
          result = true;
          vid = res.data;

          if (vid.visitorID) {
            let intr = qIntr;
            intr.uid = vid.visitorID.toString();

            postQIntr(intr);

            let media = qMedia;
            media.uid = vid.visitorID.toString();
            postQMedia(media);

            let resi = qResi;
            resi.uid = vid.visitorID.toString();
            postQResi(resi);
          }
        }
      });

      if (result) {
        var CryptoJS = require("crypto-js");
        let valmoid = {
          mob: bio.mobile,
          id: vid.visitorID.toString(),
          preregist: uac.preregist,
          exID: uac.exID,
        };
        let key = CryptoJS.AES.encrypt(
          JSON.stringify(valmoid),
          process.env.REACT_APP_KEY
        ).toString();
        key = key
          .replaceAll("+", "WFPLU")
          .replaceAll("/", "WFSLA")
          .replaceAll("=", "WFEQU");

        navigate("/" + exId + "/postregister/success/" + key);
      } else {
        alert("ขออภัยท่านเคยลงทะเบียนแล้ว");
      }
    } catch (err) {
      alert(err);
      navigate("/" + exId + "/postregister/none/xfmb");
    }
    setSubmiting(false);
  };

  async function postQMedia(data) {
    const res = await Axios.post(url + "/QMedia", data);
    if (res.status !== 200) {
      alert("การเพิ่มข้อมูลไม่สำเร็จ โปรดลองอีกครั้ง(qMedia)");
    }
  }

  async function postQIntr(data) {
    const res = await Axios.post(url + "/QIntr", data);
    if (res.status !== 200) {
      alert("การเพิ่มข้อมูลไม่สำเร็จ โปรดลองอีกครั้ง(qIntr)");
    }
  }

  async function postQResi(data) {
    try {
      const res = await Axios.post(url + "/QResident", data);
    } catch (err) {
      alert("การเพิ่มข้อมูลไม่สำเร็จ โปรดลองอีกครั้ง(qResi)", err);
    }
  }

  return (
    <section className="regist_b424 xl:container">
      <div className="w-full flex justify-center my-3">
        <img
          src={require("./img/new-logo-HMS-.png")}
          alt="landing hero"
          id="hero_banner"
          className="mx-auto w-2/3 md:w-1/3"
        />
      </div>
      <div className="text-center text-xl md:text-xl lg:text-3xl font-medium mb-4">
        อิมแพ็ค เมืองทองธานี{mobile ? <br /> : " | "}
        11-19 มกราคม 2568
      </div>
      <div className="flex gap-4 lg:gap-10 w-full justify-center mb-4">
        <div className="bg-[#252525] text-white px-3 py-1 text-sm md:text-xl lg:text-2xl flex items-center gap-1 rounded-full">
          <MdLocationOn />
          ฮอลล์ 9-12
        </div>
        <div className="bg-[#252525] text-white px-3 py-1 text-sm md:text-xl lg:text-2xl flex items-center gap-1 rounded-full">
          <MdAvTimer />
          10.30-20.30 น.
        </div>
      </div>
      <div className="text-center text-2xl md:text-3xl font-medium my-10">
        ลงทะเบียนเข้าชมงาน{uac.preregist && "ล่วงหน้า"}
      </div>
      <RegistInfo bioData={getBio} verify={bioVerify} />
      <Interest intrData={getQItr} verify={intrVerify} />
      <Resident resiData={getResi} />
      <Media mediaData={getMedia} />
      <div className="container max-w-5xl px-10 mb-10">
        <div className="max-md:text-lg">
          <input
            type="checkbox"
            id="chb-promote"
            className="mr-2 accent-red-500"
            onChange={(e) => setUac({ ...uac, promote: !uac.promote })}
          />
          <label for="chb-promote">ยินยอมรับข่าวสารจาก เวิลด์ แฟร์</label>
        </div>
        <div className="max-md:text-lg">
          <input
            type="checkbox"
            id="chb-policy"
            className="mr-2 accent-red-500"
            onChange={(e) => setUac({ ...uac, accept: !uac.accept })}
            checked={uac.accept}
          />
          <label for="chb-policy">
            ยินยอมรับข้อกำหนดและเงื่อนไข{" "}
            <button
              className="cursor-pointer text-red-800 hover:text-red-500"
              data-modal-target="staticModal"
              data-modal-toggle="staticModal"
              type="button"
              onClick={() => setModalShow(!modalShow)}
            >
              นโยบายความเป็นส่วนตัว
            </button>
          </label>
        </div>
        <div
          className="mt-3 mx-auto w-full sm:w-3/4 md:w-1/2 bg-gradient-to-r from-blue-900 from-[50%] to-orange-500 bg-[size:200%] bg-[position:_0%_0%] hover:bg-[position:_100%_100%] text-white rounded-lg text-center py-1 transition-all duration-300 max-md:text-lg"
          onClick={submitData}
          disabled={submiting}
        >
          {!submiting ? "บันทึกข้อมูล" : "กำลังบันทึกข้อมูล..."}
        </div>
      </div>
      <ModalPolicy show={modalShow} onHide={closeModal} accept={modalAccept} />
      <ModalFillData
        show={modalFillShow.show}
        onHide={closeFillModal}
        module={modalFillShow.module}
      />
    </section>
  );
}
