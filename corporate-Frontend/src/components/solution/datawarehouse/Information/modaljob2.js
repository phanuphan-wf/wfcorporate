import React, { useState, useEffect } from "react";
import Axios from "axios";

export default function ModalJob({ jobId, isOpen, onClose }) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    jobId: null,
    positionEn: "",
    positionTh: "",
    show: true,
    urgent: false,
    descs: [],
    quals: [],
  });

  

  useEffect(() => {
    if (!isOpen || !jobId) return;
    let cancelled = false;
    const getJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await Axios.get(url + "/jobDetail/" + jobId);
        if (!cancelled) {
          setJob(res.data);
          setFormData({
            jobId: res.data.id,
            positionEn: res.data.positionEn || "",
            positionTh: res.data.positionTh || "",
            show: res.data.show !== undefined ? res.data.show : true,
            urgent: res.data.urgent !== undefined ? res.data.urgent : false,
            descs: res.data.descs || [],
            quals: res.data.quals || [],
          });
          setEditMode(false);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    getJob();
    return () => {
      cancelled = true;
    };
  }, [isOpen, jobId, url]);

  if (!isOpen) return null;

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDescChange = (idx, field, value) => {
    const newDescs = [...formData.descs];
    newDescs[idx] = { ...newDescs[idx], [field]: value };
    setFormData((prev) => ({ ...prev, descs: newDescs }));
  };

  const handleQualChange = (idx, field, value) => {
    const newQuals = [...formData.quals];
    newQuals[idx] = { ...newQuals[idx], [field]: value };
    setFormData((prev) => ({ ...prev, quals: newQuals }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await Axios.put(url + "/UpdateJob", formData);
      if (res.status === 200) {
        alert("Job updated successfully");
        setJob(formData);
        setEditMode(false);
        onClose(true);
      }
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative z-10 w-11/12 max-w-2xl bg-white rounded shadow-lg p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">
            {job?.positionEn} — {job?.positionTh}
          </h3>
          <button
            onClick={onClose}
            className="ml-4 text-gray-600 hover:text-gray-900"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm text-gray-800">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-600">Error loading data</div>}
          {!loading && !error && job && !editMode && (
            <>
              <div>
                <strong>Position (EN):</strong>
                <div>{job.positionEn || "-"}</div>
              </div>
              <div>
                <strong>Position (TH):</strong>
                <div>{job.positionTh || "-"}</div>
              </div>

              <div className="mt-4">
                <strong>Qualifications:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {job.quals && job.quals.length > 0 ? (
                    job.quals.map((q, idx) => (
                      <li key={idx}>
                        <span className="text-gray-700">{q.qualEn}</span>
                        {q.qualTh && q.qualTh !== q.qualEn && (
                          <div className="ml-5 text-gray-600">{q.qualTh}</div>
                        )}
                      </li>
                    ))
                  ) : (
                    <li>-</li>
                  )}
                </ul>
              </div>

              <div className="mt-4">
                <strong>Descriptions:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {job.descs && job.descs.length > 0 ? (
                    job.descs.map((d, idx) => (
                      <li key={idx}>
                        <span className="text-gray-700">{d.descEn}</span>
                        {d.descTh && d.descTh !== d.descEn && (
                          <div className="ml-5 text-gray-600">{d.descTh}</div>
                        )}
                      </li>
                    ))
                  ) : (
                    <li>-</li>
                  )}
                </ul>
              </div>
            </>
          )}

          {editMode && (
            <>
              <div>
                <label className="block font-semibold">Position (EN):</label>
                <input
                  type="text"
                  value={formData.positionEn}
                  onChange={(e) => handleFormChange("positionEn", e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              </div>
              <div>
                <label className="block font-semibold">Position (TH):</label>
                <input
                  type="text"
                  value={formData.positionTh}
                  onChange={(e) => handleFormChange("positionTh", e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              </div>              

              <div className="mt-4">
                <strong>Qualifications:</strong>
                {formData.quals.map((q, idx) => (
                  <div key={idx} className="border border-gray-200 p-2 mt-2 rounded">
                    <div className="flex flex-nowrap items-center gap-3">
                      <div>
                        <span className="font-semibold">EN :</span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="English"
                          value={q.qualEn}
                          onChange={(e) => handleQualChange(idx, "qualEn", e.target.value)}
                          className="w-full border border-gray-300 rounded p-1 mb-2"
                        />
                      </div>
                    </div>

                    <div className="flex flex-nowrap items-center gap-3">
                      <div>
                        <span className="font-semibold">TH :</span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Thai"
                          value={q.qualTh}
                          onChange={(e) => handleQualChange(idx, "qualTh", e.target.value)}
                          className="w-full border border-gray-300 rounded p-1 mb-2"
                        />
                      </div>
                    </div>

                    <div className="flex flex-nowrap items-center gap-3">
                      <div>
                        <span className="font-semibold">Rank :</span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Rank"
                          value={q.rank || ""}
                          onChange={(e) => handleQualChange(idx, "rank", parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded p-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <strong>Descriptions:</strong>
                {formData.descs.map((d, idx) => (
                  <div key={idx} className="border border-gray-200 p-2 mt-2 rounded">
                    <div className="flex flex-nowrap items-center gap-3">
                      <div>
                        <span className="font-semibold">EN :</span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="English"
                          value={d.descEn}
                          onChange={(e) => handleDescChange(idx, "descEn", e.target.value)}
                          className="w-full border border-gray-300 rounded p-1 mb-2"
                        />
                      </div>
                    </div>

                    <div className="flex flex-nowrap items-center gap-3">
                      <div>
                        <span className="font-semibold">TH :</span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Thai"
                          value={d.descTh}
                          onChange={(e) => handleDescChange(idx, "descTh", e.target.value)}
                          className="w-full border border-gray-300 rounded p-1 mb-2"
                        />
                      </div>
                    </div>

                    <div className="flex flex-nowrap items-center gap-3">
                      <div>
                        <span className="font-semibold">Rank :</span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Rank"
                          value={d.rank || ""}
                          onChange={(e) => handleDescChange(idx, "rank", parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded p-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">               
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.urgent}
                    onChange={(e) => handleFormChange("urgent", e.target.checked)}
                    className="mr-2"
                  />
                  <span>Urgent</span>
                </label>
              </div>

            </>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          {!editMode ? (
            <>
              <button onClick={handleEditClick} className="px-4 py-2 btn-primary">Edit</button>
              <button onClick={onClose} className="px-4 py-2 btn-gray">Close</button>
            </>
          ) : (
            <>
              <button onClick={handleSave} className="px-4 py-2 btn-primary">Save</button>
              <button onClick={() => setEditMode(false)} className="px-4 py-2 btn-gray">Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
