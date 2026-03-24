import { useState, useEffect, useContext } from "react";
import { dataContext } from "./salereport";
import { CgMoreO, CgCloseO } from "react-icons/cg";
import Axios from "axios";

export default function Filter() {
  
  const { filterC} = useContext(dataContext);
  const [filter] = filterC;

 

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_srp;

  const [showFilter, setShowFilter] = useState(false);

  const isDisabled = !filter.exID || filter.exID === "";  

 
  const data = {
      bySale: "",
      byZone: "",    
  };
  const [filterData, setFilterData] =  useState(data);
  const [zoneList, setZoneList] = useState([]);  
  const [salesList, setSalesList] = useState([]);
  const [reportData, setReportData] = useState([]);

  //console.log(filterData);
  console.log(salesList);
  console.log(reportData);
  


  const getReport = async () =>{
    const exID = {exID: filter.exID};
    try {
          const res = await Axios.post(url + "/getReport/",exID); 
          if (res.status === 200) {
             setReportData(res.data);
          }
    } catch (err) {
        console.error(err);
    }
    
  }; 

  const getSales = async () => {

    try {
        const res = await Axios.get(url + "/getSales/");
        if (res.status === 200) {
           setSalesList(res.data);
        }
      
    } catch (err) {
      console.error(err);
    }
  };


  const zoneChange = (e) => {
    setFilterData({
      ...filterData, 
      byZone: e.target.value 
    });
  };

  useEffect(() => {
     if (isDisabled == true) {
       setShowFilter(false);
       setFilterData(data);     
     }     
  }, [isDisabled]);



  const getZone = async () =>{
    try {
      const res = await Axios.get(url + "/getZone/" + filter.exID);        
      if (res.status == 200) {
          setZoneList(res.data);
      }      
    } catch (err) {
      console.error("Fetch Zone Error:", err);
      setZoneList([]);
    }
  };

  useEffect(() => {
      if (isDisabled == false) {
         getZone();
         getReport();
         getSales();
         setFilterData(data);
      }
  },[filter.exID]);
  
  
  return (
    <>
      <button
        disabled={isDisabled}
        className={`rounded-md py-1 px-3 text-white mt-4 flex items-center gap-2 transition-all ${
          isDisabled 
            ? "bg-gray-300 cursor-not-allowed" 
            : showFilter ? "bg-red-500" : "bg-green-600"
        }`}
        onClick={() => setShowFilter(!showFilter)}
      >
        {showFilter ? (
          <>
            <CgCloseO />
            <span>Close panel</span>
          </>
        ) : (
          <>
            <CgMoreO />
            <span>Filter</span>
          </>
        )}
      </button>

      {/* Filter Section */}
      {showFilter && (
        <div className="border border-zinc-300 rounded-md relative mt-6">
          
          <div className="absolute bg-white px-2 py-1 -top-4 left-3 text-red-600">
            Filter
          </div>

          <div className="flex flex-col px-3 py-4 space-y-3">
              {/* By Sales */}
              <div className="flex items-center gap-3">
                <label
                  htmlFor="bySales"
                  className="flex items-center font-medium gap-2 w-36">
                  By Sales :
                </label>
                <select
                  id="bySales"                 
                  className="border rounded-md p-1.5 w-full md:w-100 bg-white outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  value={filterData.bySale}
                  //onChange={salesChange}
                  >
                <option value="0">----- All Sales -----</option>

                {/* {sales.map((sales, index) => (
                   <option key={index} value={sales}>
                      {sales} 
                   </option>                  
                
                ))} */}
                
                </select>
              </div>

              {/* By Zone */}
              <div className="flex items-center gap-3">
                <label
                  htmlFor="byZone"
                  className="flex items-center font-medium gap-2 w-36">
                  By Zone :
                </label>
                <select
                  id="byZone"
                  className="border rounded-md p-1.5 w-full md:w-100 bg-white outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  value={filterData.byZone}
                  onChange={zoneChange}                
                >
                  <option value="0">----- All Zone -----</option>
                  {zoneList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.zone}
                      </option>
                  ))}
                </select>
              </div>              
          </div>

        </div>
      )}
    </>
  );
}