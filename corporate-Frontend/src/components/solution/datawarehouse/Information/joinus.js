import { useState, useEffect } from "react";
import Axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import { IoAddCircle } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";

import JobList from "./showjob";

export default function CreateJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;

  const user = JSON.parse(localStorage.getItem("user"));

  const [detaildata, setDetaildata] = useState([]);

  const [reloadFlag, setReloadFlag] = useState(0);

 
  console.log(id);

  /* ================== INIT DATA ================== */
  const initData = {
    positionEn: "",
    positionTh: "",
    createBy: user.name,
    show: true,
    urgent: false,
  };

  const [data, setData] = useState(initData);

  const initQual = {
    qualEn: "",
    qualTh: "",
    rank: 1,
  };

  const [quals, setQuals] = useState([initQual]);

  const initDesc = { descEn: "", descTh: "", rank: 1 };

  const [descs, setDescs] = useState([initDesc]);

  const lastQual = quals[quals.length - 1];
  const canAddQual =
    lastQual.qualEn.trim() !== "" && lastQual.qualTh.trim() !== "";

  const lastDesc = descs[descs.length - 1];
  const canAddDesc =
    lastDesc.descEn.trim() !== "" && lastDesc.descTh.trim() !== "";
  //console.log(initData);

  /* ================== QUALIFICATION ================== */
  const addQualRow = () => {
    setQuals((prev) => [...prev, { qualEn: "", qualTh: "" }]);
  };

  const changeQual = (index, field, value) => {
    const updated = [...quals];
    updated[index][field] = value;
    setQuals(updated);
  };

  const removeQualRow = (index) => {
    setQuals((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================== DESCRIPTION ================== */
  const addDescRow = () => {
    setDescs((prev) => [...prev, { descEn: "", descTh: "" }]);
  };

  const changeDesc = (index, field, value) => {
    const updated = [...descs];
    updated[index][field] = value;
    setDescs(updated);
  };

  const removeDescRow = (index) => {
    setDescs((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================== VALIDATE ================== */
  const isFormValid =
    data.positionEn.trim() &&
    data.positionTh.trim() &&
    quals.every((q) => q.qualEn.trim() && q.qualTh.trim()) &&
    descs.every((d) => d.descEn.trim() && d.descTh.trim());

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

    // console.log("PAYLOAD =>", payload);

    try {
      const res = await Axios.post(url + "/postJob", payload);

      if (res.status === 200) {
        alert("Create job success");
        setData(initData);
        setQuals([{ qualEn: "", qualTh: "" }]);
        setDescs([{ descEn: "", descTh: "" }]);
        setReloadFlag((prev) => prev + 1);
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
    setReloadFlag((prev) => prev + 1);
  }; 


  /*============== jobDetail =================== */
  const jobDetail = async () => {
      if (!id) return; // เช็คว่ามี id หรือไม่

      try {
        const res = await Axios.get(url + "/jobDetail/" + id);
          if (res.status === 200) {
            setDetaildata(res.data);
          }
      } catch (err) {
        console.error(err);      
      }
  };

  useEffect(() => {
    if (id) {
      jobDetail();
    }
  }, [id]); // ฟังก์ชันจะทำงานทุกครั้งที่ id เปลี่ยนค่า

  console.log(detaildata);
  
 
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
                setData((prev) => ({ ...prev, positionEn: e.target.value }))
              }
            />
          </div>

          <div>
            <label>Position Thai</label>
            <input
              className="w-full"
              value={data.positionTh}
              onChange={(e) =>
                setData((prev) => ({ ...prev, positionTh: e.target.value }))
              }
            />
          </div>

          {/* QUALIFICATIONS */}
          <div className="space-y-3">
            {/* Headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
              <div>
                <label>Qualification Eng</label>
              </div>
              <div>
                <label>Qualification Thai</label>
              </div>
            </div>

            {quals.map((q, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                <input
                  className="w-full"
                  value={q.qualEn}
                  onChange={(e) =>
                    changeQual(index, "qualEn", e.target.value)
                  }
                />

                <div className="flex items-end gap-2">
                  <input
                    className="w-full flex-1"
                    value={q.qualTh}
                    onChange={(e) =>
                      changeQual(index, "qualTh", e.target.value)
                    }
                  />

                  {quals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQualRow(index)}
                      className="flex items-center justify-center h-8 w-8
                                  hover:bg-red-100 rounded-full transition">
                      <TiDelete size={26} className="text-red-600" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* ปุ่มเพิ่มแถว (อยู่ล่างสุด) */}
            <button
              type="button"
              onClick={addQualRow}
              disabled={!canAddQual}
              className={`flex items-center gap-1 mt-2
                  ${
                    canAddQual
                      ? "text-green-600 hover:text-green-800"
                      : "text-gray-400 cursor-not-allowed"
                  }`}>
              <IoAddCircle size={28} />
              <span>Add Qualification</span>
            </button>
          </div>

          {/* DESCRIPTIONS */}
          <div className="space-y-3">
            {/* Headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
              <div>
                <label>Description Eng</label>
              </div>
              <div>
                <label>Description Thai</label>
              </div>
            </div>

            {descs.map((d, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                <input
                  className="w-full"
                  value={d.descEn}
                  onChange={(e) =>
                    changeDesc(index, "descEn", e.target.value)
                  }
                />

                <div className="flex items-end gap-2">
                  <input
                    className="w-full flex-1"
                    value={d.descTh}
                    onChange={(e) =>
                      changeDesc(index, "descTh", e.target.value)
                    }
                  />

                  {descs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDescRow(index)}
                      className="flex items-center justify-center h-8 w-8
                                  hover:bg-red-100 rounded-full transition">
                      <TiDelete size={26} className="text-red-600" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* ปุ่มเพิ่ม */}
            <button
              type="button"
              onClick={addDescRow}
              disabled={!canAddDesc}
              className={`flex items-center gap-1 mt-2
                  ${
                    canAddDesc
                      ? "text-green-600 hover:text-green-800"
                      : "text-gray-400 cursor-not-allowed"
                  }`}>
              <IoAddCircle size={28} />
              <span>Add Description</span>
            </button>
          </div>

          {/* NEED */}
          <div className="flex gap-6 items-center">
            <label>Need</label>

            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="radio"
                checked={!data.urgent}
                onChange={() => setData((prev) => ({ ...prev, urgent: false }))}
              />
              normal
            </label>

            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="radio"
                checked={data.urgent}
                onChange={() => setData((prev) => ({ ...prev, urgent: true }))}
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
          onClick={submitData}>
          Add Job
        </button>
      </div>  

      <div className="mt-5">
        <JobList reload={reloadFlag} />
      </div>

    
    </section>
  );
}
