import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export default function FormRegister() {
  const { t, i18n } = useTranslation("redeem", {
    keyPrefix: "redeem.FormRegister",
  });

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    mobile: "",
  });

  // Debug log
  useEffect(() => {
    console.log("ค่าฟอร์มปัจจุบัน:", formData);
  }, [formData]);

  // handle input update
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async () => {
    const { mobile } = formData;

    // เบอร์อย่างน้อย 10 หลัก
    if (mobile.length < 10) {
      Swal.fire({
        icon: "warning",
        title: t("alert_warning_title"),
        text: t("alert_warning_text"),
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal2-red-btn",
        },
      });
      return;
    }

    // ส่งข้อมูลจริง (เปิดเมื่อมี API)
    // await Axios.post(...)

    Swal.fire({
      icon: "success",
      title: t("alert_success_title"),
      text: t("alert_success_text"),
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "swal2-red-btn",
      },
    });
  };

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

      {/* Logo */}
      <div className="size-20">
        <img
          src={require("../img/logo-wf-sq.png")}
          alt="wf-logo"
          className="w-full object-contain"
        />
      </div>

      {/* Header */}
      <h1 className="text-2xl mt-4">{t("header")}</h1>

      <div className="mt-4 md:w-2/3 xl:w-1/2">
        {/* ชื่อ */}
        <label className="block mt-2">{t("name")}</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border mt-2 px-3 py-2 rounded-lg"
        />

        {/* นามสกุล */}
        <label className="block mt-2">{t("surname")}</label>
        <input
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          className="w-full border mt-2 px-3 py-2 rounded-lg"
        />

        {/* เบอร์มือถือ */}
        <label className="block mt-2">{t("phone")}</label>
        <input
          name="mobile"
          type="tel"
          maxLength={15}
          value={formData.mobile}
          onChange={handleChange}
          className="w-full border mt-2 px-3 py-2 rounded-lg"
        />
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end mt-5">
        <button
          onClick={handleSubmit}
          disabled={!formData.name || !formData.surname || !formData.mobile}
          className={`px-4 py-2 rounded-lg w-full mt-4 ${
            formData.name && formData.surname && formData.mobile
              ? "bg-red-500 text-white border border-red-500 hover:bg-red-600"
              : "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed"
          }`}
        >
          {t("btn_submit")}
        </button>
      </div>
    </section>
  );
}
