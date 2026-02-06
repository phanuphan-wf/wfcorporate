import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ModalApply({ show, id, watch, onClose, onReload}) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;  
  
  const [applyDetail, setApplyDetail] = useState(null); 


  useEffect(() => {
    if (!show || !id) return;

    const fetchDetail = async () => {
      try {
        const res = await axios.get(url + "/getApply/" + id);
        if (res.status === 200) {
          setApplyDetail(res.data);
        }

        if (watch === null) {
            await axios.put(url + "/putWatch/" + id);             
            if (onReload) { 
                onReload();
            }          
        }

      } catch (err) {
        console.error("Fetch Detail Error:", err);
      }
    };

    fetchDetail();
  }, [id, show, url]);


 
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-neutral-800 dark:text-neutral-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b dark:border-neutral-700 flex justify-between items-center bg-slate-50 dark:bg-neutral-800">
          <h2 className="text-lg font-semibold">Job Application Form</h2>
          <button onClick={onClose} className="text-xl hover:text-red-500 transition-colors">✕</button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* 2. เช็คว่ามีข้อมูลหรือยังก่อนจะ Render (สำคัญมาก) */}
          {applyDetail?.apply ? (
            <>
              <section className="mb-6">
                <h3 className="text-lg font-bold text-blue-600 mb-3 border-l-4 border-blue-600 pl-2 uppercase tracking-wide">
                  ข้อมูลส่วนตัว
                </h3>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <div className="col-span-1">
                    <p className="text-neutral-500 text-xs">ชื่อ-นามสกุล</p>
                    <p className="font-medium">{applyDetail.apply.name} {applyDetail.apply.surname}</p>
                  </div>

                  <div className="col-span-1">
                    <p className="text-neutral-500 text-xs">เพศ</p>
                    <p className="font-medium">{applyDetail.apply.sex || "-"}</p>
                  </div>

                  <div className="col-span-1">
                    <p className="text-neutral-500 text-xs">เบอร์โทร</p>
                    <p className="font-medium">{applyDetail.apply.mobile}</p>
                  </div>

                  <div className="col-span-1">
                    <p className="text-neutral-500 text-xs">ตำแหน่งที่สมัคร</p>
                    <p className="font-medium text-blue-500">{applyDetail.apply.job}</p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-neutral-500 text-xs">ที่อยู่</p>
                    <p className="font-medium">
                      {applyDetail.apply.addr} {applyDetail.apply.subdistrict} {applyDetail.apply.district} {applyDetail.apply.province}
                    </p>
                  </div>
                  
                </div>
              </section>

              <section className="mb-6 border-b pb-4">
                <h3 className="text-lg font-bold text-green-600 mb-3 border-l-4 border-green-600 pl-2">
                    ประวัติการศึกษา
                </h3>

                {applyDetail.eddu && applyDetail.eddu.length > 0 ? (
                    applyDetail.eddu.map((edu, index) => (
                    <div key={index} className="text-sm mb-3">
                        <div className="font-semibold text-neutral-700 dark:text-neutral-300">
                        {edu.level} - {edu.subject}
                        </div>
                        <div>
                        {edu.institute} (จบปี {edu.gYear})
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="text-sm text-neutral-500">ไม่มีข้อมูลการศึกษา</div>
                )}
                </section>

                <section>
                    <h3 className="text-lg font-bold text-purple-600 mb-3 border-l-4 border-purple-600 pl-2">
                        ประวัติการทำงาน
                    </h3>

                    {applyDetail.hist && applyDetail.hist.length > 0 ? (
                        applyDetail.hist.map((work, index) => (
                        <div
                            key={index}
                            className="text-sm mb-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded"
                        >
                            <div className="text-l text-neutral-500">
                               ช่วงปีที่ทำงาน : {work.wYear}
                            </div>
                            <div className="text-blue-500">
                              บริษัท :  {work.company}
                            </div>

                            <div className="font-semibold">
                              ตำแหน่ง : {work.position}
                            </div>                          
                           
                            <div className="mt-1">
                                <span className="font-medium text-xs">หน้าที่:</span>{" "}
                                {work.funct}
                            </div>
                            
                        </div>
                        ))
                    ) : (
                        <div className="text-sm text-neutral-500">ไม่มีข้อมูลประสบการณ์ทำงาน</div>
                    )}
                </section>



              
            </>
          ) : (
            <div className="flex flex-col items-center py-10">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
               <p className="text-sm text-neutral-500">กำลังโหลดข้อมูล...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800 text-right border-t dark:border-neutral-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}