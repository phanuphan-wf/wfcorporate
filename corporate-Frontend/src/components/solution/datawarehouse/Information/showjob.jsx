import { useState, useEffect } from "react";
import Axios from "axios";

export default function ShowJob(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;
  const [jobsList, setJobsList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  

  //console.log(selectedIds);

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
  }, [props.reload]);
  
  useEffect(() => {
    if (jobsList.length > 0) {
        const ids = jobsList.map(job => job.id);
        setSelectedIds(ids);
    }
  }, [jobsList]);


  return (
    <section className="Show Job">
      <div className="font-medium text-lg mb-3">Job List</div>

      <table className="w-full border border-neutral-600">
        <thead>
          <tr className="border-b border-neutral-600 bg-gray-100">
            <th></th>
            <th className="border-l border-neutral-600 p-2">Position (EN)</th>
            <th className="border-l border-neutral-600 p-2">Position (TH)</th>
            <th className="border-l border-neutral-600 p-2">Urgent</th>
            <th className="border-l border-neutral-600 p-2">Create At</th>
          </tr>
        </thead>

        <tbody>
          {jobsList.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No data
              </td>
            </tr>
          )}

          {jobsList.map((job) => (
            <tr>
              <td className="border-b border-neutral-600 p-2 text-center">
                <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 cursor-pointer"
                />
              </td>

              <td className="border-b border-neutral-600 p-2 text-center">{job.positionEn}</td>
              <td className="border-b border-neutral-600 p-2 text-center">{job.positionTh}</td>

              <td className="border-b border-neutral-600 p-2 text-center">
                {job.urgent ? (
                  <span className="px-2 py-1 bg-red-500 text-white rounded text-sm">
                    Urgent
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-500 text-white rounded text-sm">
                    Normal
                  </span>
                )}
              </td>

              <td className="border-b border-neutral-600 p-2 text-center">
                {new Date(job.createAt).toLocaleString("th-TH")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
