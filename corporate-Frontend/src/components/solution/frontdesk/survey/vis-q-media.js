import React, { useEffect, useState, useContext } from "react";
import { dataContext } from "./survey";

export default function VisMedia(props) {
  const { qmediaC } = useContext(dataContext);

  const [qMedia, setQMedia] = qmediaC;

  const onMediaChange = (id) => {
    let value = qMedia[id];
    if (value === 0) {
      value = 1;
    } else {
      value = 0;
    }
    setQMedia({ ...qMedia, [id]: value });
  };

  const initqMedia = {
    ...qMedia,
    tv: 0,
    billboard: 0,
    newspaper: 0,
    facebook: 0,
    google: 0,
    youtube: 0,
    line: 0,
    friend: 0,
    other: 0,
    cutout: 0,
    radio: 0,
    tiktok: 0,
    sms: 0,
  };

  const media = [
    {
      col: "TV",
      id: "tv",
    },
    {
      col: "ป้ายบิลบอร์ดขนาดใหญ่",
      id: "billboard",
    },
    {
      col: "ป้ายริมถนน",
      id: "cutout",
    },
    {
      col: "วิทยุ",
      id: "radio",
    },
    {
      col: "Facebook",
      id: "facebook",
    },
    {
      col: "โฆษณาบนเวปไซต์",
      id: "google",
    },
    {
      col: "โฆษณาบน Youtube",
      id: "youtube",
    },
    {
      col: "Line",
      id: "line",
    },
    {
      col: "tiktok",
      id: "tiktok",
    },
    {
      col: "เพื่อนและครอบครัว",
      id: "friend",
    },
    {
      col: "SMS",
      id: "sms",
    },
    {
      col: "อื่นๆ",
      id: "other",
    },
  ];

  return (
    <div id="section3" className="mb-3">
      <div id="media" className="mt-2">
        <label htmlFor="qmedia" className="block md:text-lg">
          ท่านทราบข่าวการจัดงานแสดงสินค้านี้ จากสื่อใด? (ตอบได้มากกว่า 1 ข้อ)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {media.map((m, i) => (
            <div>
              <input
                type="checkbox"
                id={"toggle-" + m.id}
                className="size-5 accent-red-500 mr-2"
                onChange={() => onMediaChange(m.id)}
                checked={qMedia[m.id] === 1}
              />
              <label htmlFor={"toggle-" + m.id} className="md:text-lg">
                {m.col}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
