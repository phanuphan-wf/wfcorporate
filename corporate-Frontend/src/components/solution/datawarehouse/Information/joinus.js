import { useState } from "react";
import Axios from "axios";
import { IoIosAddCircle } from "react-icons/io";
import { TiDelete } from "react-icons/ti";

export default function CreateJob() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;

  const user = JSON.parse(localStorage.getItem("user"));

  /* ================== INIT DATA ================== */
  const initData = {
    positionEn: "",
    positionTh: "",
    createBy: user.name,
    show: true,
    urgent: false,
  };

 
  const [data, setData] = useState(initData);

  const [quals, setQuals] = useState([
    { qualEn: "", qualTh: "" },
  ]);

  const [descs, setDescs] = useState([
    { descEn: "", descTh: "" },
  ]);

  //console.log(initData);

  /* ================== QUALIFICATION ================== */
  const addQualRow = () => {
    setQuals(prev => [...prev, { qualEn: "", qualTh: "" }]);
  };

  const changeQual = (index, field, value) => {
    const updated = [...quals];
    updated[index][field] = value;
    setQuals(updated);
  };

  const removeQualRow = (index) => {
    setQuals(prev => prev.filter((_, i) => i !== index));
  };

  /* ================== DESCRIPTION ================== */
  const addDescRow = () => {
    setDescs(prev => [...prev, { descEn: "", descTh: "" }]);
  };

  const changeDesc = (index, field, value) => {
    const updated = [...descs];
    updated[index][field] = value;
    setDescs(updated);
  };

  const removeDescRow = (index) => {
    setDescs(prev => prev.filter((_, i) => i !== index));
  };

  /* ================== VALIDATE ================== */
  const isFormValid =
    data.positionEn.trim() &&
    data.positionTh.trim() &&
    quals.every(q => q.qualEn.trim() && q.qualTh.trim()) &&
    descs.every(d => d.descEn.trim() && d.descTh.trim());

  /* ================== SUBMIT ================== */
  const submitData = async () => {
    if (!isFormValid) return;

    const payload = {
      ...data,
      descs: descs.map((d, i) => ({
        descEn: d.descEn,
        descTh: d.descTh,
        rank: i + 1,
      })),
      quals: quals.map((q, i) => ({
        qualEn: q.qualEn,
        qualTh: q.qualTh,
        rank: i + 1,
      })),
    };

     console.log("PAYLOAD =>", payload);

    try {
      const res = await Axios.post(url + "/postJob/", payload);

      if (res.status === 200) {
        alert("Create job success");
        setData(initData);
        setQuals([{ qualEn: "", qualTh: "" }]);
        setDescs([{ descEn: "", descTh: "" }]);
      }
    } catch (err) {
      console.error(err);
      alert("Create job failed");
    }
  };

  /* ================== CLEAR ================== */
  const clickCancel = () => {
    setData(initData);
    setQuals([{ qualEn: "", qualTh: "" }]);
    setDescs([{ descEn: "", descTh: "" }]);
  };

  /* ================== RENDER ================== */
  return (
    <section className="xl:w-4/5 2xl:w-3/4">
      <div className="text-xl mb-4">Create Jobs</div>

      <div className="border rounded-md p-4 border-slate-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Position */}
          <div>
            <label>Position Eng</label>
            <input
              className="w-full"
              value={data.positionEn}
              onChange={(e) =>
                setData(prev => ({ ...prev, positionEn: e.target.value }))
              }
            />
          </div>

          <div>
            <label>Position Thai</label>
            <input
              className="w-full"
              value={data.positionTh}
              onChange={(e) =>
                setData(prev => ({ ...prev, positionTh: e.target.value }))
              }
            />
          </div>

          {/* QUALIFICATIONS */}
          {quals.map((q, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label>Qualification Eng</label>
                <input
                  className="w-full"
                  value={q.qualEn}
                  onChange={(e) =>
                    changeQual(index, "qualEn", e.target.value)
                  }
                />
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label>Qualification Thai</label>
                  <input
                    className="w-full"
                    value={q.qualTh}
                    onChange={(e) =>
                      changeQual(index, "qualTh", e.target.value)
                    }
                  />
                </div>

                {index === quals.length - 1 && (
                  <button type="button" onClick={addQualRow}>
                    <IoIosAddCircle size={26} className="text-green-600" />
                  </button>
                )}

                {quals.length > 1 && (
                  <button type="button" onClick={() => removeQualRow(index)}>
                    <TiDelete size={30} className="text-red-600" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* DESCRIPTIONS */}
          {descs.map((d, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label>Description Eng</label>
                <input
                  className="w-full"
                  value={d.descEn}
                  onChange={(e) =>
                    changeDesc(index, "descEn", e.target.value)
                  }
                />
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label>Description Thai</label>
                  <input
                    className="w-full"
                    value={d.descTh}
                    onChange={(e) =>
                      changeDesc(index, "descTh", e.target.value)
                    }
                  />
                </div>

                {index === descs.length - 1 && (
                  <button type="button" onClick={addDescRow}>
                    <IoIosAddCircle size={26} className="text-green-600" />
                  </button>
                )}

                {descs.length > 1 && (
                  <button type="button" onClick={() => removeDescRow(index)}>
                    <TiDelete size={30} className="text-red-600" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* NEED */}
          <div className="flex gap-6 items-center">
            <label>Need</label>

            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="radio"
                checked={!data.urgent}
                onChange={() =>
                  setData(prev => ({ ...prev, urgent: false }))
                }
              />
              normal
            </label>

            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="radio"
                checked={data.urgent}
                onChange={() =>
                  setData(prev => ({ ...prev, urgent: true }))
                }
              />
              urgent
            </label>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between mt-4">
        <button className="btn-gray" onClick={clickCancel}>
          Clear Data
        </button>

        <button
          className={`btn-green px-4 ${
            !isFormValid && "opacity-50 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
          onClick={submitData}
        >
          Add Job
        </button>
      </div>
    </section>
  );
}
