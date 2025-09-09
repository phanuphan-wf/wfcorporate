import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

export default function Reservation(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;

  const [data, setData] = useState([]);

  const getShow = async () => {
    const res = await Axios.get(url + "/getShow").then((res) => {
      let dat = res.data;
      dat.map((d, i) => {
        if (i == 0) {
          d.index = true;
        } else {
          d.index = false;
        }
      });
      setData(dat);
    });
  };

  useEffect(() => {
    getShow();
  }, []);

  const { exid } = useParams();

  const reserve = () => {
    let r = {};
    if (exid != undefined) {
      r = data.filter((d) => d.exID == exid);
    } else {
      r = data.filter((d) => d.index == true);
    }
    return r[0];
  };

  useEffect(() => {
    data.length > 0 && reserve();
  }, [data]);

  const initReserveData = {
    name: "",
    phone: "",
    lineId: "",
    company: "",
    product: "",
    space: "",
    exId: exid != undefined ? exid : data.exID,
  };
  const [reserveData, setReserveData] = useState(initReserveData);

  const sendMail = async () => {
    if (
      reserveData.name == "" ||
      reserveData.phone == "" ||
      reserveData.product == ""
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const res = await Axios.post(url + "/sendReservation", reserveData).then(
      (res) => {
        if (res.status == 200) {
          alert("Mail sent");
          setReserveData(initReserveData);
        }
      }
    );
  };

  useEffect(() => {
    setReserveData({
      ...reserveData,
      exId: exid != undefined ? exid : data.length != 0 && data[0].exID,
    });
  }, [data]);

  return (
    <section className="reserve my-10">
      <div className="headline mb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-center">
            จองพื้นที่แสดงสินค้า
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
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 w-full sm:w-[90%] lg:w-4/5 mx-auto mb-20">
        <div>
          {data.length > 0 && (
            <img
              src={
                "https://worldfair.blob.core.windows.net/webcalendar/" +
                reserve().banner
              }
              className="max-h-[420px] w-full object-contain"
            />
          )}
        </div>
        <form className="grid gap-5 grid-cols-1 px-4">
          <div>
            <label for="name">
              ชื่อ-สกุล<font className="text-red-500">*</font>
            </label>
            <input
              id="name"
              className="border border-gray-500 bg-gray-300 w-full p-1 focus:outline-none focus:ring-2 focus:ring-red-300 focus:shadow-[0_0_10px_0px] focus:shadow-red-500 rounded-sm mt-1"
              onChange={(e) =>
                setReserveData({ ...reserveData, name: e.target.value })
              }
              value={reserveData.name}
            />
          </div>
          <div>
            <label for="tel">
              เบอร์ติดต่อ<font className="text-red-500">*</font>
            </label>
            <input
              id="tel"
              className="border border-gray-500 bg-gray-300 w-full p-1 focus:outline-none focus:ring-2 focus:ring-red-300 focus:shadow-[0_0_10px_0px] focus:shadow-red-500 rounded-sm mt-1"
              onChange={(e) =>
                setReserveData({ ...reserveData, phone: e.target.value })
              }
              value={reserveData.phone}
            />
          </div>
          <div>
            <label for="line">line ID</label>
            <input
              id="line"
              className="border border-gray-500 bg-gray-300 w-full p-1 focus:outline-none focus:ring-2 focus:ring-red-300 focus:shadow-[0_0_10px_0px] focus:shadow-red-500 rounded-sm mt-1"
              onChange={(e) =>
                setReserveData({ ...reserveData, lineId: e.target.value })
              }
              value={reserveData.lineId}
            />
          </div>
          <div>
            <label for="company">ชื่อ บริษัท/ร้านค้า</label>
            <input
              id="company"
              className="border border-gray-500 bg-gray-300 w-full p-1 focus:outline-none focus:ring-2 focus:ring-red-300 focus:shadow-[0_0_10px_0px] focus:shadow-red-500 rounded-sm mt-1"
              onChange={(e) =>
                setReserveData({ ...reserveData, company: e.target.value })
              }
              value={reserveData.company}
            />
          </div>
          <div>
            <label for="product">
              ประเภทสินค้า<font className="text-red-500">*</font>
            </label>
            <textarea
              id="product"
              className="border border-gray-500 bg-gray-300 w-full p-1 focus:outline-none focus:ring-2 focus:ring-red-300 focus:shadow-[0_0_10px_0px] focus:shadow-red-500 rounded-sm mt-1"
              rows={3}
              onChange={(e) =>
                setReserveData({ ...reserveData, product: e.target.value })
              }
              value={reserveData.product}
            ></textarea>
          </div>
          <div>
            <label for="area">จำนวนพื้นที่ที่ต้องการ (ตร.ม.)</label>
            <input
              id="area"
              className="border border-gray-500 bg-gray-300 w-full p-1 focus:outline-none focus:ring-2 focus:ring-red-300 focus:shadow-[0_0_10px_0px] focus:shadow-red-500 rounded-sm mt-1"
              onChange={(e) =>
                setReserveData({ ...reserveData, space: e.target.value })
              }
              value={reserveData.space}
            />
          </div>
          <div className="bg-gradient-to-b from-[#FF0000] to-[#640000] p-[2px] cursor-pointer h-fit">
            <div
              className="text-white text-center bg-transparent hover:bg-white hover:text-[#990101] py-2 px-5"
              onClick={sendMail}
            >
              จองพื้นที่แสดงสินค้า
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
