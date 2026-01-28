import { useState } from "react";
import Axios from "axios";
import ShowHighlight from "./showhighlight";

export default function CreateExhibition() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;

  const initData = {
    title: "",
    showdate: "",
    description: "",
  };

  const [data, setData] = useState(initData);
  const [file, setFile] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0); // 🔁 trigger reload

  // 🔹 Clear form
  const clickCancel = () => {
    setData(initData);
    setFile(null);
    document.getElementById("banner").value = "";
    setReloadFlag((prev) => prev + 1);
  };

  const isFormValid =
    data.title.trim() !== "" &&
    data.showdate.trim() !== "" &&
    data.description.trim() !== "" &&
    file !== undefined;

  // 🔹 Submit
  const submitData = async () => {
    if (!isFormValid) return;

    try {
      const fd = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        fd.append(key, value);
      });
      if (file) fd.append("file", file);

      const res = await Axios.post(url + "/postHilight", fd);

      if (res.status === 200) {
        alert("Add Highlight Card Success");
        setData(initData);
        setFile(null);
        document.getElementById("banner").value = "";
        setReloadFlag((prev) => prev + 1); // 🔁 reload table
      }
    } catch (error) {
      console.error(error);
      alert("Submit failed");
    }
  };

  return (
    <section id="createExhibition" className="xl:w-4/5 2xl:w-3/4">
      <div className="text-xl mb-4">Highlight Card on Homepage</div>

      <div className="flex items-center gap-3 mb-3">
        <label className="w-36">Exhibition Name</label>
        <input
          type="text"
          className="md:w-96"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <label className="w-36">Show Day</label>
        <input
          type="text"
          className="md:w-96"
          value={data.showdate}
          onChange={(e) => setData({ ...data, showdate: e.target.value })}
        />
      </div>

      <div className="flex items-start gap-3 mb-3">
        <label className="w-36 mt-1">Description</label>
        <textarea
          className="border border-[#b3b3b3] w-96 rounded-md px-2 py-1 focus:outline-none focus:shadow-[0_0_0_0.2rem_white,0_0_5px_0.25rem_red] focus:border-white"
          rows={3}
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
      </div>

      <div className="flex items-start gap-3 mb-3 w-full">
        <label className="w-36" htmlFor="logo">
          Highlight file
        </label>
        <div>
          <input
            type="file"
            className="md:w-96"
            id="banner"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <div>
            {file != undefined && (
              <button
                className="btn-gray px-2 mt-2"
                onClick={() => {
                  setFile();
                  document.getElementById("banner").value = "";
                }}>
                Cancel
              </button>
            )}
          </div>
        </div>
        <div className="max-w-[120px] max-h-[100px] mt-2">
          {file != undefined && (
            <img
              src={URL.createObjectURL(file)}
              alt="signature"
              className="object-contain object-center w-full max-h-[100px]"
            />
          )}
        </div>
      </div>

      <div className="flex justify-between mt-4 w-full md:w-2/3">
        <button
          className={`px-2 btn-green ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={submitData}
          disabled={!isFormValid}>
          Add Highlight Card
        </button>

        <button className="btn-gray px-3" onClick={clickCancel}>
          Clear Data
        </button>
      </div>

      <div className="mt-10">
        <ShowHighlight reload={reloadFlag} />
      </div>
    </section>
  );
}
