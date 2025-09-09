import React, { useState, useEffect } from "react";
import Axios from "axios";

import date from "../img/date.svg";
import time from "../img/time.svg";
import place from "../img/place.svg";

export default function Hero(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;
  const initData = {
    banner: "",
    title: "",
    showdate: "",
    showtime: "",
    venue: "",
    exID: "",
  };

  const [data, setData] = useState(initData);

  const [landing, setLanding] = useState("0");

  const getLandingOpen = async () => {
    const res = await Axios.get(url + "/landingOpen").then((res) =>
      setLanding(res.data.val)
    );
  };

  const getHero = async () => {
    const res = await Axios.get(url + "/getHero").then((res) => {
      setData(res.data);
    });
  };

  useEffect(() => {
    getLandingOpen();
    getHero();
  }, []);

  return (
    <section className="calender_hero">
      <div className="text-4xl md:text-5xl lg:text-6xl pt-8 text-center">
        งานที่กำลังจะมาถึง
      </div>
      <div className="flex justify-center py-4">
        <svg height={10} width={160}>
          <line
            x1="0"
            y1="0"
            x2="160"
            y2="0"
            style={{ stroke: "rgb(255,0,0)", strokeWidth: "5px" }}
          />
        </svg>
      </div>
      <div className="bg-gradient-to-b from-[#FF0000] to-[#640000] overflow-hidden">
        <div className="container py-8 px-3">
          <div className="border-2 sm:border-4 md:border-8 border-white max-w-5xl mx-auto">
            <img
              src={
                "https://worldfair.blob.core.windows.net/website/" + data.banner
              }
              alt="hero banner"
              id={"herobanner"}
            />
          </div>
          <div className="flex flex-col items-center my-5">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-medium">
              {data.title}
            </h1>
            <div className="flex text-white md:[&>*:not(:last-child)]:border-r-2 md:w-4/5 lg:2/3 mt-4 flex-col md:flex-row">
              <div className="md:flex-auto md:text-center flex gap-4 justify-start md:justify-center">
                <img src={date} alt="date" />
                <div id={"dateico"}>{data.showdate}</div>
              </div>

              <div className="md:flex-auto text-start md:text-center flex gap-4 justify-start md:justify-center">
                <img src={time} alt="time" />
                <div id={"dateico"}>{data.showtime}</div>
              </div>

              <div className="md:flex-auto text-start md:text-center flex gap-4 justify-start md:justify-center">
                <img src={place} alt="place" />
                <div id={"dateico"}>{data.venue}</div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 sm:gap-8 justify-center">
            <div
              id="btnregist"
              className="w-40 py-3 text-center border bg-white border-white text-[#AE0000] hover:bg-transparent hover:text-white cursor-pointer"
            >
              {landing == "1" ? (
                <a
                  href={"/" + data.exID}
                  className="after:content-['ลงทะเบียนเข้างาน']"
                ></a>
              ) : (
                <a
                  href={"/calendar"}
                  className="after:content-['ลงทะเบียนเข้างาน'] hover:after:content-['ยังไม่เปิดบริการ']"
                ></a>
              )}
            </div>
            <div
              id="btnreserve"
              className="w-40 py-3 text-center border border-white bg-black text-white hover:bg-transparent cursor-pointer"
            >
              <a href={"/reservation/" + data.exId}>สนใจจองพื้นที่</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
