import React from "react";
import { useTranslation } from "react-i18next";
import useCheckMobile from "../../hook/useCheckMobile";
import { MdLocationOn } from "react-icons/md";
import { MdAvTimer } from "react-icons/md";

export default function FurSection() {
  const { t } = useTranslation("landing", { keyPrefix: "landing2" });
  const mobile = useCheckMobile();
  return (
    <section id="fur-section">
      <div className="w-3/5 md:w-1/2 mx-auto mt-7 relative z-[900] mix-blend-multiply">
        <img
          src={require("./img/fur_logo.png")}
          alt="furniture logo"
          id="fur_logo"
          className="w-full mx-auto max-w-[540px]"
        />
      </div>
      <div className="text-center text-2xl md:text-4xl lg:text-5xl font-medium my-4">
        {t("showdate")}
      </div>
      <div className="flex gap-4 lg:gap-10 w-full justify-center mb-4">
        <div className="bg-[#0C19A4] text-white px-4 py-2 text-sm md:text-2xl lg:text-3xl flex items-center gap-1 rounded-xl">
          <MdLocationOn />
          {t("hall")}
        </div>
        <div className="bg-[#0C19A4] text-white px-4 py-1 text-sm md:text-2xl lg:text-3xl flex items-center gap-1 rounded-xl">
          <MdAvTimer />
          {t("time")}
        </div>
      </div>

      <div className="fur-text container max-w-[700px] md:text-xl lg:text-2xl">
        <ul className="list-disc px-14 my-4">
          {t("fur", { returnObjects: true }).map((f, i) => (
            <li key={`fur-${i}`}>{f}</li>
          ))}
        </ul>
      </div>

      <div className="xl:container bg-gradient-to-r to-[#F25A29] from-[#F25A29] py-6">
        <div className="relative mx-5 lg:mx-0 ">
          <div className="grid grid-cols-2 md:grid-cols-3 w-full sm:w-3/4 lg:w-[800px] gap-4 md:gap-7 place-items-center mx-auto">
            <img
              src={require("./img/fur_img5.png")}
              alt="fur-img"
              className="rounded-lg object-cover aspect-square"
            />

            <img
              src={require("./img/fur_img1.png")}
              alt="fur-img"
              className="rounded-lg object-cover aspect-square"
            />
            <img
              src={require("./img/fur_img2.png")}
              alt="fur-img"
              className="rounded-lg object-cover aspect-square"
            />
            <img
              src={require("./img/fur_img3.png")}
              alt="fur-img"
              className="rounded-lg object-cover aspect-square"
            />
            <img
              src={require("./img/fur_img4.png")}
              alt="fur-img"
              className="rounded-lg object-cover aspect-square"
            />
            <img
              src={require("./img/fur_img6.png")}
              alt="fur-img"
              className="rounded-lg object-cover aspect-square"
            />
          </div>
        </div>
      </div>

      {/*----------------- งาน B225 ไม่ได้ใช้ -----------------*/}
      {/*
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3 md:container px-10 sm:max-md:px-20 mb-5 lg:w-[800px]">
        {[1, 2, 3, 4].map((i) => (
          <img src={require("./img/fur_pic" + i + ".png")} alt="fur-img" />
        ))}
      </div>
*/}

      <div className="xl:container w-full bg-[#0C19A4] flex items-center justify-evenly py-4 mb-4">
        <div className="w-[40%] sm:w-1/3 lg:w-1/4">
          <img
            src={require("./img/fur_logo_white.png")}
            alt="furniture logo white"
            id="fur_banner"
            className="mx-auto"
          />
        </div>
        <div className="text-white">
          <div className="flex gap-0.5 items-center md:text-xl lg:text-2xl">
            <MdLocationOn className="drop-shadow-md" />
            <span className="drop-shadow-md">{t("hall")}</span>
          </div>
          <div className="flex gap-0.5 items-center md:text-xl lg:text-2xl">
            <MdAvTimer className="drop-shadow-md" />
            <span className="drop-shadow-md">{t("time")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
