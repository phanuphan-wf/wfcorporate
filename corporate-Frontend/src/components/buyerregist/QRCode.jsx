import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function Qrcode() {
  const { t, i18n } = useTranslation("redeem", {
    keyPrefix: "redeem.Qrcode",
  });

  const {qr} = useParams();  

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
      <div className="size-20 mb-4">
        <img
          src={require("../img/logo-wf-sq.png")}
          alt="wf-logo"
          className="w-full object-contain"
        />
      </div>

      {/* ===========================
          Header
      ============================ */}
      <h1 className="text-2xl font-semibold mb-6">
        {t("header")}
      </h1>

      {/* ===========================
          QR CODE BLOCK
      ============================ */}
      <div className="flex flex-col items-center mt-4">
        <div className="p-4 border rounded-xl shadow">
          <QRCodeCanvas
            value={qr}
            size={220}
            level={"H"}
            includeMargin={true}
          />
          <span>{qr}</span>
        </div>

        <p className="mt-4 text-gray-600 text-center">
          {t("details")}

        </p>
      </div>

    </section>
  );
}
