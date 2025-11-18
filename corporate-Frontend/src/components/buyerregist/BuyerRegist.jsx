import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Axios from "axios";
// import useHeader from "../hook/useHeader";

export default function BuyerRegist() {
  const { t, i18n } = useTranslation("landing", {
    keyPrefix: "redeem.buyerregist",
  });
  

  const [registerStatus, setRegisterStatus] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_brt;
  //const urlCheck = process.env.REACT_APP_API_URI + process.env.REACT_APP_frontdesk;
  
  // ================================
  // 🔍 ฟังก์ชันเช็คเบอร์โทร
  // ================================
  const MobileCheck = async () => {
    if (registerStatus !== "registered") return;

    try {
      const res = await Axios.post(url + "/MobileCheck", {
        mobile: phone,
        code: ""
      });

      // เช็ค status HTTP
      if (res.status === 200) {
        //console.log("เจอเบอร์:", res.data);
        Swal.fire({
          icon: "success",
          title: "พบข้อมูล",
          text: "คุณลงทะเบียนงานแล้ว",
          confirmButtonText: "ตกลง",
          customClass: {
            confirmButton: "swal2-red-btn",
          },
                  
        }).then(() => navigate("/Qrcode"));

      } else if (res.status === 404) {
       // console.log("เบอร์ไม่ถูก");
        Swal.fire({
          icon: "error",
          title: "ไม่พบข้อมูล",
          text: "กรุณาตรวจสอบเบอร์โทรอีกครั้ง",
          confirmButtonText: "ตกลง",
          customClass: {
            confirmButton: "swal2-red-btn",
          },
              
        });

      } else {//status === 400 error
        //console.log("เกิดข้อผิดพลาดอื่นๆ");
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถตรวจสอบข้อมูลได้",
          confirmButtonText: "ตกลง",
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
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถตรวจสอบข้อมูลได้",
        confirmButtonText: "ตกลง",
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
    <section className="exregsit container mx-auto py-4 px-2 lg:py-10 relative">

      {/* ===========================
          🌐 ปุ่มเปลี่ยนภาษา (มุมขวาบน)
      ============================ */}
      <div className="absolute right-4 top-4 flex gap-2">
        <button
          onClick={() => i18n.changeLanguage("th")}
          className={`px-3 py-1 rounded border ${
            i18n.language === "th"
              ? "bg-red-500 text-white border-red-500"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        >
          TH
        </button>

        <button
          onClick={() => i18n.changeLanguage("en")}
          className={`px-3 py-1 rounded border ${
            i18n.language === "en"
              ? "bg-red-500 text-white border-red-500"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        >
          EN
        </button>
      </div>

      {/* ===========================
          โลโก้
      ============================ */}
      <div className="size-20">
        <img
          src={require("../img/logo-wf-sq.png")}
          alt="wf-logo"
          className="w-full object-contain"
        />
      </div>

      <h1 className="text-2xl mt-4">{t("header")}</h1>

      <div className="mt-4 md:w-2/3 xl:w-1/2">

        {/* ===========================
            ✔ radio: ลงทะเบียนแล้ว
        ============================ */}
        <label htmlFor="registered" className="flex items-center gap-2 mt-2">
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

        {/* ช่องกรอกเบอร์ */}
        {registerStatus === "registered" && (
          <div className="mt-2 md:w-2/3 xl:w-1/2">
            <label htmlFor="phone" className="block mb-1">
              {t("label_register")}
            </label>

            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}               
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("placeholder")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              maxLength={10}
            />

            <button
              type="button"
              onClick={MobileCheck}
              disabled={phone.length < 10}
              className={`mt-3 px-4 py-2 rounded-lg w-full ${
                phone.length >= 10
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {t("button_check")}
            </button>
          </div>
        )}

        {/* ===========================
            ✔ radio: ยังไม่ลงทะเบียน
        ============================ */}
        <label htmlFor="not-registered" className="flex items-center gap-2 mt-4">
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

        <button
          type="button"
          onClick={() => navigate("/FormRegister")}
          disabled={registerStatus !== "not-registered"}
          className={`px-2 py-2 max-md:w-full border rounded-lg mt-2 w-full ${
            registerStatus === "not-registered"
              ? "border-red-500 bg-red-500 text-white"
              : "border-zinc-300 bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {t("button_registered")}
        </button>
      </div>
    </section>
  );
}
