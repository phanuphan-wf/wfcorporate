import { useEffect, useState, createContext } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";

import CreateBox from "./createBox";
import ListBooth from "./listBooth";

export const BoothContext = createContext();

export default function CreateBooth(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cb;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [exhibition, setExhibition] = useState([]);
  const [past, setPast] = useState(false);

  const initBooth = {
    exid: "0",
    action: "",
    row: "",
    rowto: "",
    num: "",
    numto: "",
  };
  const [booth, setBooth] = useState(initBooth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(url + "/getExhibition/" + past);
        setExhibition(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [past]);

  const [listVersion, setListVersion] = useState(0);
  const bumpList = () => setListVersion((v) => v + 1);

  const submitClick = async () => {
    if (booth.exid === "0") {
      alert("Please select exhibition name.");
      return;
    }
    if (booth.action === "") {
      alert("Please select action.");
      return;
    }
    if (booth.row === "") {
      alert("Please input row.");
      return;
    }
    if (
      booth.num === "" &&
      booth.action !== "booth" &&
      booth.action !== "del"
    ) {
      alert("Please input number.");
      return;
    }
    try {
      const response = await Axios.post(url + "/postBoothlist", booth);
      if (response.status === 200)
        if (booth.action !== "del") {
          alert("Booth created successfully.");
        } else {
          alert("Booth deleted successfully.");
        }
      let exid = booth.exid;
      setBooth(initBooth);
      // reset action to disable inputs
      setBooth((prev) => ({ ...prev, exid: exid }));
      bumpList();
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data: " + error.message);
    }
  };

  useEffect(() => {
    console.log(booth);
  }, [booth]);

  return (
    <BoothContext.Provider
      value={{ boothC: [booth, setBooth], listVersion, bumpList }}>
      <section id="createExhibition" className="xl:w-4/5 2xl:w-3/4">
        <div className="text-xl">Create Booth</div>

        <div className="my-4 flex max-md:flex-col gap-2 md:items-center">
          <label htmlFor="exname" className="max-md:block">
            Exhibition Name :{" "}
          </label>
          <select
            name="exname"
            className="cmb max-md:w-full"
            onChange={(e) => setBooth({ ...booth, exid: e.target.value })}
            value={booth.exid}>
            <option value={0}>please select exhibition name</option>
            {exhibition.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name + " (" + item.code + ")"}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-red-500 size-4"
              name="pastex"
              onChange={(e) => setPast(e.target.checked)}
            />
            <label htmlFor="pastex">Past Exhibition</label>
          </div>
        </div>
        <div className="mt-8">
          <CreateBox />
        </div>
        <div className="flex justify-end">
          <button className="btn-green m-4 px-4" onClick={submitClick}>
            Submit
          </button>
        </div>
        <div className="mt-8">
          <ListBooth />
        </div>
      </section>
    </BoothContext.Provider>
  );
}
