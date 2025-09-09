import React, { useEffect, useState } from "react";

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
    <div className="container max-w-5xl px-10 mb-5">
      <div className="text-lg">
        ท่านทราบข่าวการจัดงานในครั้งนี้จากสื่อใด (ตอบได้มากกว่า 1 ข้อ)
      </div>
      <div className="p-3 border rounded-lg border-slate-400">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {media.map((m, i) => (
            <div>
              <input
                type="checkbox"
                id={m.id}
                className="mr-2"
                onChange={() => onMediaChange(m.id)}
              />
              <label for={m.id}>{m.col}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
