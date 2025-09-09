import React, { useEffect, useState } from "react";
import Axios from "axios";

import date from "../img/date.svg";
import time from "../img/time.svg";
import place from "../img/place.svg";

export default function Nextshow(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;
  const initData = {
    id: "",
    banner: "",
    title: "",
    dates: "",
    times: "",
    venue: "",
    exID: "",
  };

  const [data, setData] = useState([initData]);

  const getShow = async () => {
    const res = await Axios.get(url + "/getShow").then((res) => {
      setData(res.data);
    });
  };

  useEffect(() => {
    getShow();
  }, []);

  return (
    <section className="calendar_next my-8">
      <div className="mt-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-center">
          งานแสดงสินค้าในอนาคต
        </h1>
      </div>
      <div className="flex justify-center py-4 mb-5">
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
      <div className="lg:container md:px-10">
        {data.map((d, i) => (
          <div className="grid grid-cols-1 md:grid-cols-5 place-items-center">
            <div
              className={`flex justify-center col-span-2 ${
                (i + 1) % 2 == 0 && "md:order-last"
              }`}
            >
              <img
                src={
                  "https://worldfair.blob.core.windows.net/webcalendar/" +
                  d.banner
                }
                className="w-4/5 md:w-full max-w-[380px]"
              />
            </div>
            <div className="hidden md:flex flex-col items-center">
              {i + 1 == 1 && (
                <svg height={32} width={32}>
                  <circle cx="16" cy="16" r="16" fill="#ff0000" />
                </svg>
              )}
              <svg className="w-[32px] md:h-[350px] lg:h-[400px]">
                <line
                  x1="16"
                  y1="0"
                  x2="16"
                  y2="400"
                  stroke-width="4"
                  stroke="#ff0000"
                />
              </svg>
              <svg height={32} width={32}>
                <circle cx="16" cy="16" r="16" fill="#ff0000" />
              </svg>
            </div>
            <div
              className={`my-5 sm:my-7 md:my-0 md:col-span-2  ${
                (i + 1) % 2 == 0 &&
                "md:order-first md:grid md:justify-items-end"
              }`}
            >
              <div
                className={`text-3xl mb-2 ${(i + 1) % 2 == 0 && "md:text-end"}`}
              >
                {d.title}
              </div>
              <div
                className={`block mx-auto w-fit md:mx-0 ${
                  (i + 1) % 2 == 0 && "md:grid md:justify-items-end"
                }`}
              >
                <div className="flex justify-start items-center gap-2 text-lg">
                  <div className={`${(i + 1) % 2 == 0 && "md:order-last"}`}>
                    <svg
                      width="13"
                      height="16"
                      viewBox="0 0 13 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.66667 9.5C3.46597 9.5 3.29763 9.428 3.16163 9.284C3.02563 9.14 2.95786 8.962 2.95833 8.75C2.95833 8.5375 3.02633 8.35925 3.16233 8.21525C3.29833 8.07125 3.46645 7.9995 3.66667 8C3.86736 8 4.03571 8.072 4.17171 8.216C4.30771 8.36 4.37547 8.538 4.375 8.75C4.375 8.9625 4.307 9.14075 4.171 9.28475C4.035 9.42875 3.86689 9.5005 3.66667 9.5ZM6.5 9.5C6.29931 9.5 6.13096 9.428 5.99496 9.284C5.85896 9.14 5.7912 8.962 5.79167 8.75C5.79167 8.5375 5.85967 8.35925 5.99567 8.21525C6.13167 8.07125 6.29978 7.9995 6.5 8C6.7007 8 6.86904 8.072 7.00504 8.216C7.14104 8.36 7.20881 8.538 7.20833 8.75C7.20833 8.9625 7.14033 9.14075 7.00433 9.28475C6.86833 9.42875 6.70022 9.5005 6.5 9.5ZM9.33333 9.5C9.13264 9.5 8.96429 9.428 8.82829 9.284C8.69229 9.14 8.62453 8.962 8.625 8.75C8.625 8.5375 8.693 8.35925 8.829 8.21525C8.965 8.07125 9.13311 7.9995 9.33333 8C9.53403 8 9.70238 8.072 9.83838 8.216C9.97438 8.36 10.0421 8.538 10.0417 8.75C10.0417 8.9625 9.97367 9.14075 9.83767 9.28475C9.70167 9.42875 9.53356 9.5005 9.33333 9.5ZM1.54167 15.5C1.15208 15.5 0.818459 15.353 0.540793 15.059C0.263126 14.765 0.124529 14.412 0.125001 14V3.5C0.125001 3.0875 0.263835 2.73425 0.541501 2.44025C0.819168 2.14625 1.15256 1.9995 1.54167 2H2.25V0.5H3.66667V2H9.33333V0.5H10.75V2H11.4583C11.8479 2 12.1815 2.147 12.4592 2.441C12.7369 2.735 12.8755 3.088 12.875 3.5V14C12.875 14.4125 12.7362 14.7658 12.4585 15.0598C12.1808 15.3538 11.8474 15.5005 11.4583 15.5H1.54167ZM1.54167 14H11.4583V6.5H1.54167V14Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div id={"dateico"}>{d.dates}</div>
                </div>
                <div className="flex justify-start items-center gap-2 text-lg">
                  <div className={`${(i + 1) % 2 == 0 && "md:order-last"}`}>
                    <svg
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.49294 0.5C3.58294 0.5 0.416687 3.86 0.416687 8C0.416687 12.14 3.58294 15.5 7.49294 15.5C11.41 15.5 14.5834 12.14 14.5834 8C14.5834 3.86 11.41 0.5 7.49294 0.5ZM7.50002 14C4.36919 14 1.83335 11.315 1.83335 8C1.83335 4.685 4.36919 2 7.50002 2C10.6309 2 13.1667 4.685 13.1667 8C13.1667 11.315 10.6309 14 7.50002 14ZM7.34419 4.25H7.30169C7.01835 4.25 6.79169 4.49 6.79169 4.79V8.33C6.79169 8.5925 6.91919 8.84 7.13877 8.975L10.0784 10.8425C10.3192 10.9925 10.6309 10.9175 10.7725 10.6625C10.8081 10.6018 10.8317 10.5341 10.8421 10.4635C10.8524 10.3929 10.8493 10.3208 10.8327 10.2515C10.8162 10.1822 10.7867 10.1171 10.7459 10.0602C10.7051 10.0032 10.654 9.95557 10.5954 9.92L7.85419 8.195V4.79C7.85419 4.49 7.62752 4.25 7.34419 4.25Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div id={"timeico"}>{d.times}</div>
                </div>
                <div className="flex justify-start items-center gap-2 text-lg">
                  <div className={`${(i + 1) % 2 == 0 && "md:order-last"}`}>
                    <svg
                      width="13"
                      height="16"
                      viewBox="0 0 13 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.49998 8C6.88956 8 7.22319 7.853 7.50085 7.559C7.77852 7.265 7.91712 6.912 7.91665 6.5C7.91665 6.0875 7.77781 5.73425 7.50015 5.44025C7.22248 5.14625 6.88909 4.9995 6.49998 5C6.1104 5 5.77677 5.147 5.4991 5.441C5.22144 5.735 5.08284 6.088 5.08331 6.5C5.08331 6.9125 5.22215 7.26575 5.49981 7.55975C5.77748 7.85375 6.11087 8.0005 6.49998 8ZM6.49998 13.5125C7.94026 12.1125 9.00866 10.8405 9.70519 9.6965C10.4017 8.5525 10.75 7.537 10.75 6.65C10.75 5.2875 10.3396 4.172 9.5189 3.3035C8.69817 2.435 7.69187 2.0005 6.49998 2C5.30762 2 4.30108 2.4345 3.48035 3.3035C2.65963 4.1725 2.24951 5.288 2.24998 6.65C2.24998 7.5375 2.59824 8.55325 3.29477 9.69725C3.9913 10.8412 5.0597 12.113 6.49998 13.5125ZM6.49998 15.5C4.59929 13.7875 3.17979 12.197 2.24148 10.7285C1.30317 9.26 0.833785 7.9005 0.833313 6.65C0.833313 4.775 1.40305 3.28125 2.54252 2.16875C3.68199 1.05625 5.00115 0.5 6.49998 0.5C7.99928 0.5 9.31867 1.05625 10.4581 2.16875C11.5976 3.28125 12.1671 4.775 12.1666 6.65C12.1666 7.9 11.6973 9.2595 10.7585 10.7285C9.8197 12.1975 8.4002 13.788 6.49998 15.5Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div id={"placeico"}>{d.venue}</div>
                </div>
              </div>
              <div className="bg-gradient-to-b from-[#FF0000] to-[#640000] p-[2px] cursor-pointer w-fit block mx-auto mt-4 md:mx-0 md:mt-2">
                <div className="text-white bg-transparent hover:bg-white hover:text-[#990101] py-1 px-5">
                  <a href={"/reservation/" + d.exID}>สนใจจองพื้นที่</a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
