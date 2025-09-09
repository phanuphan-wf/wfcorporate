import React from "react";
import { useTranslation } from "react-i18next";

import { MdLocationOn } from "react-icons/md";
import { MdAvTimer } from "react-icons/md";

export default function ElecSection() {
  const { t } = useTranslation("landing", { keyPrefix: "landing" });
  return (
    <section id="elec-section">
      <div className="mx-5 md:mx-0">
        <img
          src={require("./img/elec_banner.png")}
          alt="elec banner"
          id="elec_banner"
          className="mx-auto rounded-lg md:rounded-3xl w-[90%] md:w-[80%] lg:w-[60%] xl:w-[50%] max-w-[810px] object-contain"
        />
      </div>
      <div className="relative mx-5 lg:mx-0">
        <div className="grid grid-cols-2 md:grid-cols-4 w-full sm:w-3/4 md:w-full lg:w-[800px] gap-7 place-items-center mx-auto mt-6">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src={require("./img/elec_img1.png")}
              alt="elec-img"
              className="object-cover aspect-square"
            />
          </div>
          <img
            src={require("./img/elec_img2.png")}
            alt="elec-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/elec_img3.png")}
            alt="elec-img"
            className="rounded-lg"
          />
          <img
            src={require("./img/elec_img4.png")}
            alt="elec-img"
            className="rounded-lg"
          />
        </div>
        <div className="w-fit mx-auto mt-7 relative z-[900] mix-blend-multiply">
          <img
            src={require("./img/elec_logo.png")}
            alt="electronic logo"
            id="elec_logo"
            className="w-full mx-auto max-w-[540px]"
          />
        </div>
      </div>
      <div className="elec-text container max-w-[700px] md:text-xl lg:text-2xl">
        <ul className="list-disc px-14 my-4">
          {t("elec", { returnObjects: true }).map((d, i) => (
            <li key={`elec-${i}`}>{d}</li>
          ))}
        </ul>
      </div>
      <div className="xl:container w-full bg-[#7419A5] flex items-center justify-evenly mb-4 py-1">
        <div className="w-1/3 md:w-1/4 lg:w-1/5">
          <img
            src={require("./img/elec_logo.png")}
            alt="elec_logo"
            id="elec_banner"
            className="mx-auto max-h-[120px]"
          />
        </div>
        <div>
          <div className="flex gap-0.5 items-center md:text-xl lg:text-2xl">
            <MdLocationOn className="text-white drop-shadow-md" />
            <span className="text-white drop-shadow-md">{t("hall")}</span>
          </div>
          <div className="flex gap-0.5 items-center md:text-xl lg:text-2xl">
            <MdAvTimer className="text-white drop-shadow-md" />
            <span className="text-white drop-shadow-md">{t("time")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
