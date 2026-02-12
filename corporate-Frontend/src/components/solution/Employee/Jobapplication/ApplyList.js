import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

//import { MdFiberNew } from "react-icons/md";

export default function ApplyList(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;
  const nav = useNavigate();

  const [applyList, setApplyList] = useState([]); 
  const [jobNameList, setJobNameList] = useState([]);

 const [filterJob, setFilterJob] = useState(localStorage.getItem("filterJob") || "");
 const [statusJob, setStatusJob] = useState(localStorage.getItem("statusJob") || "");


  const getApplyList = async () => {
    try {
      const res = await axios.get(url + "/getapplylist");
      if (res.status === 200) {
        setApplyList(res.data);        
      }
    } catch (err) {
      console.error("getApplyList error:", err);
    }
  };

  useEffect(() => {
    getApplyList();
  }, [props.reload]);


  const getJobsName = async () => {
    try {
      const res = await axios.get(url + "/getJobs");
      if (res.status === 200) {
        setJobNameList(res.data);
      }
    } catch (error) {
      console.error("GET JOBS ERROR:", error);
    }
  };

   useEffect(() =>{
     getJobsName();    
   }, []);

  const filteredData = applyList.filter((app) => {    

      const isJobMatch = filterJob === "" || app.jobName === filterJob;  
      let isStatusMatch = true;
      if (statusJob === "new") {        
        isStatusMatch = app.watch === null;
      } 
      else if (statusJob === "old") {       
        isStatusMatch = app.watch !== null;
      }
    
      return isJobMatch && isStatusMatch;
  });

   const handleClear = () =>{
      setFilterJob("");
      setStatusJob("");
      localStorage.removeItem("filterJob");
      localStorage.removeItem("statusJob");
   };

  return (
    <section className="ApplyList p-4">   
      
       <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">          
          <div className="text-xl md:text-3xl font-bold text-neutral-800">
            Job List
          </div>

        
          <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
            
         
            <div className="w-full md:w-56">        
              <select 
                id="jobName" 
                value={filterJob}
                className="block w-full px-3 py-2.5 bg-white border border-neutral-300 text-neutral-700 text-sm rounded-md focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-sm outline-none transition-all"
                onChange={(e) => { 
                  setFilterJob(e.target.value);
                  localStorage.setItem("filterJob", e.target.value);
                }}
              >
                <option value="">Select JobName</option>
                {jobNameList && jobNameList.map((job, index) => (
                    <option key={index} value={job.positionTh}>
                      {job.positionEn}
                    </option>
                ))}
               
              </select>
            </div>

           
            <div className="w-full md:w-44">        
              <select 
                id="status" 
                value={statusJob}
                className="block w-full px-3 py-2.5 bg-white border border-neutral-300 text-neutral-700 text-sm rounded-md focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-sm outline-none transition-all"
                onChange={(e) => {
                  setStatusJob(e.target.value);
                  localStorage.setItem("statusJob", e.target.value);
                }}
              >
                <option value="">Select Status</option>
                <option value="new">New Apply</option>
                <option value="old">Previous Apply</option>          
              </select>
            </div>

         
           <button 
              onClick={handleClear}
              className="w-full md:w-auto px-6 py-2.5 btn-primary h-[42px] flex items-center justify-center active:scale-95 transition-transform">
                Clear
            </button>

          </div>
        </div>

      <div className="visitor-search border-t">

        <div className="my-3 w-full overflow-x-auto">
          <table className="w-full text-sm sm:text-base border-collapse border-l-2 border-r border-b">
            <thead>
              <tr className="bg-slate-300">  
                <th className="border p-2">Full Name</th>              
                <th className="border p-2">Mobile</th>
                <th className="border p-2">JobName</th>
                <th className="border p-2">ApplyDate</th>
               
              </tr>
            </thead>

            <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((app, i) => (
                  <tr  
                    key={app.id}                  
                    className="odd:bg-white even:bg-slate-50 hover:bg-red-300 transition-colors cursor-pointer group border-b"
                    onClick={() => nav("/solution/management/jobapplication/jobform/" + app.id, { state: { watch: app.watch } })}
                  >      
                                
                    <td className="border p-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                      
                        {!app.watch && (
                          <button className="text-[8px] px-1.5 py-0.5 btn-primary  flex items-center gap-1 active:scale-95"> NEW</button>
                        )}   
                    
                        <span className="font-medium text-neutral-700 transition-colors">
                          {app.name} {app.surname}
                        </span>
                      </div>
                    </td>
                  
                    <td className="border p-2 text-center">{app.mobile}</td>
                    <td className="border p-2 text-center">{app.jobName}</td>
                    <td className="border p-2 text-center">
                      {new Date(app.applyDate).toLocaleDateString()}
                    </td>
                    
                  </tr>
                ))) : (
                 
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-neutral-400 bg-white">
                      No Information Data
                    </td>
                  </tr>
                )}
            </tbody>
                        
          </table>                

        </div>
      </div>

      
    </section>
  );
}