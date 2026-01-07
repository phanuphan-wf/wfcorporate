import { useEffect, useState } from "react";
import Axios from "axios";
import ShowExpo from "./showexpo";


export default function Canlendarexpro() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;

  const initData = {
    title: "",
    s_date: "",
    e_date: "",
    showtime: "",
    venue: "",
    exID: "",
    textdate: "",
    //file:"",
  };

  const [data, setData] = useState(initData);
  const [file, setFile] = useState();
  const [reloadFlag, setReloadFlag] = useState(0); // 🔁 trigger reload

  // 🔹 Clear form
  const clickCancel = () => {
    setData(initData);
    setFile();
    document.getElementById("banner").value = "";
    setReloadFlag((prev) => prev + 1);
  };

  const isFormValid =
    data.title !== "" &&
    data.s_date !== "" &&
    data.e_date !== "" &&
    data.showtime !== "" &&
    data.venue !== "" &&
    data.exID !== "" &&
    data.textdate !== "" &&
    file !== undefined;


    //   useEffect(() => {
    //       console.log("data changed:" , data);
    //   }, [data]);

  // 🔹 Submit
  const submitData = async () => {
    if (!isFormValid) return;
    //alert ("save data");
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        fd.append(key, value);
      });
      if (file) fd.append("file", file);

      const res = await Axios.post(url + "/postNextShow", fd);

      if (res.status === 200) {
        alert("Add Next Show Expo Success");
        setData(initData);
        setFile();
        document.getElementById("banner").value = "";
        setReloadFlag((prev) => prev + 1); // 🔁 reload table
      }
    } catch (error) {
      console.error(error);
      alert("Submit failed");
    }
  };

  return (
    <section id="CalenderExpo" className="xl:w-4/5 2xl:w-3/4">
      <div className="text-xl mb-4">Calender Expo</div>

     
      <div className="flex items-center gap-3 mb-3">
        <label className="w-36">Exhibition ID</label>
        <input
          type="text"
          className="md:w-96"
          value={data.exID}
          onChange={(e) => setData({ ...data, exID: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <label className="w-36">Exhibition Title</label>
        <input
          type="text"
          className="md:w-96"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
      </div>

     
      <div className="flex items-center gap-3 mb-3">
        <label className="w-36">Start Day</label>
        <input
          type="date"
          className="md:w-96"
          value={data.s_date}
          onChange={(e) => setData({ ...data, s_date: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <label className="w-36">End Day</label>
            <input
            type="date"
            className="md:w-96"
            value={data.e_date}
            onChange={(e) => setData({ ...data, e_date: e.target.value })}
            />
      </div>

     <div className="flex items-center gap-3 mb-3">
        <label className="w-36">Show Time</label>
            <input
            type="text"
            className="md:w-96"
            value={data.showtime}
            onChange={(e) => setData({ ...data, showtime: e.target.value })}
            />
      </div> 

      <div className="flex items-center gap-3 mb-3">
        <label className="w-36">Venue</label>
            <input
            type="text"
            className="md:w-96"
            value={data.venue}
            onChange={(e) => setData({ ...data, venue: e.target.value })}
            />
      </div> 

      <div className="flex items-center gap-3 mb-3">
        <label className="w-36">Textdate</label>
            <input
            type="text"
            className="md:w-96"
            value={data.textdate}
            onChange={(e) => setData({ ...data, textdate: e.target.value })}
            />
      </div> 

      <div className="flex items-start gap-3 mb-3 w-full">
          <label className="w-36" htmlFor="logo">
            Expo file
          </label>
          <div>
            <input
              type="file"
              className="md:w-96"
              id="banner"
              onChange={(e) => {
                setFile(e.target.files[0]               
                );
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

    
      <div className="flex justify-between mt-4">
        <button className="btn-gray px-2" onClick={clickCancel}>
          Clear Data
        </button>
       
        <button
          className={`px-4 btn-green ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={submitData}
          disabled={!isFormValid}
        >
          Add Expo
        </button>

      </div>

 
      <div className="mt-10">
        <ShowExpo reload={reloadFlag} />
      </div>
    </section>
  );
}
