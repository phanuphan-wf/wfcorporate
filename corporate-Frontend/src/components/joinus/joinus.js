import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Axios from "axios";
import { useTranslation } from "react-i18next";

export default function Joinus(props) {
  const nav = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;
  const [jobsList, setJobsList] = useState([]);
    
  const getJobs = async () => {
    try {
      const res = await Axios.get(url + "/getJobs");
      if (res.status === 200) {
        setJobsList(res.data);
      }
    } catch (error) {
      console.error("GET JOBS ERROR:", error);
    }
  };

   useEffect(() => {
      getJobs();    
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
      <div className="lg:container px-4">
        <img
          src={require("./img/joinwf.png")}
          alt="joinus"
          id="joinwf"
          className="block mx-auto"
        />
      </div>
      
      <div className="px-4 sm:px-11 lg:px-20 xl:px-28 my-6">      

        <p className="w-full sm:w-3/4 md:w-2/3 text-center mx-auto mb-6">
          {lang === "th"
            ? "เราผู้ดำเนินธุรกิจด้านการจัดงานแสดงสินค้าและออร์กาไนเซอร์ที่มีประสบการณ์มากกว่า 40 ปี เราเป็นผู้นำด้านการจัดงานแสดงสินค้าเฟอร์นิเจอร์และของตกแต่งบ้านของประเทศไทยอาทิเช่น Home Mega Show , Furniture Mega Show, Home Décor, Bangkok Furniture Fair, Furniture Living & Design, เฟอร์นิเจอร์โชว์, เฟอร์นิเจอร์แฟร์, และ Furniture Fair": "We are an exhibition organizer with over 40 years of experience. We are a leading organizer of furniture and home decoration exhibitions in Thailand, such as Home Mega Show, Furniture Mega Show, Home Décor, Bangkok Furniture Fair, Furniture Living & Design, Furniture Show, Furniture Fair."
          }
        </p>
        
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-5 w-full sm:w-[90%] lg:w-4/5 mx-auto">
          <div className="md:col-span-2 py-1 bg-slate-200 text-center">
           {lang === "th" ? "ตำแหน่งที่เปิดรับ" : "Job Openings"} 
          </div>
          <div className="py-1 bg-slate-200 text-center hidden md:block">
            {lang === "th" ? "สนใจฝากข้อมูล" : "Job Register"} 
          </div>
        </div>

        {jobsList.map((job, i) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full sm:w-[90%] lg:w-4/5 mx-auto mt-5 mb-3">
            <div
              className={`text-center sm:text-left md:col-span-2 ${
                job.urgent && "text-red-500"}`}
            >
              {lang === "th" ? job.positionTh : job.positionEn}
              {job.urgent && (lang === "th" ? " ** ด่วน!" : " URGENT!")}

            </div>
            <div className="grid grid-cols-2 gap-4 w-1/2 sm:w-full mx-auto">
              
              <button
                type="button"
                onClick={() => nav("/joinus/jobdescription/" + job.id)}
                className="text-white bg-red-500 text-center py-1 cursor-pointer
                          hover:bg-red-600 transition"
              >
                {lang === "th" ? "รายละเอียด" : "Detail"}
              </button>

              <button
                 type="button"  
                 onClick={() => nav("/joinus/jobform/" + job.id)}
                 className="text-white bg-red-500 text-center py-1 cursor-pointer
                             hover:bg-red-600 transition" 

              >   
                {lang === "th" ? "ส่งใบสมัคร" : "Quick Apply"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
