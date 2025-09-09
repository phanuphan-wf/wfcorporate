import React, { useState, useEffect } from "react";

export default function Resident(props) {
  const resident = [
    {
      col: "บ้านเดี่ยว",
      id: "1",
    },
    {
      col: "ทาวน์เฮ้าส์",
      id: "2",
    },
    {
      col: "คอนโดมิเนียม",
      id: "3",
    },
    {
      col: "อพาร์ทเม้นต์",
      id: "4",
    },
  ];

  const initResi = { uid: "", house: 0 };

  const [qResi, setQResi] = useState(initResi);

  const onResidentChange = (val) => {
    setQResi({ ...qResi, house: val });
  };

  useEffect(() => {
    props.resiData(qResi);
  }, [qResi]);

  return (
    <div className="md:container max-w-5xl px-4 md:px-10 mb-5">
      <div className="text-lg">กรุณาระบุลักษณะที่พักอาศัยของท่าน</div>
      <div className="px-4">
        <div className="border rounded-lg border-slate-400 flex max-md:flex-wrap justify-around overflow-hidden [&>div:not(:last-child)]:border-r max-sm:text-lg">
          {resident.map((r, i) => (
            <div
              className={`flex justify-center py-2 max-md:border-b bg-[#bfbfbf] w-full text-[rgb(128,128,128)] ${
                qResi.house == i + 1 ? "bg-white text-black" : ""
              }`}
            >
              <input
                type="radio"
                id={r.id}
                className="hidden"
                name="rad_resident"
                onChange={() => onResidentChange(r.id)}
              />
              <label htmlFor={r.id}>{r.col}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
