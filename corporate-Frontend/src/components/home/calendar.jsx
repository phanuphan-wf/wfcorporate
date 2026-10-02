import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useTranslation } from "react-i18next";

export default function Calendar({ data }) {
  const { t } = useTranslation("common", { keyPrefix: "home" });
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;

  const [landing, setLanding] = useState("0");

  const getLandingOpen = async () => {
    try {
      const res = await Axios.get(url + "/landingOpen");
      setLanding(res.data.val);
    } catch (error) {
      console.error("Failed to fetch landing status:", error);
    }
  };

  useEffect(() => {
    getLandingOpen();
  }, []);

  return (
    <div
      id="btnregist"
      className="w-40 py-3 text-center border bg-white border-white text-[#AE0000] hover:bg-transparent hover:text-white cursor-pointer group"
    >
      {landing === "1" ? (
        <a href={"/" + (data?.exID || "") + "/preregistration"}>
          {t("regist")}
        </a>
      ) : (
        <a href="/calendar" className="block w-full h-full">       
          <span className="group-hover:hidden">{t("regist")}</span>       
          <span className="hidden group-hover:inline">{t("notopen")}</span>
        </a>
      )}
    </div>
  );
}