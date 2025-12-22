import React from "react";
import { useTranslation } from "react-i18next";

import { IoIosArrowForward } from "react-icons/io";

export default function ClickRegist(props) {
  const { t, i18n } = useTranslation("landing", { keyPrefix: "landing" });
  const { cp, exId } = props;

  return (
    <div
      className={`flex justify-center gap-2 sm:gap-8 md:gap-2 rounded-full 
         text-black px-4 py-3 w-fit max-w-[800px] relative z-20 bg-gradient-to-r from-[#2e3192] via-[#2e3192] to-[#2e3192]
         hover:from-[#43469d] hover:via-[#43469d] hover:to-[#43469d]
         border-[3px] border-[#43469d]`}
         >
      <div className="text-3xl md:text-5xl lg:text-6xl bg-white/30 rounded-full text-white">
        <IoIosArrowForward />
      </div>
      <div className="text-center md:text-start text-lg md:text-3xl lg:text-4xl text-white">
        <a
          href={
            "/" + exId + "/preregistration" + (cp != undefined ? "/" + cp : "")
          }>
          {t("regist")}{" "}
          {i18n.language === "th" ? (
            <>
              <span className="text-yellow-500">{t("gift")}</span>{" "}
              <span className="text-xl md:text-5xl lg:text-6xl text-yellow-500">
                {String(t("free"))}
              </span>
            </>
          ) : (
            <>
              <span className="text-xl md:text-5xl lg:text-6xl text-yellow-500">
                {String(t("free"))}
              </span>{" "}
              <span className="text-yellow-500">{t("gift")}</span>
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
