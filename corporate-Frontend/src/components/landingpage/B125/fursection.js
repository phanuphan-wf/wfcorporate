import React from "react";
import { useTranslation } from "react-i18next";

import { MdLocationOn } from "react-icons/md";
import { MdAvTimer } from "react-icons/md";

export default function FurSection() {
  const { t } = useTranslation("landing", { keyPrefix: "landing" });
  return (
    <section id="fur-section">
      <div className="mx-5 lg:mx-0">
        <img
          src={require("./img/fur_banner.png")}
          alt="furniture banner"
          id="fur_banner"
          className="mx-auto rounded-lg md:rounded-3xl w-[90%] md:w-[80%] lg:w-[60%] xl:w-[50%] max-w-[810px] object-contain"
        />
      </div>

      <div className="relative mx-5 lg:mx-0">
        <div className="grid grid-cols-2 md:grid-cols-3 w-full sm:w-3/4 lg:w-[800px] gap-4 md:gap-7 place-items-center mx-auto mt-6">
          <img
            src={require("./img/fur_img1.png")}
            alt="fur-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/fur_img2.png")}
            alt="fur-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/fur_img3.png")}
            alt="fur-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/fur_img4.png")}
            alt="fur-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/fur_img5.png")}
            alt="fur-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/fur_img6.png")}
            alt="fur-img"
            className="rounded-lg"
          />
        </div>
        <div className="w-fit mx-auto mt-7 relative z-[900] mix-blend-multiply">
          <img
            src={require("./img/fur_logo.png")}
            alt="furniture logo"
            id="fur_logo"
            className="w-2/3 mx-auto max-w-[540px]"
          />
        </div>
      </div>
      <div className="fur-text container max-w-[700px] md:text-xl lg:text-2xl">
        <ul className="list-disc px-14 my-4">
          {t("fur", { returnObjects: true }).map((f, i) => (
            <li key={`fur-${i}`}>{f}</li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3 md:container px-10 sm:max-md:px-20 mb-5 lg:w-[800px]">
        {[1, 2, 3, 4].map((i) => (
          <img src={require("./img/fur_pic" + i + ".png")} alt="fur-img" />
        ))}
      </div>

      <div className="xl:container w-full bg-[#e7298e] flex items-center justify-evenly py-2 mb-4">
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
