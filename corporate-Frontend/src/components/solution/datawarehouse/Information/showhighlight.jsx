import { useState, useEffect } from "react";
import Axios from "axios";

export default function ShowHighlightList(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;

  const [highlightList, setHighlightList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); 
  const [addhl, setAddhl] = useState([]);   
  
  // console.log(highlightList);
  //console.log(selectedIds);
  //console.log(addhl);
 
  useEffect(() => {
    if (highlightList.length > 0) {
      const defaultIds = highlightList
        .filter(h => h.show === true)
        .map(h => h.id);

      setSelectedIds(defaultIds);
      setAddhl(defaultIds);
    }
  }, [highlightList]);


  const isChanged =
  selectedIds.length !== addhl.length ||
  selectedIds.some(id => !addhl.includes(id));


  /* ================== GET LIST ================== */
  const getList = async () => {
    try {
      const res = await Axios.get(url + "/HLShow");
      if (res.status === 200) {
        setHighlightList(res.data);

        // ดึง id ทุกตัวที่ show === true
        const showIds = res.data
          .filter(item => item.show === true)
          .map(item => item.id);

        setSelectedIds(showIds);     
      }
    } catch (err) {
      console.error(err);
    }
  };
  

  /* โหลดข้อมูลครั้งแรก + เมื่อ reload เปลี่ยน */
  useEffect(() => {
    getList();
  }, [props.reload]);

  
  /* ================== SAVE ================== */
  const saveHighlight = async () => {
    if (!isChanged) return;

    try {
      const res = await Axios.put(
        url + "/HLSelect",
        selectedIds   
      );

      if (res.status === 200) {  
        alert("Data successfully saved.");
        getList();
      }
    } catch (err) {
      console.error(err);
      alert("error");
    }
  };



  return (
    <section className="Show Highlight Exhibition">
      
      <div className="flex items-center gap-4">
        <div className="font-medium text-lg">Highlight Exhibition list</div>

        <button
          className={`px-4 btn-primary ${
            isChanged ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!isChanged}
          onClick={saveHighlight}
        >
          Save
        </button>


      </div>


      <table className="w-[1024px] my-4">
        <thead>
          <tr className="border-b border-neutral-600">
            <th>On Show</th>
            <th className="border-l border-neutral-600">Highlight</th>            
            <th className="border-l border-neutral-600">Title</th>
            <th className="border-l border-neutral-600">Show Day</th>
            <th className="border-l border-neutral-600">Description</th>          
           
          </tr>
        </thead>
        <tbody>
          {highlightList.length > 0 &&
            highlightList.map((h, i) => (
              <tr
                className={`border-b border-neutral-600 last:border-b-0 ${
                  h.show ? "bg-red-100" : ""
                }`}>
                <td className="align-middle border-l-0 text-center">
                  <input
                    type="checkbox"
                    className="size-4 accent-red-500"
                    checked={selectedIds.includes(h.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // เพิ่มเข้า array
                        setSelectedIds(prev => [...prev, h.id]);
                      } else {
                        // ลบออกจาก array
                        setSelectedIds(prev => prev.filter(id => id !== h.id));
                      }
                    }}
                  />
                </td>         


                <td className="align-middle border-l border-neutral-600 text-center">                
                    <img
                      src={`https://worldfair.blob.core.windows.net/webcard/${h.banner}`}
                      alt={`${h.banner}`}
                      className="object-contain w-[120px] h-45"
                    />                 
                </td>
                
                <td className="align-middle border-l border-neutral-600 text-center">
                  {h.title}
                </td>
                <td className="align-middle border-l border-neutral-600 text-center">
                  {h.showdate}
                </td>
                <td className="align-middle border-l border-neutral-600 ">
                  {h.descp}
                </td>               
                
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
}