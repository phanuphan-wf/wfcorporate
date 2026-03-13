import React from "react";
import { useTranslation } from "react-i18next";

import { IoIosArrowForward } from "react-icons/io";

export default function ClickRegist(props) {
  const { t, i18n } = useTranslation("landing", { keyPrefix: "landing2" });
  const { cp, exId } = props;

  return (
    <div
      className={`flex justify-center items-center gap-2 sm:gap-8 md:gap-2 rounded-full px-3 py-2 w-fit max-w-[800px] relative z-20 bg-gradient-to-t from-[#e99e35] to-[#f3d743] hover:from-yellow-100 hover:via-yellow-200 hover:to-yellow-100 border-[3px] border-[#f4a61d]`}>
      <div className="text-3xl md:text-5xl lg:text-6xl bg-[#293c8d] rounded-full text-white flex justify-center items-center h-fit w-fit p-1">
        <IoIosArrowForward />
      </div>
      <div className="text-center text-lg md:text-start md:text-3xl lg:text-4xl text-[#293c8d]">
        <a
          href={
            "/" + exId + "/preregistration" + (cp != undefined ? "/" + cp : "")
          }>
          {t("regist")}{" "}
          {i18n.language === "th" ? (
            <>
              <span className="text-[#293c8d]">{t("gift")}</span>{" "}
              <span className="text-xl md:text-5xl lg:text-6xl text-[#293c8d]">
                {String(t("free"))}
              </span>
            </>
          ) : (
            <>
              <span className="text-xl md:text-3xl lg:text-5xl text-[#293c8d]">
                {String(t("free"))}
              </span>{" "}
              <span className="text-[#293c8d]">{t("gift")}</span>
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
