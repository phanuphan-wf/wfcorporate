import React from "react";
import { useTranslation } from "react-i18next";

import fb from "../img/fb.svg";
import ig from "../img/ig.svg";
import line from "../img/line.svg";
import yt from "../img/yt.svg";
import tt from "../img/tt.svg";

export default function Footer(props) {
  const { t, i18n } = useTranslation("landing", { keyPrefix: "landing" });
  const { t: tc } = useTranslation("common", { keyPrefix: "footer" });
  const { t: tm } = useTranslation("common", { keyPrefix: "menu" });

  const changLng = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };
  return (
    <section className="footer">
      <div className="bg-white shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1)] shadow-gray-300 relative z-[998]">
        <div className="container px-2 sm:px-12 lg:px-28 pt-5 pb-2 flex flex-col items-center sm:flex-row sm:justify-between sm:items-center">
          <div>
            <img
              src={require("../img/logo-wf.png")}
              alt="logo wf"
              id="logowf"
              className="w-1/3 block mx-auto sm:w-3/4 sm:ml-0 "
            />
          </div>
          <div className="w-full text-center sm:text-start sm:w-1/2 md:w-[40%] lg:w-1/2">
            <div className="text-2xl font-semibold">{tc("company")}</div>
            <div className="text-sm mb-0 sm:mb-4">{tc("addr")}</div>
            <div className="font-semibold">
              <a href="tel:027311331">{tc("tel")}</a>
            </div>
            <div className="font-semibold">
              <a href="mailto:operation@worldfair.co.th">{tc("email")}</a>
            </div>
          </div>
          <div className="hidden md:block md:ml-auto">
            <ul className="list-disc">
              <li className="hover:text-[#ff0000]">
                <a href="/">{tm("home")}</a>
              </li>
              <li className="hover:text-[#ff0000]">
                <a href="/aboutus">{tm("about")}</a>
              </li>
              <li className="hover:text-[#ff0000]">
                <a href="/ourservices">{tm("service")}</a>
              </li>
              <li className="hover:text-[#ff0000]">
                <a href="/calendar">{tm("calendar")}</a>
              </li>
              <li className="hover:text-[#ff0000]">
                <a href="/news">{tm("news")}</a>
              </li>
              <li className="hover:text-[#ff0000]">
                <a href="/joinus">{tm("apply")}</a>
              </li>
            </ul>
          </div>
        </div>
        {props.show == 1 && (
          <div className="container px-2 sm:px-12 lg:px-28 pt-5 pb-2 flex justify-end">
            <div className="mr-2">{t("lng")}</div>
            <div className="flex gap-2">
              <div
                className={`${
                  i18n.language == "en"
                    ? "text-slate-500"
                    : "font-bold text-red-500"
                } cursor-pointer`}
                onClick={() => changLng("en")}>
                EN
              </div>
              <div>|</div>
              <div
                className={`${
                  i18n.language == "th"
                    ? "text-slate-500"
                    : "font-bold text-red-500"
                } cursor-pointer`}
                onClick={() => changLng("th")}>
                TH
              </div>
            </div>
          </div>
        )}
        <div className="px-5 md:px-20 lg:px-28 pt-6 pb-2 flex flex-col sm:flex-row sm:justify-between items-center border-t">
          <div className="order-last text-xs mt-4 sm:mt-0 sm:text-base sm:order-none ">
            {tc("copyright")}
          </div>
          <div className="flex gap-3 items-center">
            <div className="hidden sm:block">{tc("follow")}</div>
            <div>
              <img
                className="w-full sm:w-3/4 md:w-full"
                src={fb}
                alt="fb"
                id="fblogo"
              />
            </div>
            <div>
              <img
                className="w-full sm:w-3/4 md:w-full"
                src={ig}
                alt="ig"
                id="iglogo"
              />
            </div>
            <div>
              <img
                className="w-full sm:w-3/4 md:w-full"
                src={line}
                alt="line"
                id="linelogo"
              />
            </div>
            <div>
              <img
                className="w-full sm:w-3/4 md:w-full"
                src={yt}
                alt="youtube"
                id="youtubelogo"
              />
            </div>
            <div>
              <img
                className="w-full sm:w-3/4 md:w-full"
                src={tt}
                alt="tiktok"
                id="tiktoklogo"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
