import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import CorrectDate from "../../../hook/correctDate";

import { dataContext } from "./createZone";


export default function SelectExid(){
    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_udz;

    const { zoneDataC } = useContext(dataContext);
    const [zoneData, setZoneData] = zoneDataC;

    const [exhibition, setExhibtion] = useState([]);
    const [past, setPast] = useState(false);
    const [exid, setExid] = useState("");
    const [exdata, setExdata] = useState({
        exID: "",
        exName:"",
        venue: "",
        during: "",
    });    

    const getExhibition = async () => {
        try {
            const res = await Axios.get(url + "/getExhibition/" + past);
            if (res.status === 200) {
                setExhibtion(res.data);
            }
        } catch (err) {
            console.error("Error fetching exhibition:", err);
        }
    };

    useEffect(() => {
        getExhibition();
    }, [past]);   



    useEffect(() => {
      console.log(exhibition);
    }, [exhibition]);

    return(
         <div className="my-4 flex max-md:flex-col gap-2 md:items-center">
          <label htmlFor="exname" className="max-md:block">
            Exhibition Name :{" "}
          </label>
          <select
            name="exname"
            className="cmb max-md:w-full"
            value={zoneData.exid}
            onChange={(e) => setZoneData({ ...zoneData, exid: e.target.value })}
           
            >
            <option value="0">please select exhibition name</option>
            {exhibition.map((data) => (
              <option key={data.code} value={data.code}>
                 {data.name} ({data.code})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-red-500 size-4"
              name="pastex"
              checked={past}
              onChange={(e) => setPast(e.target.checked)}
            />
            <label htmlFor="pastex">Past Exhibition</label>
          </div>
        </div>
    );

}