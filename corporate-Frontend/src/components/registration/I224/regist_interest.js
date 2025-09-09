import React, { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";

export default function Interest(props) {
  const interest = [
    {
      cat: "fur",
      name: "หมวดเฟอร์นิเจอร์",
      select: [
        {
          col: "ห้องนอน เช่น เตียงนอน,เครื่องนอน,โต๊ะเครื่องแป้ง",
          id: "F_bed",
        },
        {
          col: "ห้องนั่งเล่น เช่น ชั้นวางทีวี,ตู้โชว์,ตู้เก็บของ",
          id: "F_living",
        },
        {
          col: "โซฟา เช่น โซฟาผ้า,โซฟาหนัง,อาร์แชร์",
          id: "F_sofa",
        },
        {
          col: "ห้องครัว เช่น ชุดครัวสำเร็จรูป",
          id: "F_kitchen",
        },
        {
          col: "ห้องอาหาร เช่น โต๊ะอาหาร,เคาเตอร์บาร์",
          id: "F_dining",
        },
        {
          col: "ห้องทำงาน เช่น โต๊ะทำงาน,ชั้นวางหนังสือ,เก้าอี้ทำงาน",
          id: "F_working",
        },
      ],
    },

    {
      cat: "elec",
      name: "หมวดอิเล็กทรอนิคส์",
      select: [
        {
          col: "ภาพและเสียง เช่น ทีวี,ซาวด์บาร์",
          id: "E_av",
        },
        {
          col: "เครื่องใช้ไฟฟ้าภายในบ้าน เช่น ตู้เย็น,เครื่องซักผ้า,ไมโครเวฟ",
          id: "E_ha",
        },
        {
          col: "เครื่องใช้ไฟฟ้าขนาดเล็ก เช่น เตารีด,เครื่องปั่นน้ำผลไม้,หม้อทอด",
          id: "E_small",
        },
      ],
    },
    /*
    {
      cat: "homedecor",
      name: "หมวดสินค้าเกี่ยวกับบ้าน",
      select: [
        {
          col: "สินค้าตกแต่งบ้านชิ้นเล็ก",
          id: "H_decor",
        },
        {
          col: "เครื่องใช้ภายในบ้าน อาทิ จานชาม, กระทะ",
          id: "H_homeproduct",
        },
        {
          col: "เครื่องมือช่าง",
          id: "H_material",
        },
        {
          col: "ต้นไม้และจัดสวน",
          id: "G_garden",
        },
      ],
    },
    */
    {
      cat: "other",
      name: "หมวดสินค้าอื่นๆ",
      select: [
        {
          col: "อาหารและเครื่องดื่ม",
          id: "F_food",
        },
        /*
        {
          col: "สินค้าเบ็ดเตล็ด",
          id: "F_fashion",
        },
        */
      ],
    },
  ];

  const initIntr = {
    uid: "",
    F_bed: 0,
    F_living: 0,
    F_sofa: 0,
    F_kitchen: 0,
    F_dining: 0,
    F_working: 0,
    E_av: 0,
    E_ha: 0,
    E_small: 0,
    H_decor: 0,
    H_material: 0,
    H_homeproduct: 0,
    G_garden: 0,
    W_wedding: 0,
    F_fashion: 0,
    F_food: 0,
  };

  const [qIntr, setQIntr] = useState(initIntr);

  useEffect(() => {
    props.intrData(qIntr);
    verifyIntr();
  }, [qIntr]);

  const onQIntrChange = (id) => {
    let value = qIntr[id];
    if (value === 0) {
      value = 1;
    } else {
      value = 0;
    }
    setQIntr({ ...qIntr, [id]: value });
  };

  const [intrVerify, setIntrVerify] = useState(false);

  const verifyIntr = () => {
    if (JSON.stringify(qIntr) == JSON.stringify(initIntr)) {
      setIntrVerify(true);
      return true;
    } else {
      setIntrVerify(false);
      return false;
    }
  };

  return (
    <div className="md:container max-w-5xl px-4 md:px-10 mb-5">
      <div className="text-lg">
        ท่านสนใจเข้าชมสินค้าประเภทใดภายในงาน(ตอบได้มากว่า 1 ข้อ) *
      </div>
      <div
        className={`p-3 border rounded-lg  ${
          !props.verify && intrVerify
            ? "bg-red-300 bg-opacity-40 border-slate-300"
            : "border-indigo-900"
        }`}
      >
        {interest.map((d, i) => (
          <div key={d.cat}>
            <div className="font-medium">{d.name}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-sm:text-lg">
              {d.select.map((s, i) => (
                <label
                  htmlFor={"toggle-" + s.id}
                  className={`w-full border-2 border-[#bfbfbf] rounded-md relative`}
                >
                  <input
                    type="checkbox"
                    id={"toggle-" + s.id}
                    className="sr-only w-full h-full peer"
                    onChange={() => onQIntrChange(s.id)}
                  />
                  <div className="w-full h-20 min-[415px]:h-16 sm:h-12 md:h-10 lg:h-9 py-1 bg-gradient-to-r from-white from-[40%] to-[#bfbfbf] to-[50%] bg-[position:_100%_100%] peer-checked:bg-[position:_0%_0%] bg-[size:200%] peer-checked:rounded-md transition-all duration-300"></div>
                  <span className="absolute top-1/2 left-[10px] -translate-y-1/2 text-[rgb(128,128,128)] peer-checked:text-black">
                    {s.col}
                  </span>
                  <div className="text-transparent peer-checked:text-orange-600 absolute top-1/2 -translate-y-1/2 right-4 transition-all duration-300">
                    <BsCheckCircleFill />
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
