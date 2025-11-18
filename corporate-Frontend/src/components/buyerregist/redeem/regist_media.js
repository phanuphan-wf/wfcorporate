import React, { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";

export default function Media(props) {
  const { t, i18n } = useTranslation("landing", { keyPrefix: "regist.media" });
  const media = [
    {
      col_th: "TV",
      col_en: "TV",
      id: "tv",
    },
    {
      col_th: "ป้ายบิลบอร์ดขนาดใหญ่",
      col_en: "Billboard",
      id: "billboard",
    },
    {
      col_th: "ป้ายริมถนน",
      col_en: "Roadside Cutout",
      id: "cutout",
    },
    /*
    {
      col_th: "วิทยุ",
      col_en: "Radio",
      id: "radio",
    },
*/
    {
      col_th: "Facebook/Instagram",
      col_en: "Facebook/Instagram",
      id: "facebook",
    },
    {
      col_th: "โฆษณาบนเวปไซต์/ค้นหา Google",
      col_en: "Google Search/Website Ads",
      id: "google",
    },
    {
      col_th: "โฆษณาบน Youtube",
      col_en: "Youtube Ads",
      id: "youtube",
    },
    {
      col_th: "Line",
      col_en: "Line",
      id: "line",
    },
    {
      col_th: "tiktok",
      col_en: "Tiktok",
      id: "tiktok",
    },
    {
      col_th: "เพื่อนและครอบครัว",
      col_en: "Friends and Family",
      id: "friend",
    },

    {
      col_th: "SMS",
      col_en: "SMS",
      id: "sms",
    },

    {
      col_th: "อื่นๆ",
      col_en: "Other",
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
      <div className="text-lg">{t("title")}</div>
      <div className="p-3 border rounded-lg border-indigo-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-sm:text-lg">
          {media.map((m, i) => (
            <label
              htmlFor={"toggle-" + m.id}
              className={`w-full border-2 border-[#bfbfbf] rounded-md relative`}>
              <input
                type="checkbox"
                id={"toggle-" + m.id}
                className="sr-only w-full h-full peer"
                onChange={() => onMediaChange(m.id)}
              />
              <div className="w-full h-10 md:h-9 bg-gradient-to-r from-white from-[40%] to-[#bfbfbf] to-[50%] bg-[position:_100%_100%] peer-checked:bg-[position:_0%_0%] bg-[size:200%] peer-checked:rounded-md transition-all duration-300"></div>
              <span className="absolute top-1/2 left-[10px] -translate-y-1/2 text-[rgb(128,128,128)] peer-checked:text-black">
                {i18n.language == "th" ? m.col_th : m.col_en}
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
