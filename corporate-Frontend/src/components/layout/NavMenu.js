import React, { useState, useEffect } from "react";
import tel from "../img/tel.svg";
import { useTranslation } from "react-i18next";

export default function NavMenu(props) {
  const { t, i18n } = useTranslation("common", { keyPrefix: "menu" });
  const [click, setClick] = useState(false);

  const menuClick = () => {
    setClick(!click);
  };

  const [width, setWidth] = useState(0);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  });

  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (width < 768) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [width]);

  const changLng = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  return (
    <section className="NavMenu">
      <div className="bg-white shadow-md shadow-gray-300 relative z-[999]">
        <div className="container px-5 md:px-20 lg:px-32 py-5 md:py-8 flex justify-between items-center">
          <div className="md:flex gap-2 hidden">
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
          <div className="md:hidden" onClick={menuClick}>
            <div
              className={`border border-black w-6 h-0 bg-black mb-1 transition duration-300 ${
                click && "rotate-45 translate-y-1.5"
              }`}></div>
            <div
              className={`border border-black w-6 h-0 bg-black mb-1 transition duration-300 ${
                click && "opacity-0"
              }`}></div>
            <div
              className={`border border-black w-6 h-0 bg-black transition duration-300 ${
                click && "-rotate-45 -translate-y-1.5"
              }`}></div>
          </div>
          <div>
            <img
              src={require("../img/logo-wf.png")}
              alt="logo wf"
              id="logowf"
              className="w-2/5 sm:w-3/4 md:w-full block ml-auto"
            />
          </div>
          <div className="hidden sm:flex flex-col gap-2 items-center ">
            <div className="flex gap-1">
              <img src={tel} alt="tel" id="tel" />
              <div>02-731-1331</div>
            </div>
            <div className="bg-gradient-to-b from-[#FF0000] to-[#640000] p-[2px] cursor-pointer ">
              <div className="text-white bg-transparent hover:bg-white hover:text-[#990101] py-1 px-5">
                <a href="/reservation">{t("reserve")}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`w-2/3 sm:w-1/2 md:w-full h-screen md:h-fit md:container py-5 md:px-16 lg:px-40 md:py-4 absolute md:relative z-[998] bg-white trasition duration-300 md:transition-none md:translate-x-0 ${
          click ? "translate-x-0" : "translate-x-[-105%]"
        }`}>
        <ul className="flex flex-col px-5 md:flex-row md:justify-between [&>li:not(:last-child)]:border-[#ff0000] [&>li:not(:last-child)]:border-b md:[&>li:not(:last-child)]:border-b-0 md:[&>li:not(:last-child)]:border-r-2">
          <li className="flex-auto pt-3 md:pt-0 md:text-center hover:text-[#ff0000] cursor-pointer">
            <a href="/">{t("home")}</a>
          </li>
          <li className="flex-auto pt-8 md:pt-0 md:text-center hover:text-[#ff0000] cursor-pointer">
            <a href="/aboutus">{t("about")}</a>
          </li>
          <li className="flex-auto pt-8 md:pt-0 md:text-center hover:text-[#ff0000] cursor-pointer">
            <a href="/ourservices">{t("service")}</a>
          </li>
          <li className="flex-auto pt-8 md:pt-0 md:text-center hover:text-[#ff0000] cursor-pointer">
            <a href="/calendar">{t("calendar")}</a>
          </li>
          <li className="flex-auto pt-8 md:pt-0 md:text-center hover:text-[#ff0000] cursor-pointer">
            <a href="/news">{t("news")}</a>
          </li>
          <li className="flex-auto pt-8 md:pt-0 md:text-center hover:text-[#ff0000] cursor-pointer">
            <a href="/joinus">{t("apply")}</a>
          </li>
          {mobile && (
            <li className="flex-auto pt-8 md:pt-0 md:text-center hover:text-[#ff0000] cursor-pointer">
              <a href="/reservation">{t("reserve")}</a>
            </li>
          )}
        </ul>
        {mobile && (
          <div className="px-5 mt-10">
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
      </div>
    </section>
  );
}
