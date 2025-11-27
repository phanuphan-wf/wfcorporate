import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Axios from "axios";
// import useHeader from "../hook/useHeader";

export default function BuyerRegist() {
  const { t, i18n } = useTranslation("redeem", {
    keyPrefix: "redeem.buyerregist",
  });

  const nav = useNavigate();
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_brt;

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

  const [registed, setRegisted] = useState("");
  const initRegistCheck = {
    mobile: "",
    code: generateRandomCode(),
  };
  const [registCheck, setRegistCheck] = useState(initRegistCheck);

  const MobileCheck = async () => {
    if (registCheck.mobile && registCheck.mobile.length != 10) {
      //แก้ไข alert
      //alert("Number format invalid");
      Swal.fire({
          icon: "error",
          title: t("alert_error_title"),
          text: t("alert_error_text"),
          confirmButtonText: t("confirmButtonText"),
          customClass: {
            confirmButton: "swal2-red-btn",
          },
                  
        });
      return;
    }

    try {
      const res = await Axios.post(url + "/MobileCheck", registCheck).then(
        (r) => {
          if (r.status == 200) {

             //console.log("เจอเบอร์:", res.data);
            Swal.fire({
              icon: "success",
              title: t("alert_success_title"),
              text: t("alert_success_text"),
              confirmButtonText: t("confirmButtonText"),
              customClass: {
                confirmButton: "swal2-red-btn",
              },
                      
            }).then(() => nav("/redeem/"+ registCheck.code ));
            
          }
        }
      );
    } catch (err) {
      if (err.response.status == 404) {
        //alert ไม่เจอเบอร์
        //alert("Not found mobile number");
        Swal.fire({
          icon: "error",
          title: t("alert_error404_title"),
          text: t("alert_error404_text"),
          confirmButtonText: t("confirmButtonText"),
          customClass: {
            confirmButton: "swal2-red-btn",
          },
                  
        });


      }
    }
  };

  return (
    <section className="exregsit container mx-auto py-6 px-4 lg:py-10">
      {/* 🔹 ปุ่มเปลี่ยนภาษา (มุมขวาบน) */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {["th", "en"].map((lng) => (
          <button
            key={lng}
            onClick={() => i18n.changeLanguage(lng)}
            className={`px-3 py-1 rounded border transition ${
              i18n.language === lng
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-600 border-gray-300"
            }`}>
            {lng.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🔹 โลโก้กึ่งกลาง */}
      <div className="size-20 mx-auto">
        <img
          src={require("../img/logo-wf-sq.png")}
          alt="wf-logo"
          className="w-full object-contain"
        />
      </div>

      <h1 className="text-2xl mt-4 font-semibold">{t("header")}</h1>

      {/* 🔹 กล่องเนื้อหา */}
      <div className="mt-6 md:w-2/3 xl:w-1/2 mx-auto">
        {/* ▶ radio: ลงทะเบียนแล้ว */}
        <div className="flex items-center gap-2 mt-2 cursor-pointer">
          <input
            type="radio"
            id="registered"
            name="registerStatus"
            checked={registed == "registed"}
            onChange={() => setRegisted("registed")}
            className="w-4 h-4 accent-green-500"
          />
          <label htmlFor="registered">{t("radio_register")}</label>
        </div>
        <div
          className={`mt-3 flex flex-col gap-2 ${
            (registed != "registed" || registed == "") && "hidden"
          }`}>
          <label htmlFor="phone" className="font-medium">
            {t("label_register")}
          </label>
          <input
            type="tel"
            id="phone"
            value={registCheck.mobile}
            onChange={(e) =>
              setRegistCheck({ ...registCheck, mobile: e.target.value })
            }
            placeholder={t("placeholder")}
            maxLength={10}
            className="box-green w-full shadow-none"
          />

          <button
            onClick={MobileCheck}
            className={`w-full px-4 py-2 rounded-lg transition duration-200 btn-green disabled:btn-gray cursor-pointer`}>
            {t("button_check")}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            type="radio"
            id="not-registered"
            name="registerStatus"
            checked={registed == "notregist"}
            onChange={() => setRegisted("notregist")}
            className="w-4 h-4 accent-green-500"
          />
          <label htmlFor="not-registered">{t("radio_not_registered")}</label>
        </div>

        <button
          type="button"
          onClick={() => nav("/redeem/form")}
          className={`mt-3 w-full px-4 py-2 rounded-lg border transition btn-green ${
            (registed != "notregist" || registed == "") && "hidden"
          }`}>
          {t("button_registered")}
        </button>
      </div>
    </section>
  );
}