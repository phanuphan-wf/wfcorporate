import React, { useState,useEffect} from "react";
import { useNavigate } from "react-router";
import Axios from "axios";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function Jobdescription() {

  const { id } = useParams();
  
  const nav = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;
  const [jobdescription, setJobdescription] = useState("");
  
  console.log(jobdescription);

  const jobdetail = async () => {
    try {
      const res = await Axios.get(url + "/jobdetail/" + id);
      if (res.status === 200) {
        setJobdescription(res.data);
      }
    } catch (error) {
      console.error("JOBS ERROR:", error);
    }
  };

  useEffect(() => {
    jobdetail();    
  }, []);      




  return (
    <section className="join my-10">
      <div className="headline mb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-center">
             {lang === "th" ? "ร่วมงานกับเรา" : "Join Us"} 
          </h1>
        </div>
        <div className="flex justify-center py-4 mb-5">
          <svg height={10} width={160}>
            <line
              x1="0"
              y1="0"
              x2="160"
              y2="0"
              style={{ stroke: "rgb(255,0,0)", strokeWidth: "5px" }}
            />
          </svg>
        </div>
      </div>   

      <div className="px-4 sm:px-11 lg:px-20 xl:px-28 my-6">
        {jobdescription && (
          <div
            className="flex flex-col md:flex-row gap-6
                      w-full sm:w-[90%] lg:w-4/5 mx-auto mb-10"
          >
            {/* LEFT CONTENT */}
            <div className="flex-1">

              {/* POSITION */}
              <h2 className="text-xl font-semibold mb-4">
                {lang === "th" ? "ตำแหน่ง :" : "Position :"}{" "}
                {lang === "th"
                  ? jobdescription.positionTh
                  : jobdescription.positionEn}
              </h2>

              {/* QUALIFICATIONS */}
              <h3 className="font-semibold mb-2">
                {lang === "th" ? "คุณสมบัติ" : "Qualifications"}
              </h3>
              <ul className="list-disc pl-5 mb-5 space-y-1">
                {jobdescription.quals?.map((q, i) => (
                  <li key={i}>
                    {lang === "th" ? q.qualTh : q.qualEn}
                  </li>
                ))}
              </ul>

              {/* DESCRIPTIONS */}
              <h3 className="font-semibold mb-2">
                {lang === "th" ? "รายละเอียดงาน" : "Job Description"}
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-6">
                {jobdescription.descs?.map((d, i) => (
                  <li key={i}>
                    {lang === "th" ? d.descTh : d.descEn}
                  </li>
                ))}
              </ul>

              {/* ACTION BUTTON */}
              <div className="flex">
                <button
                  type="button"
                  onClick={() => nav("/joinus/jobform/" + jobdescription.id)}
                  className="w-full py-2 text-white bg-red-500
                            hover:bg-red-600 transition"
                >
                  {lang === "th" ? "ส่งใบสมัคร" : "Apply"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
   
     
    </section>
  );
}
