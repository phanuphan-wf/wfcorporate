import React, { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";

export default function Media(props) {
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

  const initMedia = {
    uid: "",
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

  const [qMedia, setQMedia] = useState(initMedia);

  const onMediaChange = (id) => {
    let value = qMedia[id];
    if (value === 0) {
      value = 1;
    } else {
      value = 0;
    }
    setQMedia({ ...qMedia, [id]: value });
  };

  useEffect(() => {
    props.mediaData(qMedia);
  }, [qMedia]);

  return (
    <div className="md:container max-w-5xl px-4 md:px-10 mb-5">
      <div className="text-lg">
        ท่านทราบข่าวการจัดงานในครั้งนี้จากสื่อใด (ตอบได้มากกว่า 1 ข้อ)
      </div>
      <div className="p-3 border rounded-lg border-slate-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-sm:text-lg">
          {media.map((m, i) => (
            <label
              htmlFor={"toggle-" + m.id}
              className={`w-full border-2 border-[#bfbfbf] rounded-md relative`}
            >
              <input
                type="checkbox"
                id={"toggle-" + m.id}
                className="sr-only w-full h-full peer"
                onChange={() => onMediaChange(m.id)}
              />
              <div className="w-full h-10 md:h-9 bg-gradient-to-r from-white from-[40%] to-[#bfbfbf] to-[50%] bg-[position:_100%_100%] peer-checked:bg-[position:_0%_0%] bg-[size:200%] peer-checked:rounded-md transition-all duration-300"></div>
              <span className="absolute top-1/2 left-[10px] -translate-y-1/2 text-[rgb(128,128,128)] peer-checked:text-black">
                {m.col}
              </span>
              <div className="text-transparent peer-checked:text-orange-600 absolute top-1/2 -translate-y-1/2 right-4 transition-all duration-300">
                <BsCheckCircleFill />
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
