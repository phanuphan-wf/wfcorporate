import React, { useContext, useState, useEffect } from "react";
//import useHeader from "../../../hook/useHeader";
import Axios from "axios";

import { RiDeleteBin6Line } from "react-icons/ri";


export default function ListFloorplan(props) {
    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_fl;  
    const [floorplanList, setFloorplanList] = useState([]);

  
    const fetchFloorplan = async () => {
        try {
            const res = await Axios.get(url + "/listCustomer");
            if (res.status === 200) {
                setFloorplanList(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await Axios.delete(url + "/DeleteCustomer/" + id);
            if (res.status === 200) {
               window.location.reload();
            }
        } catch (error) {
            console.error(error);
            alert("Delete failed");
        }
        
    };

    useEffect(() => {
        fetchFloorplan();
    }, [props.reload]);


  
  return (
    <section id="customer-history-list">
      <div className="flex justify-end w-full 2xl:w-4/5 my-4">      
      </div>
      <h1 className="text-xl font-medium">Floorplan List</h1>

      <div id="list" className="w-full mb-8">
        <table className="w-full 2xl:w-4/5">
          <thead>
            <tr>           
              <th className="bg-zinc-100 border-l-2 border-white">
                 ID
              </th>
              <th className="bg-zinc-100 border-l-2 border-white">Name</th>
              <th className="bg-zinc-100 border-l-2 border-white"></th>             
            </tr>
          </thead>
            <tbody>
                {floorplanList.map((data) => (
                    <tr className="last:border-b-2 border-zinc-100">  
                        <td className="border-t-2 border-l-2 border-zinc-100 text-center">
                            {data.id}
                        </td>

                        <td className="border-t-2 border-l-2 border-zinc-100">
                            {data.name}
                        </td>

                        <td className="border-t-2 border-l-2 border-zinc-100 p-2 text-center">
                            <button
                            onClick={() => handleDelete(data.id)}
                            className="bg-red-500 hover:bg-red-50 text-white hover:text-red-600 border border-red-500 px-3 py-1 rounded-md transition-all duration-300 text-sm flex items-center gap-1 mx-auto shadow-sm hover:shadow-inner"
                            >
                            <RiDeleteBin6Line />
                            Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>

        </table>
      </div>
    </section>
  );
}
