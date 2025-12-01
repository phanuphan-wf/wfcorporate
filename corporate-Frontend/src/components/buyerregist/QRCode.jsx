import { QRCodeCanvas } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function Qrcode() {
  const { t, i18n } = useTranslation("redeem", {
    keyPrefix: "redeem.Qrcode",
  });

  const { qr } = useParams();

  const condition = t("condition", { returnObjects: true });

  return (
    <section className="exregsit w-full py-4 lg:py-10 text-center container px-4 max-w-[1024px]">
      <div className="size-20 mb-4 mx-auto">
        <img
          src={require("../img/logo-wf-sq.png")}
          alt="wf-logo"
          className="w-full object-contain"
        />
      </div>
      {/* ขอบคุณสำหรับการลงทะเบียน */}
      <h1 className="text-2xl font-semibold mb-3">{t("header")}</h1>
      {/* โปรดนำ QR Code แสดงแก่เจ้าหน้าที่เพื่อรับของสมนาคุณ */}
      <p className="mb-6">{t("details")}</p>
      <div className="p-4 border rounded-xl shadow w-fit mx-auto">
        <QRCodeCanvas value={qr} size={220} level={"H"} includeMargin={true} />
        <span>{qr}</span>
      </div>
      {/* condition.map */}
      {/* QR Code นี้ สามารถใช้ซ้ำได้ตลอดการจัดแสดงงาน โดยท่านสามารถบันทึกภาพหน้าจอนี้ไว้ได้*/}
      {/* สิทธิในการแลกของสมนาคุณ สามารถแลกได้ 1สิทธิ์ / 1คน / 1วััน เท่านั้น ไม่สามารถแลกซ้ำได้ในวันเดียวกัน */}
      {/* ผู้จัดงานขอสงวนสิทธิในการแลกของสมนาคุณ ตามเงื่อนไขของบริษัทเท่านั้น และขอสงวนสิทธิในการเปลี่ยนแปลงเงื่อนไขโดยไม่ต้องแจ้งให้ทราบล่วงหน้า */}

      {/* รายการเงื่อนไข */}
      <ul className="conditions-list text-left text-xm list-disc list-inside mx-auto my-6">
        {condition.map((c) => (
          <li className="mt-4">{c}</li>
        ))}
      </ul>
    </section>
  );
}
