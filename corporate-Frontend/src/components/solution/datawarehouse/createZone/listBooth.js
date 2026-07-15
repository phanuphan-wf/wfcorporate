import {useState, useEffect, useContext} from "react";
import Axios from "axios";
import CorrectDate from "../../../hook/correctDate";

import { dataContext } from "./createZone";

export default function ListBooth() {
    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_udz;

    const { zoneDataC } = useContext(dataContext);
    const [zoneData, setZoneData] = zoneDataC;


    //console.log(zoneData);
    const [boothList, setBoothList] = useState([]);

    const getBoothList = async () => {
        try {
            const res = await Axios.get(url + "/zonelist/" + zoneData.exid);
            if (res.status === 200) {
                setBoothList(res.data);
            }
        } catch (err) {
            console.error("Error fetching booth list:", err);
        }
    };

    const deleteZone = async (id) => {
        try {
            const res = await Axios.delete(url + "/DelZone/"+id);
            if (res.status === 200) {
                alert("Zone deleted successfully");
                getBoothList(); // Refresh the list after deletion
            }
        } catch (err) {
            console.error("Error deleting zone:", err);
            alert("Error deleting zone");
        }
    };

    useEffect(() => {
        if (zoneData.exid !== "0") {
            getBoothList();
        }else{
            setBoothList([]);
        }
    }, [zoneData.exid]);   

    useEffect(() => {
        console.log(boothList);
    }, [boothList]);

   

    return (
        <div className="border rounded-lg relative">
              <table className="w-full border-collapse border">
                  <thead>                    
                     <tr className="bg-gray-100">
                      <th className="border px-2 py-1">No</th>
                      <th className="border px-2 py-1">ZoneName</th>
                      <th className="border px-2 py-1">Area</th>
                      <th className="border px-2 py-1">Price</th>
                      <th className="border px-2 py-1">Booth Quantity</th>
                      <th className="border px-2 py-1">Deposit</th>
                      <th className="border px-2 py-1">Remark</th> 
                      <th className="border px-2 py-1">Actions</th>                   
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {boothList.map((booth, index) => (
                      <tr key={booth.id}>
                        <td className="border border-l-0  px-2 py-1 text-center">{index + 1}</td>
                        <td className="border px-2 py-1 text-center">{booth.zone}</td>
                        <td className="border px-2 py-1 text-center">{booth.area}</td>
                        <td className="border px-2 py-1 text-center">{booth.bPrice}</td>
                        <td className="border px-2 py-1 text-center">{booth.b_Qty}</td>
                        <td className="border px-2 py-1 text-center">{booth.deposit}</td>
                        <td className="border px-2 py-1 text-center">{booth.remark}</td>
                        <td className="border px-2 py-1 text-center">              
                            <button className="bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-600">
                                Edit
                            </button>                            
                            <button                             
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-3"
                                onClick={() => deleteZone(booth.priceID)}
                            >
                                Delete
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>             
                  
                </table>
        </div>          
           
   
    );
}