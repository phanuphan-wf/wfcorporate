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
    <div className="container max-w-5xl px-10 mb-5">
      <div className="text-lg">กรุณาระบุลักษณะที่พักอาศัยของท่าน</div>
      <div className="p-3 border rounded-lg border-slate-400">
        {resident.map((r, i) => (
          <div>
            <input
              type="radio"
              id={r.id}
              className="mr-2"
              name="rad_resident"
              onChange={() => onResidentChange(r.id)}
            />
            <label for={r.id}>{r.col}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
