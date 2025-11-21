import { useTranslation } from "react-i18next";

import { MdLocationOn } from "react-icons/md";
import { MdAvTimer } from "react-icons/md";

export default function ElecSection() {
  const { t } = useTranslation("landing", { keyPrefix: "landing" });
  return (
    <section id="elec-section">
      <div className="w-2/5 md:w-1/3 max-w-[350px] mx-auto mt-7 relative z-[900] mix-blend-multiply">
        <img
          src={require("./img/elec_logo.png")}
          alt="electronic logo"
          id="elec_logo"
          className="w-full mx-auto max-w-[480px]"
        />
      </div>
      {/*
      <div className="text-center text-2xl md:text-4xl lg:text-5xl font-medium my-4">
        {t("showdate")}
      </div>
      <div className="flex gap-4 lg:gap-10 w-full justify-center mb-4">
        <div className="bg-[#2E3192] text-white px-4 py-2 text-sm md:text-2xl lg:text-3xl flex items-center gap-1 rounded-xl">
          <MdLocationOn />
          {t("hall")}
        </div>
        <div className="bg-[#2E3192] text-white px-4 py-1 text-sm md:text-2xl lg:text-3xl flex items-center gap-1 rounded-xl">
          <MdAvTimer />
          {t("time")}
        </div>
      </div>
      */}

      <div className="elec-text container max-w-[700px] md:text-xl lg:text-2xl">
        <ul className="list-disc px-14 my-4">
          {t("elec", { returnObjects: true }).map((f, i) => (
            <li key={`elec-${i}`}>{f}</li>
          ))}
        </ul>
      </div>

      <div className="xl:container bg-[#4A1E6B] py-6">
        <div className="relative mx-5 lg:mx-0 ">
          <div className="grid grid-cols-2 md:grid-cols-2 w-full sm:w-3/4 lg:w-2/5 gap-4 md:gap-7 place-items-center mx-auto">
            <img
              src={require("./img/elec_img1.png")}
              alt="elec-img"
              className="rounded-lg object-cover aspect-square"
            />
            <img
              src={require("./img/elec_img2.png")}
              alt="elec-img"
              className="rounded-lg object-cover aspect-square"
            />
            <img
              src={require("./img/elec_img3.png")}
              alt="elec-img"
              className="rounded-lg object-cover aspect-square"
            />
            <img
              src={require("./img/elec_img4.png")}
              alt="elec-img"
              className="rounded-lg object-cover aspect-square"
            />
          </div>
        </div>
      </div>

      <div className="xl:container w-full bg-[#4A1E6B] flex items-center justify-evenly py-4 mb-4">
        <div className="w-[30%] sm:w-1/3 lg:w-1/5">
          <img
            src={require("./img/elec_logo_sm.png")}
            alt="elec logo white"
            id="elec_banner"
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
