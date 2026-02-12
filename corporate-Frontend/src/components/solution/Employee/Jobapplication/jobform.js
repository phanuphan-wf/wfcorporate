import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

import { IoIosArrowBack } from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";

export default function Jobform() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;
  const { id } = useParams();
  const location = useLocation();
  const watch = location.state?.watch;

  const [applyDetail, setApplyDetail] = useState({});
  //const [showPDF, setShowPDF] = useState(false);

  const getJobform = async () => {
    try {
      const res = await axios.get(url + "/getApply/" + id);
      if (res.status === 200) {
        setApplyDetail(res.data);
      }
      if (watch === null) {
        await axios.put(url + "/putWatch/" + id);
      }
    } catch (err) {
      console.error("getApply error:", err);
    }
  };

  useEffect(() => {
    getJobform();
  }, [id]);

  return (
  
    <section className="ApplyList p-4 md:p-8 bg-white min-h-screen text-neutral-800">      
    
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold text-neutral-900">
          Job Application Form
        </h1>
        <button 
          onClick={() => window.history.back()}
      
          className="text-sm px-4 py-2 btn-primary  flex items-center gap-1 active:scale-95"
        >
          <IoIosArrowBack className="text-lg" /> 
          <span>Back</span>

        </button>
      </div>

     
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-neutral-200 overflow-hidden">
        {applyDetail?.apply ? (
          <div className="p-6 md:p-10">
            
       
            <section className="mb-5">
              <h3 className="text-lg font-bold text-blue-600 mb-6 border-l-4 border-blue-600 pl-3 uppercase tracking-wide">
                Personal Information
              </h3>
              
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="shrink-0">
                  <img 
                    // ใช้ Backticks ครอบ URL ทั้งหมดและใส่ ${ตัวแปร}
                    src={`https://worldfair.blob.core.windows.net/jobapply/${applyDetail.apply.picture}`} 
                    alt="Profile"
                    className="w-40 h-52 rounded-xl object-cover shadow-lg border-4 border-white ring-1 ring-neutral-200"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150?text=No+Image"; 
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm w-full">
                  <div>
                    <p className="text-neutral-500 text-xs mb-1">Full Name</p>
                    <p className="font-semibold text-base text-neutral-900">{applyDetail.apply.name} {applyDetail.apply.surname}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-xs mb-1">Sex</p>
                    <p className="font-semibold text-base text-neutral-900">{applyDetail.apply.sex || "-"}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-xs mb-1">Mobile</p>
                    <p className="font-semibold text-sm text-blue-600">{applyDetail.apply.mobile}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-xs mb-1">JobName</p>
                    <p className="font-semibold text-sm text-blue-600">
                      {applyDetail.apply.job}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-neutral-500 text-xs mb-1">Current Address</p>
                    <p className="font-medium text-neutral-700 leading-relaxed">
                      {applyDetail.apply.addr} {applyDetail.apply.subdistrict} {applyDetail.apply.district} {applyDetail.apply.province}
                    </p>
                  </div>
                </div>
              </div>
            </section>        

          
            {applyDetail.apply.resume ? (
              <section className="py-2 bg-neutral-50 rounded-xl flex flex-col items-center border border-neutral-100"> 
                <a
                  href={`https://worldfair.blob.core.windows.net/resume/${applyDetail.apply.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-lg shadow-red-100 transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-2xl"><FaFileAlt /></span>
                  <span className="font-bold uppercase tracking-wide">Resume</span>
                </a>
              </section>
              
            ) : (
              <div className="space-y-8">
              
                <section>
                  <h3 className="text-lg font-bold text-green-600 mb-4 border-l-4 border-green-600 pl-3">
                    EDUCATION
                  </h3>
                  {applyDetail.eddu && applyDetail.eddu.length > 0 ? (
                    <div className="grid gap-3">
                      {applyDetail.eddu.map((edu, index) => (
                        <div key={index} className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
                          <div className="font-bold text-neutral-800">
                            {edu.level} - {edu.subject}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {edu.institute} (Year {edu.gYear})
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-400 italic"></p>
                  )}
                </section>

                {/* ประวัติการทำงาน */}
                <section>
                  <h3 className="text-lg font-bold text-purple-600 mb-4 border-l-4 border-purple-600 pl-3">                   
                    WORK EXPERIENCE
                  </h3>
                  {applyDetail.hist && applyDetail.hist.length > 0 ? (
                    <div className="grid gap-4">
                      {applyDetail.hist.map((work, index) => (
                        <div key={index} className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
                                                   

                          <div className="font-semibold text-sm mb-2 text-neutral-800">
                            <span className="font-semibold text-sm mb-2 text-neutral-400"> Working Year :</span> {work.wYear}  
                          </div>

                          <div className="font-semibold text-sm mb-2 text-neutral-800">
                            <span className="font-semibold text-sm mb-2 text-neutral-400"> Company :</span> {work.company}    
                          </div>

                          <div className="font-semibold text-sm mb-2 text-neutral-800">
                            <span className="font-semibold text-sm mb-2 text-neutral-400">Position :</span> {work.position}
                          </div>

                          <div className="font-semibold text-sm mb-2 text-neutral-800">
                            <span className="font-semibold text-sm mb-2 text-neutral-400">Function :</span> {work.funct}
                          </div>
                         
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-400 italic"></p>
                  )}
                </section>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 bg-white">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-neutral-500 italic"></p>
          </div>
        )}
      </div>
    </section>
  );
}