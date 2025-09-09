import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";

import SendPixel from "../sendPixel";

import Line from "../../img/line.svg";

import { MdLocationOn } from "react-icons/md";
import { MdAvTimer } from "react-icons/md";
import useCheckMobile from "../../hook/useCheckMobile";

export default function Postregister(props) {
  const { t, i18n } = useTranslation("landing", { keyPrefix: "regist.post" });
  const { t: tr } = useTranslation("landing", { keyPrefix: "regist" });
  const mobile = useCheckMobile();
  var CryptoJS = require("crypto-js");

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_reg;

  const [smsStatus, SetSms] = useState(true);

  const [cookies, setCookie, removeCookie] = useCookies([]);

  const params = useParams();

  async function getData() {
    var param = params.key
      .toString()
      .replaceAll("WFPLU", "+")
      .replaceAll("WFSLA", "/")
      .replaceAll("WFEQU", "=");
    const data = CryptoJS.AES.decrypt(param, process.env.REACT_APP_KEY);
    const key = JSON.parse(data.toString(CryptoJS.enc.Utf8));

    const res = await Axios.post(url + "/GetSMS", key);
    if (res.data.code === 0) {
      if (cookies.appWFCookieAccept === "true") {
        SendPixel({ mob: key.mob, preregist: key.preregist });
      }

      const resSMS = Axios.post(url + "/PostSMS", key).then((res) => {
        if (res.data.code === 0) {
          SetSms(true);

          //console.log(res.data);
        } else if (res.data.code === 505) {
          SetSms(false);
        }
      });
    } else if (res.data.code === 409) {
      alert(t("dupAlert"));
    }
  }

  useEffect(() => {
    document.title = "World Fair | Post Registration";
  }, []);

  const initText = { header: "", article: "" };
  const [text, setText] = useState(initText);

  useEffect(() => {
    if (params.res === "none") {
      setText({
        header: <h1>{t("none.h1")}</h1>,
        article: (
          <div>
            <h4>{t("none.h4")}</h4>
            <p>
              <strong>{t("none.pStrong")}</strong>
            </p>
          </div>
        ),
      });
    } else if (params.res === "success") {
      setText({
        header: <h1>{t("success.h1")}</h1>,
        article: (
          <div>
            <h4>{t("success.h4")}</h4>
            <p>
              <strong>{t("success.pStrong")}</strong>
            </p>
          </div>
        ),
      });
      getData();
    } else if (params.res === "expire") {
      setText({
        header: <h1>{t("expire.h1")}</h1>,
        article: (
          <div>
            <h4>{t("expire.h4")}</h4>
            <p>
              <strong>{t("expire.pStrong")}</strong>
            </p>
            <p>{t("expire.p")}</p>
          </div>
        ),
      });
    }
  }, [params.res]);

  useEffect(() => {
    if (!smsStatus) {
      setText({
        header: <h1>{t("sms.h1")}</h1>,
        article: (
          <div>
            <h4>{t("sms.h4")}</h4>
            <p>
              <strong>{t("sms.pStrong")}</strong>
            </p>
          </div>
        ),
      });
    }
  }, [smsStatus]);

  // const [csss, setCsss] = useState({});

  return (
    <div className="lg:container">
      <div className="w-full flex justify-center my-3">
        <img
          src={require("../../landingpage/B225/img/fur_logo.png")}
          alt="landing hero"
          id="hero_banner"
          className="mx-auto w-2/3 md:w-1/3"
        />
      </div>
      <div className="text-center text-xl md:text-xl lg:text-3xl font-medium mb-4">
        {tr("show")}
        {mobile ? <br /> : " | "}
        {tr("showdate")}
      </div>
      <div className="flex gap-4 lg:gap-10 w-full justify-center mb-4">
        <div className="bg-[#252525] text-white px-3 py-1 text-sm md:text-xl lg:text-2xl flex items-center gap-1 rounded-full">
          <MdLocationOn />
          {tr("hall")}
        </div>
        <div className="bg-[#252525] text-white px-3 py-1 text-sm md:text-xl lg:text-2xl flex items-center gap-1 rounded-full">
          <MdAvTimer />
          {tr("time")}
        </div>
      </div>
      <div className="text-center text-2xl md:text-4xl font-medium my-8">
        {text.header}
      </div>
      <div className="text-center text-lg">{text.article}</div>

      <div
        onClick={() => {
          window.open("https://lin.ee/qUKFklQ", "_blank");
        }}>
        <div className="flex gap-4 items-center rounded-lg bg-green-500 w-fit px-5 py-2 mx-auto my-6 cursor-pointer">
          <div className="w-8 h-8">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M30.226 23.3468C32.2735 21.1057 33.5 18.2842 33.5 15.2208C33.4949 7.91712 26.5569 2 17.9974 2C9.43792 2 2.5 7.91712 2.5 15.2208C2.5 21.0573 6.9337 26.0124 13.0865 27.7645C13.4457 27.9633 13.9229 28.0869 14.5439 28.1138C14.9801 28.1998 15.4214 28.2643 15.8678 28.318C18.7466 29.237 15.0211 32.8002 17.1199 32.9937C19.619 33.2248 26.3363 27.0819 29.056 24.4807C29.4666 24.1207 29.8566 23.7445 30.2209 23.3468H30.226Z"
                fill="white"
              />
              <path
                d="M9.30772 17.2713V12.0268C9.30772 11.7743 9.11269 11.5701 8.87147 11.5701H8.02463C7.78341 11.5701 7.58838 11.7743 7.58838 12.0268V18.6953C7.58838 18.9478 7.78341 19.152 8.02463 19.152H12.0997C12.3409 19.152 12.536 18.9478 12.536 18.6953V17.8086C12.536 17.5561 12.3409 17.3519 12.0997 17.3519H9.3847C9.34365 17.3519 9.30772 17.3143 9.30772 17.2713Z"
                fill="#23C55E"
              />
              <path
                d="M28.6463 12.9134V12.0268C28.6463 11.7743 28.4513 11.5701 28.2101 11.5701H24.135C23.8938 11.5701 23.6987 11.7743 23.6987 12.0268V18.6953C23.6987 18.9478 23.8938 19.152 24.135 19.152H28.2101C28.4513 19.152 28.6463 18.9478 28.6463 18.6953V17.8086C28.6463 17.5561 28.4513 17.3519 28.2101 17.3519H25.4951C25.454 17.3519 25.4181 17.3143 25.4181 17.2713V16.3417C25.4181 16.2987 25.454 16.2611 25.4951 16.2611H28.2101C28.4513 16.2611 28.6463 16.0569 28.6463 15.8043V14.9177C28.6463 14.6652 28.4513 14.461 28.2101 14.461H25.4951C25.454 14.461 25.4181 14.4234 25.4181 14.3804V13.4508C25.4181 13.4078 25.454 13.3702 25.4951 13.3702H28.2101C28.4513 13.3702 28.6463 13.166 28.6463 12.9134Z"
                fill="#23C55E"
              />
              <path
                d="M14.7225 11.5701H13.8757C13.6348 11.5701 13.4395 11.7746 13.4395 12.0268V18.7006C13.4395 18.9529 13.6348 19.1574 13.8757 19.1574H14.7225C14.9635 19.1574 15.1588 18.9529 15.1588 18.7006V12.0268C15.1588 11.7746 14.9635 11.5701 14.7225 11.5701Z"
                fill="#23C55E"
              />
              <path
                d="M20.8814 12.0268V15.9978L18.1048 11.8495C17.9867 11.6775 17.7968 11.5701 17.5967 11.5701H16.6369C16.3957 11.5701 16.2007 11.7743 16.2007 12.0268V18.6953C16.2007 18.9478 16.3957 19.152 16.6369 19.152H17.4838C17.725 19.152 17.92 18.9478 17.92 18.6953V14.7243L20.6966 18.8726C20.8147 19.0445 21.0046 19.152 21.2047 19.152H22.1645C22.4057 19.152 22.6007 18.9478 22.6007 18.6953V12.0268C22.6007 11.7743 22.4057 11.5701 22.1645 11.5701H21.3176C21.0764 11.5701 20.8814 11.7743 20.8814 12.0268Z"
                fill="#23C55E"
              />
            </svg>
          </div>
          <div className="text-white">
            {t("addfriend")}
            <br />
            {t("receive")}
          </div>
        </div>
      </div>
    </div>
  );
}
