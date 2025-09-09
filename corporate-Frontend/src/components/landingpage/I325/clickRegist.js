import React from "react";
import { useTranslation } from "react-i18next";

import { TbHandClick } from "react-icons/tb";

export default function ClickRegist(props) {
  const { t, i18n } = useTranslation("landing", { keyPrefix: "landing" });
  const { cp, exId } = props;

  return (
    <div
      className={`flex justify-center gap-2 sm:gap-8 md:gap-2 rounded-full  text-white py-3 md:w-3/4 max-w-[800px] relative z-20 bg-gradient-to-r from-[#0C6D0F] via-[#3EA11B] to-[#0C6D0F] hover:bg-pink-600`}>
      <div className="text-center md:text-start text-lg md:text-3xl lg:text-4xl">
        <a
          href={
            "/" + exId + "/preregistration" + (cp != undefined ? "/" + cp : "")
          }>
          {t("regist")}{" "}
          {i18n.language === "th" ? (
            <>
              <span className="text-yellow-300">{t("gift")}</span>{" "}
              <span className="text-xl md:text-5xl lg:text-6xl text-yellow-300">
                {String(t("free"))}
              </span>
            </>
          ) : (
            <>
              <span className="text-xl md:text-5xl lg:text-6xl text-yellow-300">
                {String(t("free"))}
              </span>{" "}
              <span className="text-yellow-300">{t("gift")}</span>
            </>
          )}{" "}
          <font className="text-xl md:text-4xl lg:text-5xl underline">
            Click
          </font>
        </a>
      </div>
      <div className="text-3xl md:text-5xl lg:text-6xl -rotate-[30deg]">
        <TbHandClick />
      </div>
    </div>
  );
}
