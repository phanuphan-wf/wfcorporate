import { useState, useEffect } from "react";
import Axios from "axios";

export default function ShowBannerList(props) {  

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;

  const [herolist, setHerolist] = useState([]);


  const [show, setShow] = useState(0);
  const [initialShow, setInitialShow] = useState(null);

  //console.log(show);
  //console.log(initialShow);

  
  const isChanged = show !== initialShow;


  const getList = async () => {
    const res = await Axios.get(url + "/HeroShow").then((r) => {
      if (r.status == 200) {
        setHerolist(r.data);
      }
    });
  };

  const SelectBanner = async () => {
     alert("SelectBanner");
  }

  // useEffect(() => {
  //   getList();
  // }, []);

  useEffect(() => {
    if (herolist.length > 0) {
      initShow();
    }
  }, [herolist]);

  // useEffect(() => {
  //   let c = props.reload;
  //   if (c.length != 0) {
  //     getList();
  //   }
  // }, [props.reload]);

  useEffect(() => {
    if (props.reload?.length == 0) {
      getList();
    }
  }, [props.reload]);

  useEffect(() => {
    getList();
  }, [props.reload]);


  const initShow = () => {
    const showItem = herolist.find((h) => h.show);
    if (showItem) {
      setShow(showItem.id);
      setInitialShow(showItem.id);
    }    
  };

  const SaveBanner = async () => {
    try {
      console.log("Selected id:", show);

      const res = await Axios.put(url + `/HeroSelect/${show}`);

      if (res.status === 200) {
        alert("Save banner success");
        setInitialShow(show); // reset ปุ่ม Save ให้ disable
        getList();
      }
    } catch (error) {
      console.error(error);
      alert("Save banner failed");
    }
  };

 


  return (
    <section className="showbanner">
      
      <div className="flex items-center gap-4">
        <div className="font-medium text-lg">Banner list</div>

      <button
          className={`px-4 btn-primary ${
            isChanged ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!isChanged}
          onClick={SaveBanner}
        >
          Save
      </button>

      </div>


      <table className="w-[1024px] my-4">
        <thead>
          <tr className="border-b border-neutral-600">
            <th>On Show</th>
            <th className="border-l border-neutral-600">Banner</th>
            <th className="border-l border-neutral-600">ExID</th>
            <th className="border-l border-neutral-600">Title</th>
            <th className="border-l border-neutral-600">Show Day</th>
            <th className="border-l border-neutral-600">Vanue</th>
            <th className="border-l border-neutral-600">Show Time</th>
           
          </tr>
        </thead>
        <tbody>
          {herolist.length > 0 &&
            herolist.map((h, i) => (
              <tr
                className={`border-b border-neutral-600 last:border-b-0 ${
                  h.show ? "bg-red-100" : ""
                }`}>
                <td className="align-middle border-l-0 text-center">
                  <input
                    type="radio"
                    name="hero"
                    checked={h.id == show}
                    className="size-4 accent-red-500"
                    onChange={() => setShow(h.id)}
                  />
                </td>

                <td className="align-middle border-l border-neutral-600 text-center">
                  {h.banner ? (
                    <img
                      src={`https://worldfair.blob.core.windows.net/website/${h.banner}`}
                      alt={`${h.banner}`}
                      className="object-contain w-[120px] h-20 ml-4"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>

                <td className="align-middle border-l border-neutral-600 text-center">
                  {h.exID}
                </td>
                <td className="align-middle border-l border-neutral-600 text-center">
                  {h.title}
                </td>
                <td className="align-middle border-l border-neutral-600 text-center">
                  {h.showdate}
                </td>
                <td className="align-middle border-l border-neutral-600 text-center">
                  {h.venue}
                </td>
                <td className="align-middle border-l border-neutral-600 text-center">
                  {h.showtime}
                </td>
                
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
}