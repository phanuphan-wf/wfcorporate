import { useState, useEffect } from "react";
import Axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import { IoAddCircle } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";

import JobList from "./showjob";

export default function CreateJob() {

  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;

  const user = JSON.parse(localStorage.getItem("user"));  
  const [reloadFlag, setReloadFlag] = useState(0);

  const { id } = useParams();
  const [detailid, setDetailid] = useState(null);
  const [detaildata, setDetaildata] = useState([]);
  
  console.log(detailid);
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
    navigate("/solution/datawarehouse/joinus");
  }; 


  /*============== jobDetail =================== */
  const jobDetail = async () => {
      if (!id) return; // เช็คว่ามี id หรือไม่

      try {
        const res = await Axios.get(url + "/jobDetail/" + id);
          if (res.status === 200) {
            const fetchedData = res.data; // ข้อมูลที่ได้จาก API
            console.log("Data loaded:", fetchedData);

            // 1. Set ข้อมูลหลักลงใน data
            setData({
              id: fetchedData.id, // เก็บ id ไว้เพื่อใช้ตอน Update (PUT)
              positionEn: fetchedData.positionEn || "",
              positionTh: fetchedData.positionTh || "",
              createBy: fetchedData.createBy || user.name,
              show: fetchedData.show,
              urgent: fetchedData.urgent || false,
            });

            // 2. Set ข้อมูล Qualifications (ตรวจสอบว่ามีข้อมูลไหม ถ้าไม่มีให้ใช้ค่าเริ่มต้น)
            if (fetchedData.quals && fetchedData.quals.length > 0) {
              setQuals(fetchedData.quals);
            } else {
              setQuals([initQual]); // ถ้าว่างให้โชว์ 1 แถวว่างๆ
            }

            // 3. Set ข้อมูล Descriptions
            if (fetchedData.descs && fetchedData.descs.length > 0) {
              setDescs(fetchedData.descs);
            } else {
              setDescs([initDesc]);
            }
          }
      } catch (err) {
        console.error(err);      
      }
  };

  useEffect(() => {
    if (id) {
      jobDetail();
      setDetailid(id);
    } else {
      // ถ้า URL ไม่มี id ให้มั่นใจว่าฟอร์มว่างเปล่า
      setData(initData);
      setQuals([{ qualEn: "", qualTh: "", rank: 1 }]);
      setDetailid(null);
    }
  }, [id]); // เฝ้าดูการเปลี่ยนแปลงของ URL id

  console.log(detaildata);

  /* ================== Save Edit ================== */
  const EditData = async () => {
      alert("ok");
  }   
 
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

                <textarea
                  className="border border-[#b3b3b3] w-65 rounded-md px-2 py-1 focus:outline-none focus:shadow-[0_0_0_0.2rem_white,0_0_5px_0.25rem_red] focus:border-white"
                  rows={3}
                  value={q.qualEn}
                  onChange={(e) =>
                    changeQual(index, "qualEn", e.target.value)
                  }
                />
                <div className="flex items-end gap-2">

                  <textarea
                    className="border border-[#b3b3b3] w-full rounded-md px-2 py-1 focus:outline-none focus:shadow-[0_0_0_0.2rem_white,0_0_5px_0.25rem_red] focus:border-white"
                    rows={3}
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
                  
                <textarea
                  className="border border-[#b3b3b3] w-65 rounded-md px-2 py-1 focus:outline-none focus:shadow-[0_0_0_0.2rem_white,0_0_5px_0.25rem_red] focus:border-white"
                  rows={3}
                  value={d.descEn}
                  onChange={(e) =>
                    changeDesc(index, "descEn", e.target.value)
                  }
                />

                <div className="flex items-end gap-2">
                  <textarea
                    className="border border-[#b3b3b3] w-full rounded-md px-2 py-1 focus:outline-none focus:shadow-[0_0_0_0.2rem_white,0_0_5px_0.25rem_red] focus:border-white"
                    rows={3}
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

        {id ? (            
            <button
              className="btn-green px-4"
              onClick={EditData}
            >
              Save Edit
            </button>
          ) : (
           
            <button
              className={`btn-green px-4 ${
                !isFormValid && "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isFormValid}
              onClick={submitData}
            >
              Add Job
            </button>
          )}
       
      </div>  

      <div className="mt-5">
        <JobList reload={reloadFlag} />
      </div>

    
    </section>
  );
}
