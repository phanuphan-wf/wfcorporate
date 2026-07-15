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

  const postZone = async () => {
    try {
        const payload = {
            ExhibitionID : zoneData.exid,
            Zone: zoneData.zoneName,
            Area: Number(zoneData.area),
            BPrice: Number(zoneData.price),
            B_Qty: Number(zoneData.boothQty),
            // Deposit: Number(zoneData.deposit),
            Remark: zoneData.remark,
        };

        const res = await Axios.post( url + "/postZone", payload);
        if (res.status === 200) {
          alert("Zone created successfully");  
          ClearZone();       
        }
    } catch (err) {
        console.error("Error creating zone:", err);
        alert("Error creating zone");
    }
  };



  const ClearZone = () => {
      setZoneData(initZone);
  };

  useEffect(() => {
    //console.log(zoneData);    
  }, [zoneData]);
  

  return (    

    <dataContext.Provider 
        value={{           
            zoneDataC : [zoneData, setZoneData],

        }}
    >

      <section id="createExhibition" className="xl:w-4/5 2xl:w-3/4">
        <div className="text-xl">Create Zone</div>       
       
        <SelectExid />
        <CreateData /> 
     
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
          <button 
            className="btn-gray px-4 w-full sm:w-auto"
            onClick={ClearZone}
          >
            Clear
          </button>
          <button 
            className="btn-green px-4 w-full sm:w-auto" 
            onClick={postZone}
          >
            Add
          </button>
        </div>
        <div className="mt-3">
          <h3 className="text-xl mb-2">Booth List</h3>
          <ListBooth />
        </div>
      </section>   

    </dataContext.Provider>     
  );
}
