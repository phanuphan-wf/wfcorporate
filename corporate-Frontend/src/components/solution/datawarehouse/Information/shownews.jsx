import { useState, useEffect } from "react";
import Axios from "axios";

export default function Shownews(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;

  const [NewsList, setNewsList] = useState([]); 

  const [isChanged, setisChanged] = useState(true);

  /* ================== GET LIST ================== */
  const getList = async () => {
    try {
      const res = await Axios.get(url + "/HLShow");
      if (res.status === 200) {
        setNewsList(res.data);

        // 👉 ดึง id ทุกตัวที่ show === true
        const showIds = res.data
          .filter(item => item.show === true)
          .map(item => item.id);

        //setSelectedIds(showIds);     
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
  const saveNews = async () => {
   // if (!isChanged) return; 
    
  };



  return (
    <section className="Show News">
      
      <div className="flex items-center gap-4">
        <div className="font-medium text-lg">News list</div>

        {/* <button
          className={`px-4 btn-primary ${
            isChanged ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!isChanged}
          onClick={saveNews}
        >
          Save
        </button> */}


      </div>


      <table className="w-[1024px] my-4">
        <thead>
          <tr className="border-b border-neutral-600">            
            <th className="border-l border-neutral-600">Banner</th>            
            <th className="border-l border-neutral-600">Title</th>            
            <th className="border-l border-neutral-600">Description</th>          
           
          </tr>
        </thead>
        <tbody>
          {NewsList.length > 0 &&
            NewsList.map((h, i) => (
              <tr>   
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