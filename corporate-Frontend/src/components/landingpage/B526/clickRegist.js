import React from "react";
import { useTranslation } from "react-i18next";

export default function ClickRegist(props) {
  const { t, i18n } = useTranslation("landing", { keyPrefix: "landing2" });
  const { cp, exId } = props;

  const href =
    "/" + exId + "/preregistration" + (cp !== undefined ? "/" + cp : "");

  return (
    <a
      href={href}
      className="relative z-20 inline-block w-fit max-w-[800px] rounded-md bg-[#1f2a8a] px-7 py-2.5 text-center text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700">
      {t("regist")}{""}
      {i18n.language === "th" ? (
        <>
          {t("gift")}{" "}{String(t("free"))}
        </>
      ) : (
        <>
          {String(t("free"))}{" "}{t("gift")}
        </>
      )}
    </a>
  );
}