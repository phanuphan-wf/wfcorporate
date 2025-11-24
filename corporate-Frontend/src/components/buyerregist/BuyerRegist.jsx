import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import Qrcode from "./QRCode";
// import useHeader from "../hook/useHeader";

export default function BuyerRegist() {
  const { t, i18n } = useTranslation("redeem", {
    keyPrefix: "redeem.buyerregist",
  });
  

  const [registerStatus, setRegisterStatus] = useState(false);
  const [phone, setPhone] = useState("");
  const [visitor, setvisitor] = useState("");


  const navigate = useNavigate();
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
  
  const codeqr = generateRandomCode(); 
  

  // ================================
  // 🔍 ฟังก์ชันเช็คเบอร์โทร
  // ================================
  const MobileCheck = async () => {
    if (registerStatus !== "registered") return;

    try {
      const res = await Axios.post(url + "/MobileCheck", {
        mobile: phone,
        code: codeqr
      });
  
      
      console.log(res);
   
      // เช็ค status HTTP
      if (res.status === 200) {
        //console.log("เจอเบอร์:", res.data);
        Swal.fire({
          icon: "success",
          title: t("alert_success_title"),
          text: t("alert_success_text"),
          confirmButtonText: t("confirmButtonText"),
          customClass: {
            confirmButton: "swal2-red-btn",
          },
                  
        }).then(() => navigate("/redeem/"+ codeqr ));

      } else if (res.status === 404) {
       // console.log("เบอร์ไม่ถูก");
        Swal.fire({
          icon: "error",
          title: t("alert_error_title"),
          text:  t("alert_error_text"),
          confirmButtonText: t("confirmButtonText"),
          customClass: {
            confirmButton: "swal2-red-btn",
          },
              
        });

      } else if (res.status === 505) {
       // console.log("เบอร์ไม่ถูก");
        Swal.fire({
          icon: "error",
          title: t("alert_error_title"),
          text:  t("alert_error_text"),
          confirmButtonText: t("confirmButtonText"),
          customClass: {
            confirmButton: "swal2-red-btn",
          },
              
        }); 
      
      }else {//status === 400 error
        //console.log("เกิดข้อผิดพลาดอื่นๆ");
        Swal.fire({
          icon: "error",
          title: t("alert_error_title"),
          text:  t("alert_error_text"),
          confirmButtonText: t("confirmButtonText"),
          customClass: {
            confirmButton: "swal2-red-btn",
          },
              
        });
      }

    } catch (err) {
      // กรณี API ไม่ตอบกลับ หรือ network error
      //console.error("❌ API Error:", err);
      Swal.fire({
        icon: "error",
        title:  t("alert_error_title"),
        text:  t("alert_error_text"),
        confirmButtonText:t("confirmButtonText"),
        customClass: {
            confirmButton: "swal2-red-btn",
          },
      });
    }
  };


  
  

  useEffect(() => {
    console.log("สถานะการลงทะเบียน:", registerStatus);
  }, [registerStatus]);

  return (
    <section className="exregsit container mx-auto py-6 px-4 lg:py-10 relative text-center">

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
            }`}
          >
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
        <label className="flex items-center gap-2 mt-2 cursor-pointer">
          <input
            type="radio"
            id="registered"
            name="registerStatus"
            value="registered"
            checked={registerStatus === "registered"}
            onChange={(e) => setRegisterStatus(e.target.value)}
            className="w-4 h-4 accent-red-500"
          />
          <span>{t("radio_register")}</span>
        </label>

        {/* 🔥 กรอกเบอร์โทร (เฉพาะกรณีลงทะเบียนแล้ว) */}
        {registerStatus === "registered" && (
          <div className="mt-3 relative">
            <label htmlFor="phone" className="block mb-1 font-medium">
              {t("label_register")}
            </label>

            <div className="relative">
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("placeholder")}
                maxLength={10}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-400"
              />

              {/* ปุ่มเคลียร์ */}
              {phone.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPhone("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={MobileCheck}
              disabled={phone.length < 10}
              className={`mt-3 w-full px-4 py-2 rounded-lg transition ${
                phone.length >= 10
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {t("button_check")}
            </button>
          </div>
        )}

        {/* ▶ radio: ยังไม่ลงทะเบียน */}
        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input
            type="radio"
            id="not-registered"
            name="registerStatus"
            value="not-registered"
            checked={registerStatus === "not-registered"}
            onChange={(e) => setRegisterStatus(e.target.value)}
            className="w-4 h-4 accent-red-500"
          />
          <span>{t("radio_not_registered")}</span>
        </label>

        {/* ปุ่มไปลงทะเบียนใหม่ */}
        <button
          type="button"
          onClick={() => navigate("/redeem/form")}
          disabled={registerStatus !== "not-registered"}
          className={`mt-3 w-full px-4 py-2 rounded-lg border transition ${
            registerStatus === "not-registered"
              ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
              : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {t("button_registered")}
        </button>

      </div>
    </section>


  );
}
