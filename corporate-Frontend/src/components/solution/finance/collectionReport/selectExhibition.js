// src/components/solution/finance/collectionReport/selectExhibition.js
import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import CorrectDate from "../../../hook/correctDate";
import { dataContext } from "./report";


export default function SelectExhibition() {
 
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_clr;

  const {filterC} = useContext(dataContext);
  const [filter, setFilter] = filterC;


  const [exhibition, setExhibtion] = useState([]);
  const [past, setPast] = useState(false);
  const [exid, setExid] = useState("");
  const [exdata, setExdata] = useState({
      exID: "",
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

  
  useEffect(() =>{
    if (exid && exid !=="0") {
      const selected = exhibition.find((item) => item.code === exid);
      if (selected) {
        setExdata({
          exID: selected.code,
          venue: selected.venue,
          during: CorrectDate(selected.sDate) + " - " + CorrectDate(selected.eDate)
        });
         
        setFilter((prev) => ({ ...prev, exID: selected.code}));
      }
    }else{
      setExdata({ exID: "", venue: "", during: ""});
      setFilter((prev) => ({ ...prev, exID: "" }));
    }
   },[exid, exhibition, setFilter]);

   useEffect(() => {
     setFilter((prev) => ({
      ...prev,
      exID: exdata.exID,
     }));
   },[exdata. setFilter]);


  return (
    <section id="select-exhibition">
      <div className="border border-zinc-300 rounded-md relative">
        <div className="absolute bg-white px-2 py-1 -top-4 left-3 text-red-600 font-semibold">
          Exhibition
        </div>

        <div className="flex flex-col gap-2 px-3 py-4">
          {/* Exhibition Name */}
          <div className="flex items-center">
            <label htmlFor="eName" className="w-[140px]">
              Exhibition Name
            </label>
            <select
              id="eName"
              className="cmb"
              value={exid}
              onChange={(e) => setExid(e.target.value)}
            >
            
            <option value="0">----</option>
             {exhibition.map((data) =>(
                <option key = {data.code} value={data.code}>
                   {data.name} ({data.code})
                </option>
             ))}
            </select>
          </div>

        
          <div className="flex items-center">
            <label htmlFor="vName" className="w-[140px]">
              Venue
            </label>
            <span>{exdata.venue || "-"}</span>
          </div>

      
          <div className="flex items-center">
            <label htmlFor="during" className="w-[140px]">
              During
            </label>
            <span>{exdata.during || "-"}</span>
          </div>

          
          <div className="flex w-full justify-end items-center">
            <input
              type="checkbox"
              id="eFinish"
              className="accent-red-500 size-4"
              checked={past}
              onChange={() =>{
                const nextPast = !past;
                setPast(nextPast);
                setExid("0");
                setExdata({ exID: "", venue: "", during: ""});
              }}
            />
            <label htmlFor="eFinish" className="ml-2">
              Show Finished Exhibition
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
