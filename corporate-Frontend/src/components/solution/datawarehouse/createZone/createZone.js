import { useEffect, useState, createContext } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";

import SelectExid from "./selectExid";
import CreateData from "./createData";
import ListBooth from "./listBooth";

export const dataContext = createContext();

export default function CreateZone(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_udz;

  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [exhibition, setExhibition] = useState([]);
  const [past, setPast] = useState(false);

  const initZone = {
    exid: "0",
    zoneName: "",
    area: "",
    price: "",
    boothQty: "",
    deposit: "",
    remark: "",
  };

  const [zoneData, setZoneData] = useState(initZone);
  const [zoneId, setZoneId] = useState("");

  const [refresh, setRefresh] = useState(0);
  const triggerRefresh = () => setRefresh(prev => prev + 1);


  const isFormValid =
    String(zoneData.exid || "").trim() !== "0" &&
    String(zoneData.zoneName || "").trim() !== "" &&
    String(zoneData.area || "").trim() !== "" &&
    String(zoneData.price || "").trim() !== "" &&
    String(zoneData.boothQty || "").trim() !== "" &&
    String(zoneData.deposit || "").trim() !== "" &&
    String(zoneData.remark || "").trim() !== "";



  // console.log(isFormValid);

  const postZone = async () => {
    try {
      const payload = {
        ExhibitionID: zoneData.exid,
        Zone: zoneData.zoneName,
        Area: Number(zoneData.area),
        BPrice: Number(zoneData.price),
        B_Qty: Number(zoneData.boothQty),
        Deposit: Number(zoneData.deposit),
        Remark: zoneData.remark,
      };

      const res = await Axios.post(url + "/postZone", payload);
      if (res.status === 200) {
        alert("Zone created successfully");
        triggerRefresh();
        // ClearZone();
        ClearZoneData(); 
      }
    } catch (err) {
      console.error("Error creating zone:", err);
      alert("Error creating zone");
    }
  };

  const ClearZone = () => {
    setZoneData(initZone);
    setZoneId("");
  };

  const ClearZoneData = () => {
    setZoneData ({
      ...zoneData,
      zoneName: "", 
      area: "",
      price: "",
      boothQty: "",
      deposit: "",
      remark: ""
    });
  };

  const editZone = async () => {
    try {
      const payload = {
        PriceID: zoneId,
        ExhibitionID: zoneData.exid,
        Zone: zoneData.zoneName,
        Area: Number(zoneData.area),
        BPrice: Number(zoneData.price),
        B_Qty: Number(zoneData.boothQty),
        Deposit: Number(zoneData.deposit),
        Remark: zoneData.remark,
      };

      // console.log("Editing zone with payload:", payload); // Debugging line

      const res = await Axios.put(url + "/editZone", payload);
      if (res.status === 200) {
        alert("Zone updated successfully");
        triggerRefresh();
        ClearZoneData();
      }
    } catch (err) {
      console.error("Error updating zone:", err);
      alert("Error updating zone");
      ClearZone();
    }
  };

  useEffect(() => {
    //console.log(zoneData);    
  }, [zoneData]);




  return (

    <dataContext.Provider
      value={{
        zoneDataC: [zoneData, setZoneData],
        zoneIdC: [zoneId, setZoneId],
      }}
    >

      <section id="createExhibition" className="xl:w-4/5 2xl:w-3/4">
        <div className="text-xl">Create Zone</div>

        <SelectExid />
        <CreateData />


        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
          {/* ปุ่ม Clear */}
          <button
            className="btn-gray px-4 w-full sm:w-auto cursor-pointer"
            onClick={ClearZone}
          >
            Clear
          </button>

          {!zoneId ? (
            <button
              className={`px-4 w-full sm:w-auto font-medium transition-colors ${isFormValid
                  ? "btn-green cursor-pointer"
                  : "bg-gray-300 text-gray-500 opacity-60 cursor-not-allowed"
                }`}
              onClick={postZone}
              disabled={!isFormValid}
            >
              Add
            </button>
          ) : (
            <button

              className="bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-600"
              onClick={editZone}
            >
              Edit Zone
            </button>
          )}
        </div>


        <div className="mt-3">
          <h3 className="text-xl mb-2">Zone List</h3>
          <ListBooth refresh={refresh} />
        </div>
      </section>

    </dataContext.Provider>
  );
}
