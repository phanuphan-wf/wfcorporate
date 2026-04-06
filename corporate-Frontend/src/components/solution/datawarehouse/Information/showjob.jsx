import { useState, useEffect } from "react";
import Axios from "axios";
import ModalJob from "./modaljob";

export default function ShowJob(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;

  const [jobsList, setJobsList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [addjobsIds, setAddjobsIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    if (jobsList.length > 0) {
      const defaultIds = jobsList.filter((job) => job.show === true).map((job) => job.id);
      setSelectedIds(defaultIds);
      setAddjobsIds(defaultIds);
    }
  }, [jobsList]);

  const isChanged =
    selectedIds.length > 0 && (selectedIds.length !== addjobsIds.length || selectedIds.some((id) => !addjobsIds.includes(id)));

  const getJobs = async () => {
    try {
      const res = await Axios.get(url + "/JobsList");
      if (res.status === 200) setJobsList(res.data || []);
    } catch (error) {
      console.error("GET JOBS ERROR:", error);
    }
  };

  useEffect(() => {
    getJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.reload]);

  const CheckboxChange = (jobId) => {
    setSelectedIds((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]));
  };

  const openModal = (job) => {
    setActiveJob(job);
    setModalOpen(true);
  };

  const closeModal = (saved = false) => {
    setModalOpen(false);
    setActiveJob(null);
    if (saved) getJobs();
  };

  const saveJob = async () => {
    if (!isChanged) return;
    try {
      const res = await Axios.put(url + "/jobsSelect", selectedIds);
      if (res.status === 200) {
        alert("Data successfully saved.");
        getJobs();
      }
    } catch (err) {
      console.error(err);
      alert("error");
    }
  };

  

  return (
    <section className="Show Job">
      <div className="flex items-center gap-2">
        <div className="font-medium text-lg">Job List</div>
        <button className={`px-4 btn-primary ${isChanged ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`} disabled={!isChanged} onClick={saveJob}>
          Save
        </button>
      </div>

      <table className="w-full border border-neutral-600 mt-4">
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
              <td colSpan="5" className="text-center p-4">
                No data
              </td>
            </tr>
          )}

          {jobsList.map((job) => (
            <tr key={job.id} className={selectedIds.includes(job.id) ? "bg-red-100" : ""}>
              <td className="border-b border-neutral-600 p-2 text-center">
                <input type="checkbox" checked={selectedIds.includes(job.id)} onChange={() => CheckboxChange(job.id)} className="w-4 h-4 cursor-pointer" />
              </td>

              <td className="border-b border-neutral-600 p-2 text-center cursor-pointer hover:underline" onClick={() => openModal(job)}>
                {job.positionEn}
              </td>
              <td className="border-b border-neutral-600 p-2 text-center cursor-pointer hover:underline" onClick={() => openModal(job)}>
                {job.positionTh}
              </td>

              <td className="border-b border-neutral-600 p-2 text-center">
                {job.urgent ? <span className="px-2 py-1 bg-red-500 text-white rounded text-sm">Urgent</span> : <span className="px-2 py-1 bg-green-500 text-white rounded text-sm">Normal</span>}
              </td>

              <td className="border-b border-neutral-600 p-2 text-center">{job.createAt ? new Date(job.createAt).toLocaleString("th-TH") : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalJob 
        jobId={activeJob?.id} 
        isOpen={modalOpen} 
        onClose={(result) => {
            closeModal(result);
            setModalOpen(false);    
          } 
        }
        
      />
    </section>
  );
}
