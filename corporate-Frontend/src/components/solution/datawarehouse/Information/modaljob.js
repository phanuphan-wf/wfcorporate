import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router";

export default function ModalJob({ jobId, isOpen, onClose }) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;

  const nav = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getJob = async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await Axios.get(url + "/jobDetail/" + jobId);
      if (res.status === 200) {
        setJob(res.data);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) getJob();
  }, [jobId, isOpen]);

  if (!isOpen) return null;   
  

 return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative z-10 w-11/12 max-w-2xl bg-white rounded shadow-lg p-6">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-2">
          <h3 className="text-lg font-semibold text-black">
            {job?.positionEn} — {job?.positionTh}
          </h3>
          <button onClick={onClose} className="ml-4 text-gray-600 hover:text-gray-900">✕</button>
        </div>

        {/* Body Content */}
        <div className="mt-4 space-y-6 text-sm text-gray-800 max-h-[60vh] overflow-y-auto pr-2">
          {loading && <div className="text-center py-4 text-slate-500">Loading information...</div>}
          {error && <div className="text-red-600 text-center">Error loading data</div>}
          
          {!loading && !error && job && (
            <>
              {/* Position Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-2 rounded">
                  <label className="font-bold block mb-1 text-slate-500">Position (EN)</label>
                  <div className="text-base">{job.positionEn || "-"}</div>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <label className="font-bold block mb-1 text-slate-500">Position (TH)</label>
                  <div className="text-base">{job.positionTh || "-"}</div>
                </div>
              </div>

              {/* Qualifications Row */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-blue-500 pl-3">
                  <div>
                    <label className="font-bold block mb-1 text-blue-600">Qualifications (EN)</label>
                    <ul className="list-disc list-inside space-y-1">
                      {job.quals?.map((q, idx) => (
                        <li key={idx} className="text-gray-700">{q.qualEn || "-"}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-blue-600">Qualifications (TH)</label>
                    <ul className="list-disc list-inside space-y-1">
                      {job.quals?.map((q, idx) => (
                        <li key={idx} className="text-gray-700">{q.qualTh || "-"}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Descriptions Row */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-green-500 pl-3">
                  <div>
                    <label className="font-bold block mb-1 text-green-600">Job Descriptions (EN)</label>
                    <ul className="list-disc list-inside space-y-1">
                      {job.descs?.map((d, idx) => (
                        <li key={idx} className="text-gray-700">{d.descEn || "-"}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-green-600">Job Descriptions (TH)</label>
                    <ul className="list-disc list-inside space-y-1">
                      {job.descs?.map((d, idx) => (
                        <li key={idx} className="text-gray-700">{d.descTh || "-"}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Priority Status */}
              <div className="flex items-center gap-3 pt-2 border-t text-xs">
                <span className="font-bold uppercase text-slate-400">Status:</span>
                {job.urgent ? (
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">URGENT</span>
                ) : (
                  <span className="bg-green-500 text-white px-2 py-0.5 rounded-full">Normal</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-between items-center border-t pt-4">
          <button            
            onClick={() => {
              nav("/solution/datawarehouse/joinus/" + job.id); // 1. พาไปหน้า Edit
              onClose(); // 2. สั่งปิด Modal (เพื่อไม่ให้มันค้างตอนเปลี่ยนหน้า)
            }}
            className="px-6 py-2 btn-primary"
          >
            Edit
          </button>
          <button 
            onClick={onClose} 
            className="px-6 py-2 btn-gray"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );

}