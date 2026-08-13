import {useState, useEffect, useContext} from "react";
import Axios from "axios";

import { dataContext } from "./createZone";

export default function ListBooth({ refresh }) {
    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_udz;

    const { zoneDataC,zoneIdC } = useContext(dataContext);
    const [zoneData, setZoneData] = zoneDataC;    
    const [zoneId, setZoneId] = zoneIdC;    

    //console.log(zoneData);
    const [boothList, setBoothList] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);

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

    const closeDeleteModal = () => {
        setDeleteTarget(null);
    };

    const deleteZone = async () => {
        if (!deleteTarget) return;

        try {
            const res = await Axios.delete(url + "/DelZone/" + deleteTarget.priceID);
            if (res.status === 200) {
                alert("Zone deleted successfully");
                closeDeleteModal();
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
        //console.log(boothList);
    }, [boothList]); 

    useEffect(() => {
        getBoothList();
    }, [refresh]); 
   

    return (
        <div className="border rounded-lg relative">
            {deleteTarget && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-5 shadow-lg w-[420px]">
                        <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
                        <hr></hr>
                        <p className="text-sm text-gray-700 mt-3">
                            Are you sure you want to delete zone <strong>{deleteTarget.zone}</strong>?
                        </p>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
                                onClick={closeDeleteModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                onClick={deleteZone}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                            <button 
                                className="bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-600"
                                onClick={() => {
                                    setZoneId(booth.priceID);
                                    setZoneData({
                                        ...zoneData,
                                        zoneName: booth.zone,
                                        area: booth.area,
                                        price: booth.bPrice,
                                        boothQty: booth.b_Qty,
                                        deposit: booth.deposit,
                                        remark: booth.remark
                                    });
                                }}
                            >
                                Edit
                            </button>                            
                            <button                             
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-3"
                                onClick={() => setDeleteTarget(booth)}
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