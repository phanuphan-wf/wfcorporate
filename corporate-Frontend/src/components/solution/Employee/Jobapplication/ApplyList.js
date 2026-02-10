import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";


import { MdFiberNew } from "react-icons/md";


export default function ApplyList(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;
  const nav = useNavigate();

  const [applyList, setApplyList] = useState([]); 
 
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

  return (
    <section className="ApplyList p-4">
      <div className="text-xl md:text-3xl font-medium mb-4">Job Applications</div>

      <div className="visitor-search border-t">
        <div className="my-3 w-full overflow-x-auto">
          <table className="w-full text-sm sm:text-base border-collapse">
            <thead>
              <tr className="bg-slate-300">    
                <th className="border p-2">Watch</th>        
                <th className="border p-2">Full Name</th>
              
                <th className="border p-2">Mobile</th>
                <th className="border p-2">JobName</th>
                <th className="border p-2">ApplyDate</th>
               
              </tr>
            </thead>

            <tbody>
              {applyList.map((app, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">   
                  <td className="border p-2">
                    <div
                      className="flex items-center justify-center gap-2 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => nav("/solution/management/jobapplication/jobform/" + app.id)}

                    >
                      {!app.watch && (
                        <MdFiberNew size={30} className="text-red-500" />
                      )}
                     
                    </div>

                  </td>
                               
                  <td className="border p-2 text-center  cursor-pointer hover:scale-110 transition-transform" 
                     onClick={() => nav("/solution/management/jobapplication/jobform/" + app.id, { state: { watch: app.watch } })}
                  >{app.name} {app.surname}
                  </td>
                 
                  <td className="border p-2 text-center">{app.mobile}</td>
                  <td className="border p-2 text-center">{app.jobName}</td>
                  <td className="border p-2 text-center">
                    {new Date(app.applyDate).toLocaleDateString()}
                  </td>
                  
                </tr>
              ))}
            </tbody>

            
          </table>       

              

        </div>
      </div>
    </section>
  );
}