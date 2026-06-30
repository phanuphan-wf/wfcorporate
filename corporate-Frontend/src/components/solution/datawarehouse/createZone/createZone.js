import { useEffect, useState, createContext } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";

import SelectExid from "./selectExid";
import CreateData from "./createData";

export const dataContext = createContext();

export default function CreateZone(props) {
//   const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cb;

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

  const ClearZone = () => {
      setZoneData(initZone);
  };
  

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

        <div className="flex justify-end gap-2 mt-2">
          <button 
            className="btn-gray px-4"
            onClick={ClearZone}
          >
            Clear
          </button>
          <button 
            className="btn-green px-4" 
            // onClick={submitClick}
          >
            Add
          </button>
        </div>
        {/* <div className="mt-8">
          <ListBooth />
        </div> */}
      </section>   

    </dataContext.Provider>     
  );
}
