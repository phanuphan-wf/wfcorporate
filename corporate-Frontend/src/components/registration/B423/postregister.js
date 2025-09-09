import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCookies } from "react-cookie";

import SendPixel from "../sendPixel";

import Line from "../../img/line.svg";

export default function Postregister(props) {
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
      alert(
        "ขออภัยระบบได้ส่ง sms ให้กับท่านแล้ว หากท่านไม่ได้รับ sms โปรดตรวจสอบเบอร์โทรศัพท์ของท่าน หรือติดต่อเจ้าหน้าที่"
      );
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
        header: <h1>การลงทะเบียนไม่สำเร็จ</h1>,
        article: (
          <div>
            <h4>ขออภัยหมายเลขมือถือของท่านได้มีการลงทะเบียนแล้ว</h4>
            <p>
              <strong>เราขอขอบพระคุณที่ให้ความสนใจเข้าชมงานอีกครั้ง</strong>
            </p>
          </div>
        ),
      });
    } else if (params.res === "success") {
      setText({
        header: <h1>การลงทะเบียนสำเร็จ</h1>,
        article: (
          <div>
            <h4>ขอบพระคุณสำหรับการลงทะเบียนเข้าชมงาน</h4>
            <p>
              <strong>โปรดรอรับ sms และนำ code ไปแสดงกับเจ้าหน้าที่</strong>
            </p>
          </div>
        ),
      });
      getData();
    } else if (params.res === "expire") {
      setText({
        header: <h1>การลงทะเบียนล่วงหน้าสิ้นสุดแล้ว</h1>,
        article: (
          <div>
            <h4>ขอบพระคุณสำหรับการสนใจลงทะเบียนล่วงหน้าเพื่อเข้าชมงาน</h4>
            <p>
              <strong>ขณะนี้เราได้ปิดการลงทะเบียนล่วงหน้าแล้ว</strong>
            </p>
            <p>ท่านสามารถใช้การลงทะเบียนเพื่อรับของสมนาคุณได้ที่หน้างาน</p>
          </div>
        ),
      });
    }
  }, [params.res]);

  useEffect(() => {
    if (!smsStatus) {
      setText({
        header: <h1>การลงทะเบียนไม่สำเร็จ</h1>,
        article: (
          <div>
            <h4>กรุณาตรวจสอบหมายเลขโทรศัพท์ที่ท่านใช้ลงทะเบียนอีกครั้ง</h4>
            <p>
              <strong>
                เราไม่สามารถส่ง code ลงทะเบียนให้แก่ท่านได้ ขออภัยในความไม่สะดวก
              </strong>
            </p>
          </div>
        ),
      });
    }
  }, [smsStatus]);

  // const [csss, setCsss] = useState({});

  return (
    <div className="lg:container">
      <div className="w-full flex items-center flex-col">
        <img
          src={require("../../landingpage/B423/img/fur_logo.png")}
          alt="landing hero"
          id="hero_banner"
          className="mx-auto w-2/3 md:w-1/2 lg:w-1/3"
        />
        <div className="py-4 bg-gradient-to-b from-red-800 from-[75%] to-red-500 w-full text-white text-center">
          <div className="text-xl sm:text-2xl">9-17 ธันวาคม 2566</div>
          <div className="text-xl sm:text-2xl">ไบเทค บางนา</div>
        </div>
      </div>
      <div className="text-center text-2xl md:text-4xl font-medium my-8">
        {text.header}
      </div>
      <div className="text-center text-lg">{text.article}</div>

      <div
        onClick={() => {
          window.open("https://lin.ee/qUKFklQ", "_blank");
        }}
      >
        <div className="flex gap-4 items-center rounded-lg bg-green-500 w-fit px-5 py-2 mx-auto my-6 cursor-pointer">
          <div>
            <img
              src={Line}
              alt="lineico"
              style={{ maxHeight: "2rem" }}
              className="text-white"
            />
          </div>
          <div>
            "เพิ่มเราเป็นเพื่อน"
            <br />
            เพื่อรับข่าวสารและสิทธิประโยชน์อื่นๆ
          </div>
        </div>
      </div>
    </div>
  );
}
