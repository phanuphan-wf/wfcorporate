import React, { useEffect, useState, useContext } from "react";
import { dataContext } from "./survey";

export default function VisQFav(props) {
  const { dataC } = useContext(dataContext);

  const [data, setData] = dataC;

  const onFavChange = (val) => {
    ["favExhibitor", "favProduct", "favPrice", "favPromotion", "favOther"].map(
      (fav, i) => {
        if (i === val) {
          var favItem = fav;

          if (i !== 4) {
            if (data[favItem] === 0) {
              setData({ ...data, [favItem]: 1 });
            } else {
              setData({ ...data, [favItem]: 0 });
            }
          } else {
            if (data[favItem] === "0") {
              let txt = document.getElementById("txtfavOther").value;
              if (txt !== "") {
                setData({ ...data, [favItem]: txt });
              } else {
                setData({ ...data, [favItem]: "1" });
              }
            } else {
              setData({ ...data, [favItem]: "0" });
              document.getElementById("txtfavOther").value = "";
            }
          }
        }
      }
    );
  };

  const onfavOtherChange = (val) => {
    if (val === "") {
      val = "1";
    }

    if (data.favOther === "0") {
      document.getElementById("fav-check-4").checked = true;
      setData({ ...data, favOther: val });
    } else {
      setData({ ...data, favOther: val });
    }
  };

  useEffect(() => {
    ["favExhibitor", "favProduct", "favPrice", "favPromotion", "favOther"].map(
      (fav, i) => {
        if (data[fav] === 1) {
          document.getElementById(`fav-check-${i}`).checked = true;
        } else if (data.favOther !== "0") {
          document.getElementById(`fav-check-4`).checked = true;
        } else {
          document.getElementById(`fav-check-${i}`).checked = false;
        }
      }
    );
  }, [data]);

  return (
    <div id="section3" className="mb-3">
      <label htmlFor="qprogram" className="block md:text-lg">
        ท่านมีความประทับใจอะไร จากการเข้าชมงานครั้งนี้? (ตอบได้มากกว่า 1 ข้อ)
      </label>
      <div id="qfav" className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {[
          "จำนวนร้านค้าภายในงาน",
          "สินค้ามีให้เลือกหลายประเภท",
          "ราคาสินค้าจากผู้ผลิต",
          "การส่งเสริมการขายจากผู้จัดงาน",
          "อื่นๆ",
        ].map((x, i) => (
          <div>
            <input
              type="checkbox"
              id={`fav-check-${i}`}
              name={`fav-check-${i}`}
              onChange={() => onFavChange(i)}
              className="size-5 accent-red-500 mr-2"
            />
            <label htmlFor={`fav-check-${i}`} className="md:text-lg">
              {x}
            </label>
            {x === "อื่นๆ" && (
              <input
                placeholder="โปรดระบุ"
                id="txtfavOther"
                className="md:text-lg ml-2"
                onChange={(e) => onfavOtherChange(e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <label htmlFor="suggest" className="block md:text-lg">
          ข้อเสนอแนะเพิ่มเติม
        </label>
        <textarea
          id="suggest"
          className="w-full border border-gray-200 rounded-md md:text-lg focus:ring-2 focus:outline-none focus:ring-[rgba(255,0,0,0.5)]"
          rows={3}
          onChange={(e) => setData({ ...data, suggest: e.target.value })}
        ></textarea>
      </div>
    </div>
  );
}
