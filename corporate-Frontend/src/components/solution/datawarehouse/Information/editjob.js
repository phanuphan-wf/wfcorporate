import React, { useState, useEffect } from "react";
import Axios from "axios";
import { IoAddCircle } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";

export default function EditJob({ jobId, onCancel, onUpdateSuccess }) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;
  const user = JSON.parse(localStorage.getItem("user"));

  // State สำหรับเก็บข้อมูลที่ดึงมาจาก Database
  const [data, setData] = useState(null);
  const [quals, setQuals] = useState([]);
  const [descs, setDescs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูลงานจาก ID เมื่อ Component นี้ถูกเรียก
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await Axios.get(`${url}/getJob/${jobId}`);
        if (res.status === 200) {
          setData(res.data);
          setQuals(res.data.quals || []);
          setDescs(res.data.descs || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  // 2. ฟังก์ชัน Submit (ใช้ PUT แทน POST)
  const handleUpdate = async () => {
    const payload = {
      ...data,
      quals: quals,
      descs: descs,
      updateBy: user.name // เก็บประวัติคนแก้ไข
    };

    try {
      const res = await Axios.put(`${url}/updateJob/${jobId}`, payload);
      if (res.status === 200) {
        alert("Update Success!");
        onUpdateSuccess(); // บอกไฟล์หลักให้รีเฟรชตารางและปิดหน้าแก้ไข
      }
    } catch (err) {
      alert("Update Failed");
    }
  };

  if (loading) return <div>Loading data...</div>;
  if (!data) return <div>No data found.</div>;

  return (
    <section className="p-4 border border-orange-400 rounded-md bg-orange-50/30">
      <div className="text-xl mb-4 font-bold text-orange-600">Edit Job ID: {jobId}</div>
      
      {/* ฟอร์ม Input ต่างๆ (Copy มาจาก CreateJob ได้เลย) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Position Eng</label>
            <input 
                className="w-full border p-2" 
                value={data.positionEn} 
                onChange={(e) => setData({...data, positionEn: e.target.value})}
            />
          </div>
          {/* ... ส่วนของ Quals และ Descs เหมือนเดิม ... */}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button className="btn-gray" onClick={onCancel}>Cancel</button>
        <button className="bg-orange-500 text-white px-6 py-2 rounded" onClick={handleUpdate}>
          Save Changes
        </button>
      </div>
    </section>
  );
}