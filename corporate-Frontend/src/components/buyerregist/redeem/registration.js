import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import useCheckMobile from "../../hook/useCheckMobile";

import RegistInfo from "./regist_info";
import Interest from "./regist_interest";
import Resident from "./regist_resident";
import Media from "./regist_media";

import ModalPolicy from "../modal_policy";
import ModalFillData from "../modal_filldata";

export default function Registration(props) {
  const { t, i18n } = useTranslation("redeem", { keyPrefix: "regist_redeem" });

  const mobile = useCheckMobile();
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_brt;
  const exId = "b325";
  const nav = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [qrcode, setQrcode] = useState("");

  //const [resSMS, setresSMS] = useState();

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
    document.title = "World Fair | Visitor Registration";
    setQrcode(generateRandomCode());
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
    exID: exId,
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
    bts: 0,
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

  useEffect(() => {
    //console.log(qMedia);
  }, [qMedia]);

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
    document.title = "World Fair | Buyer Information";
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

  const generateRandomCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    const getRandom = (chars, length) =>
      Array.from({ length }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("");

    const prefix = getRandom(letters, 2);
    const middle = getRandom(numbers, 6);
    const suffix = getRandom(letters, 2);

    return prefix + middle + suffix;
  };

  const submitData = () => {
    if (!verifyFill()) {
      setModalFillShow({
        ...modalFillShow,
        show: true,
        module: t("filldata.visitor"),
      });
      return;
    }

    /*
    if (!verifyIntr()) {
      setModalFillShow({
        ...modalFillShow,
        show: true,
        module: t("filldata.product"),
      });
      return;
    }
    */

    if (!uac.accept) {
      setModalFillShow({
        ...modalFillShow,
        show: true,
        module: "accept",
      });
      return;
    }

    // 🔥 สร้าง Visitor ID ที่นี่

    setSubmiting(true);
    postBio();
  };

  const postBio = async () => {
    let vid = "";
    let result = false;

    let visdata = Object.assign(bio, uac);
    try {
      const res = await Axios.post(url + "/Visitor", visdata, {
        params: { code: qrcode },
      }).then((res) => {
        if (res.status === 200) {
          result = true;
          vid = res.data.visitorID;

          if (vid) {
            /*
            let intr = qIntr;
            intr.uid = vid.toString();

            postQIntr(intr);
            */
            let media = qMedia;
            media.uid = vid.toString();
            postQMedia(media);

            let resi = qResi;
            resi.uid = vid.toString();
            postQResi(resi);
          }

          const smsdata = {
            mob: bio.mobile,
            id: vid.toString(),
          };

          try {
            const sms = postsms(smsdata);
            if (sms) {
              //alert ขอบพระคุณสำหรับการลงทะเบียน กรุณารอรับ sms และแสดง qr code กับ เจ้าหน้าที่
              try {
                let attempt = 0;
                let timer = null;

                const checkSMS = () => {
                  getsms(smsdata).then((r) => {
                    if (r.code !== -1 && r.code !== undefined) {
                      clearInterval(timer);

                      console.log("code", r.code);

                      if (r.code == "0") {
                        Swal.fire({
                          icon: "success",
                          title: t("success_200.title"),
                          text: t("success_200.text"),
                          confirmButtonText: t("success_200.confirmButtonText"),
                          customClass: {
                            confirmButton: "swal2-red-btn",
                          },
                        }).then((r) => {
                          if (r.isConfirmed) {
                            nav("/redeem/postregister");
                          }
                        });
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: t("error_200.title"),
                          text: t("error_200.text"),
                          confirmButtonText: t("error_200.confirmButtonText"),
                          customClass: {
                            confirmButton: "swal2-red-btn",
                          },
                        });
                      }
                    }

                    attempt++;

                    if (
                      attempt >= 3 &&
                      (r.code === -1 || r.code === undefined)
                    ) {
                      clearInterval(timer);

                      Swal.fire({
                        icon: "error",
                        title: t("sms_null.title"),
                        text: t("sms_null.text"),
                        confirmButtonText: t("sms_null.confirmButtonText"),
                        customClass: {
                          confirmButton: "swal2-red-btn",
                        },
                      });
                    }
                  });
                };

                checkSMS();

                timer = setInterval(() => {
                  checkSMS();
                }, 500);
              } catch {
                // try checkSMS
                alert("Cannot send sms to user");
              }
            } else {
              //alert ขออภัย หมายเลขโทรศัพท์ที่ลงทะเบียน ไม่ถูกต้อง โปรดตรวจสอบหมายเลขโทรศัพท์ของท่านอีกครั้ง
              Swal.fire({
                icon: "error",
                title: t("error_200.title"),
                text: t("error_200.text"),
                confirmButtonText: t("error_200.confirmButtonText"),
                customClass: {
                  confirmButton: "swal2-red-btn",
                },
              });
            }
          } catch (err) {
            if (err.response.status == 404) {
              //alert ขออภัย ไม่พบข้อมูล QR code ในระบบ โปรดทำการตรวจสอบเบอร์โทรศัพท์ของท่านอีกครั้ง
              Swal.fire({
                icon: "error",
                title: t("error_404.title"),
                text: t("error_404.text"),
                confirmButtonText: t("error_404.confirmButtonText"),
                customClass: {
                  confirmButton: "swal2-red-btn",
                },
              }).then(() => nav("/redeem"));

              //alert("Not found visitor data");
              nav("/redeem");
            }
          }
        }
      });
    } catch (err) {
      if (err.response.status == 409) {
        Swal.fire({
          icon: "success",
          title: t("success_409.title"),
          text: t("success_409.text"),
          confirmButtonText: t("success_409.confirmButtonText"),
          customClass: {
            confirmButton: "swal2-red-btn",
          },
        });

        const data = {
          mobile: visdata.mobile,
          code: qrcode,
        };
        const result = await Axios.post(url + "/MobileCheck", data).then(
          (r) => r.status && nav("/redeem/" + qrcode)
        );
      }
    }

    setSubmiting(false);
  };

  const postsms = async (data) => {
    const resSMS = await Axios.post(url + "/PostSMS", data).then((r) => {
      if (r.status == 200) {
        return true;
      } else {
        return false;
      }
    });
  };

  const getsms = async (data) => {
    console.log(url);
    const res = await Axios.post(url + "/GetSMS", data);
    return res.data;
  };

  async function postQMedia(data) {
    const res = await Axios.post(url + "/QMedia", data);
    if (res.status !== 200) {
      alert(t("unsuccess") + "(qMedia)");
    }
  }

  async function postQIntr(data) {
    const res = await Axios.post(url + "/QIntr", data);
    if (res.status !== 200) {
      alert(t("unsuccess") + "(qIntr)");
    }
  }

  async function postQResi(data) {
    try {
      const res = await Axios.post(url + "/QResident", data);
    } catch (err) {
      alert(t("unsuccess") + "(qResi)", err);
    }
  }

  const changLng = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  return (
    <section className="regist_i525 xl:container">
      <div className="flex justify-end items-center gap-2 mt-4">
        <div className="mr-2">{t("lng")}</div>
        <div className="flex gap-2">
          <div
            className={`cursor-pointer ${
              i18n.language === "en"
                ? "font-bold text-red-500"
                : "text-slate-500"
            }`}
            onClick={() => changLng("en")}>
            EN
          </div>
          <div>|</div>
          <div
            className={`cursor-pointer ${
              i18n.language === "th"
                ? "font-bold text-red-500"
                : "text-slate-500"
            }`}
            onClick={() => changLng("th")}>
            TH
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <img
          src={require("../../img/logo-wf-sq.png")}
          alt="wf-logo"
          className="w-24 object-contain"
        />
      </div>

      <div className="text-center text-2xl md:text-3xl font-semibold my-6">
        {t("title")}
      </div>
      <RegistInfo bioData={getBio} verify={bioVerify} />
      {/*
      <Interest intrData={getQItr} verify={intrVerify} />
      */}
      <Resident resiData={getResi} />

      <Media mediaData={getMedia} />
      <div className="container max-w-5xl px-10 mb-10">
        <div className="max-md:text-lg">
          <input
            type="checkbox"
            id="chb-promote"
            className="mr-2"
            onChange={(e) => setUac({ ...uac, promote: !uac.promote })}
          />
          <label for="chb-promote">{t("newsaccept")}</label>
        </div>
        <div className="max-md:text-lg">
          <input
            type="checkbox"
            id="chb-policy"
            className="mr-2"
            onChange={(e) => setUac({ ...uac, accept: !uac.accept })}
            checked={uac.accept}
          />
          <label for="chb-policy">
            {t("acceptterm")}{" "}
            <button
              className="cursor-pointer text-red-800 hover:text-red-500"
              data-modal-target="staticModal"
              data-modal-toggle="staticModal"
              type="button"
              onClick={() => setModalShow(!modalShow)}>
              {t("policy")}
            </button>
          </label>
        </div>
        <div
          className="mt-3 mx-auto w-full sm:w-3/4 md:w-1/2 bg-gradient-to-r from-green-600 from-[50%] to-green-500 bg-[size:200%] bg-[position:_0%_0%] hover:bg-[position:_100%_100%] text-white rounded-lg text-center py-1 transition-all duration-300 max-md:text-lg"
          onClick={submitData}
          disabled={submiting}>
          {!submiting ? t("submit") : t("saving")}
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
