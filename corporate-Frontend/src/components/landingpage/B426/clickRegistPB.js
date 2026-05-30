import React from "react";
import { useTranslation } from "react-i18next";

import { IoIosArrowForward } from "react-icons/io";

export default function ClickRegist(props) {
  const { t, i18n } = useTranslation("landing", { keyPrefix: "landing" });
  const { cp, exId } = props;

  return (
    <div
      className={`flex justify-center items-center gap-2 sm:gap-8 md:gap-2 rounded-full px-3 py-2 w-fit max-w-[800px]
                  relative z-20 bg-gradient-to-t from-[#4a1e6c] via-[#4a1e6c] to-[#4a1e6c]
                  hover:from-purple-600 hover:to-purple-400 
                  border-[3px] border-[#4a1e6c]                
      `}
    >

      <div className="text-3xl md:text-5xl lg:text-6xl bg-[#f47920] rounded-full text-[#4a1e6c] flex justify-center items-center h-fit w-fit p-1">
        <IoIosArrowForward />
      </div>
      <div className="text-center text-lg md:text-start md:text-3xl lg:text-4xl text-white">
        <a
          href={
            "/" + exId + "/preregistration" + (cp != undefined ? "/" + cp : "")
          }>
          {t("regist")}{" "}
          {i18n.language === "th" ? (
            <>
              <span className="text-white">{t("gift")}</span>{" "}
              <span className="text-xl md:text-5xl lg:text-6xl text-white">
                {String(t("free"))}
              </span>
            </>
          ) : (
            <>
              <span className="text-xl md:text-3xl lg:text-5xl text-white">
                {String(t("free"))}
              </span>{" "}
              <span className="text-white">{t("gift")}</span>
            </>
          )}
          {/*
          <font className="text-xl md:text-4xl lg:text-5xl underline">
            Click
          </font>*/}
        </a>
      </div>
    </div>
  );
}
