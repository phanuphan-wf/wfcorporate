import React, { useEffect, useState, useContext } from "react";
import { dataContext } from "./survey";

export default function VisQTV(props) {
  const { qtvC, qProgramC, tvselectC } = useContext(dataContext);

  const [qtv, setQTV] = qtvC;

  const tv = [
    {
      col: "ช่อง 3(33)",
      id: "c33",
    },
    {
      col: "ช่อง 7(35)",
      id: "c35",
    },
    {
      col: "ช่อง 9 MCOT HD(30",
      id: "c30",
    },
    {
      col: "Workpoint(23)",
      id: "c23",
    },
    {
      col: "One 31(31)",
      id: "c31",
    },
    {
      col: "ช่อง 8(27)",
      id: "c27",
    },
    {
      col: "Nation TV(22)",
      id: "c22",
    },
    {
      col: "ไทยรัฐทีวี(32)",
      id: "c32",
    },
    {
      col: "อัมรินทร์ทีวี(34)",
      id: "c34",
    },
    {
      col: "PPTV HD(36)",
      id: "c36",
    },
    {
      col: "Mono 29(29)",
      id: "c29",
    },
    {
      col: "JKN(18)",
      id: "c18",
    },
    {
      col: "GMM 25(25)",
      id: "c25",
    },
    {
      col: "TNN(16)",
      id: "c16",
    },
    {
      col: "ช่อง 5(5)",
      id: "c5",
    },
  ];

  const onTVChange = (id) => {
    let value = qtv[id];
    if (value === 0) {
      value = 1;
    } else {
      value = 0;
    }
    setQTV({ ...qtv, [id]: value });
  };

  const [qProgram, setQProgram] = qProgramC;

  const program = [
    {
      col: "ละคร",
      id: "drama",
    },
    {
      col: "ข่าว",
      id: "news",
    },
    {
      col: "เกมส์โชว์",
      id: "game",
    },
    {
      col: "สารคดี",
      id: "doc",
    },
    {
      col: "กีฬา",
      id: "sport",
    },
  ];

  const onProgramChange = (id) => {
    let value = qProgram[id];
    if (value === 0) {
      value = 1;
    } else {
      value = 0;
    }
    setQProgram({ ...qProgram, [id]: value });
  };

  useEffect(() => {
    //console.log("qtv", qtv);
  }, [qtv]);

  useEffect(() => {
    //console.log("qProgram", qProgram);
  }, [qProgram]);

  const [watch, setWatch] = useState(false);

  const inittv = {
    ...qtv,
    c33: 0,
    c35: 0,
    c30: 0,
    c23: 0,
    c31: 0,
    c27: 0,
    c22: 0,
    c32: 0,
    c34: 0,
    c36: 0,
    c29: 0,
    c18: 0,
    c25: 0,
    c16: 0,
    c5: 0,
    non: 1,
  };

  const initProgram = {
    ...qProgram,
    drama: 0,
    news: 0,
    game: 0,
    doc: 0,
    sport: 0,
  };

  const cmbTVChange = (v) => {
    setTvselect(v);
    if (v == 1) {
      setWatch(true);
    } else {
      setWatch(false);
    }
    setQTV(inittv);
    setQProgram(initProgram);
    if (v == 1) {
      setQTV((prev) => ({ ...prev, non: 0 }));
      setQProgram(initProgram);
    }
  };

  const [tvselect, setTvselect] = tvselectC;

  return (
    <div id="section2" className="mb-3">
      <div id="qtv">
        <label htmlFor="qtv" className="block md:text-lg">
          ปกติท่านรับชมโทรทัศน์ที่บ้านเป็นประจำหรือไม่?
        </label>
        <select
          className="cmb min-w-fit md:text-lg"
          id="qtv"
          onChange={(e) => cmbTVChange(e.target.value)}
          value={tvselect}
        >
          <option value={0} selected hidden disabled>
            กรุณาเลือก
          </option>
          <option value={1}>รับชมเป็นประจำ</option>
          <option value={2}>ไม่ค่อยรับชม</option>
        </select>
      </div>
      {watch == 1 && (
        <div>
          <div id="channel" className="mt-2">
            <label htmlFor="qtv" className="block md:text-lg">
              ช่องใดที่ท่านชอบรับชมมากที่สุด? (ตอบได้มากกว่า 1 ข้อ)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {tv.map((t, i) => (
                <div>
                  <input
                    type="checkbox"
                    id={"toggle-" + t.id}
                    className="size-5 accent-red-500 mr-2"
                    onChange={() => onTVChange(t.id)}
                    checked={qtv[t.id] === 1}
                  />
                  <label htmlFor={"toggle-" + t.id} className="md:text-lg">
                    {t.col}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div id="program" className="mt-2">
            <label htmlFor="qprogram" className="block md:text-lg">
              ประเภทของรายการที่ท่านชอบรับชมมากที่สุด? (ตอบได้มากกว่า 1 ข้อ)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {program.map((p, i) => (
                <div>
                  <input
                    type="checkbox"
                    id={"toggle-" + p.id}
                    className="size-5 accent-red-500 mr-2"
                    onChange={() => onProgramChange(p.id)}
                    checked={qProgram[p.id] === 1}
                  />
                  <label htmlFor={"toggle-" + p.id} className="md:text-lg">
                    {p.col}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
