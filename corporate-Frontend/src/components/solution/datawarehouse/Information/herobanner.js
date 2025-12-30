import { useState } from "react";
import Axios from "axios";

import ShowBannerList from "./showbannerlist";

export default function CreateExhibition(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;

  const initData = {
    title: "",
    showdate: "",
    showtime: "",
    venue: "",
    exID: "",
  };
  const [data, setData] = useState([]);

  const [file, setFile] = useState();

  const clickCancel = () => {
    setData(initData);
    setFile();
  };

  const submitData = async () => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        fd.append(key, value);
      }
    });
    fd.append("file", file);

    const res = await Axios.post(url + "/postHero", fd).then((r) => {
      if (r.status == 200) {
        if (!r.data.fileUpload) {
          alert("Upload banner file fail!");
        } else {
          alert("Upload Herobaner Success");
          setData(initData);
          setFile();
        }
      }
    });
  };

  return (
    <section id="createExhibition" className="xl:w-4/5 2xl:w-3/4">
      <div className="text-xl">Hero Banner</div>
      <div className="my-4">
        <div className="flex items-center gap-3 mb-3">
          <label className="w-36" htmlFor="ExID">
            Exhibition ID
          </label>
          <input
            type="text"
            id="ExID"
            onChange={(e) => setData({ ...data, exID: e.target.value })}
            value={data.exID}
          />
        </div>
        <div className="flex items-center gap-3 mb-3 w-full">
          <label className="w-36" htmlFor="Name">
            Exhibition Name
          </label>
          <input
            type="text"
            className="md:w-96"
            id="Name"
            onChange={(e) => setData({ ...data, title: e.target.value })}
            value={data.title}
          />
        </div>

        <div className="flex items-center gap-3 mb-3 w-full">
          <label className="w-36" htmlFor="StarttoEnd">
            Show Day
          </label>
          <input
            type="text"
            className="md:w-96"
            id="StarttoEnd"
            onChange={(e) => setData({ ...data, showdate: e.target.value })}
            value={data.showdate}
          />
        </div>

        <div className="flex items-center gap-3 mb-3 w-full">
          <label className="w-36" htmlFor="Showtime">
            Show Time
          </label>
          <input
            type="text"
            className="md:w-96"
            id="Showtime"
            onChange={(e) => setData({ ...data, showtime: e.target.value })}
            value={data.showtime}
          />
        </div>
        <div className="flex items-center gap-3 mb-3 w-full">
          <label className="w-36" htmlFor="Venue">
            Venue
          </label>
          <input
            type="text"
            className="md:w-96"
            id="Venue"
            onChange={(e) => setData({ ...data, venue: e.target.value })}
            value={data.vanue}
          />
        </div>

        <div className="flex items-start gap-3 mb-3 w-full">
          <label className="w-36" htmlFor="logo">
            Banner file
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
      </div>
      <div className="flex justify-between">
        <button className="btn-gray px-2" onClick={clickCancel}>
          Clear Data
        </button>
        <button className="btn-primary px-4" onClick={submitData}>
          Save
        </button>
      </div>
      <div className="mt-10">
        <ShowBannerList reload={data.exID} />
      </div>
    </section>
  );
}
