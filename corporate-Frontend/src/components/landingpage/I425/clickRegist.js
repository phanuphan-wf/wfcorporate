import React from "react";
import { useTranslation } from "react-i18next";

import { IoIosArrowForward } from "react-icons/io";

export default function ClickRegist(props) {
  const { t, i18n } = useTranslation("landing", { keyPrefix: "landing" });
  const { cp, exId } = props;

  return (
    <div
      className={`flex justify-center gap-2 sm:gap-8 md:gap-2 rounded-full  text-black px-4 py-3 w-fit max-w-[800px] relative z-20 bg-gradient-to-b from-[#FFE42C] to-[#FFB230] hover:from-yellow-500 hover:to-yellow-600 border-[5px] border-[#F58A17]`}>
      <div className="text-3xl md:text-5xl lg:text-6xl bg-white/30 rounded-full">
        <IoIosArrowForward />
      </div>
      <div className="text-center md:text-start text-lg md:text-3xl lg:text-4xl">
        <a
          href={
            "/" + exId + "/preregistration" + (cp != undefined ? "/" + cp : "")
          }>
          {t("regist")}{" "}
          {i18n.language === "th" ? (
            <>
              <span className="text-red-500">{t("gift")}</span>{" "}
              <span className="text-xl md:text-5xl lg:text-6xl text-red-500">
                {String(t("free"))}
              </span>
            </>
          ) : (
            <>
              <span className="text-xl md:text-5xl lg:text-6xl text-red-500">
                {String(t("free"))}
              </span>{" "}
              <span className="text-red-500">{t("gift")}</span>
            </>
          )}{" "}
          <font className="text-xl md:text-4xl lg:text-5xl underline">
            Click
          </font>
        </a>
      </div>
    </div>
  );
}
