import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import CorrectDate from "../../../hook/correctDate";


export default function SelectExhibition() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_clr;
  const [exhibition, setExhibtion] = useState([]);
  const [past, setPast] = useState(false);
  const [exid, setExid] = useState("");   

  const [filter, setFilter] = useState({
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

  // โหลดรายชื่อนิทรรศการใหม่เมื่อเปลี่ยนสถานะ past
  useEffect(() => {
    getExhibition();
  }, [past]);

  useEffect(() => {
    
    if (exid && exid !== "0") {  
      const selected = exhibition.find((item) => item.code === exid);
      if (selected) {       
        setFilter({
          exID: selected.code,
          venue: selected.venue,          
          during:  CorrectDate(selected.sDate) + " - " + CorrectDate(selected.eDate)
         
        });
      }
    } else {      
      setFilter({
        exID: "",
        venue: "",
        during: "",
      });
    }
  }, [exid, exhibition]); // ใส่ exhibition เผื่อไว้ในกรณีที่ data โหลดมาทีหลัง 

  //console.log(exhibition);

  // useEffect(() => {  
  //   console.log(filter); 
  // }, [filter]);


  // useEffect(() => {
  //  // console.log("ค่า exid ปัจจุบันคือ:", exid);
  // }, [exid]);
    

  return (
    <section id="select-exhibition">
      <div className="border border-zinc-300 rounded-md relative">
        <div className="absolute bg-white px-2 py-1 -top-4 left-3 text-red-600">
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
              onChange={(e) => setExid(e.target.value)}
            >
              <option value="0">----</option>
              {exhibition.length > 0 &&
                exhibition.map((data) => (
                  <option key={data.code} value={data.code}>
                    {data.name + " (" + data.code + ")"}
                  </option>
                ))}
            </select>
          </div>

          {/* Venue */}
          <div className="flex items-center">
            <label htmlFor="vName" className="w-[140px]">
              Venue
            </label>
            <span>
              {filter.venue || "-"}
            </span>
           
          </div>

          {/* During */}
          <div className="flex items-center">
            <label htmlFor="during" className="w-[140px]">
              During
            </label>
            <span>
               {filter.during || "-"}
            </span>
          </div>

          {/* Checkbox */}
          <div className="flex w-full justify-end items-center">
            <input
              type="checkbox"
              id="eFinish"
              className="accent-red-500 size-4"
              onChange={() => {
                setPast(!past);
                setFilter({
                  exID: "",
                  venue: "",
                  during: "",
                });   
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


