import React, { useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";

export default function ModalEditName(props) {
    const bearer = useHeader();
    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cdp;
    const urlType = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctm;
    Axios.defaults.headers.common = {
        Authorization: "Bearer " + bearer,
    };

    const [ctName, setCtName] = useState("");
    const [ctType, setCtType] = useState(1);

    // State สำหรับเก็บข้อมูลฝั่ง New
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState(1);

    const [ctype, setCtype] = useState([]); 


    const getType = async () => {
        try {
            const res = await Axios.get(urlType + "/getCType");
            setCtype(res.data);
        } catch (error) {
            console.error("Error fetching customer types:", error);
        }
    };

    const subName = (nameStr = "") => {
        if (!nameStr || ctype.length === 0) {
            setCtType(1);
            setCtName(nameStr || "");

            return;
        }

        const trimmedName = nameStr.trim();

        // 1. เคสพิเศษ: บริษัทจำกัดมหาชน (ID: 7) เช่น "บริษัท เมเจอร์ ซีนีแพล็ก กรุ๊ป (มหาชน) จำกัด"
        if (trimmedName.startsWith("บริษัท") && trimmedName.includes("มหาชน")) {
            setCtType(7);
            setNewType(7);
            let remaining = trimmedName.replace(/^บริษัท\s*/, ""); // ตัด "บริษัท " ข้างหน้า
            remaining = remaining.replace(/\s*\(มหาชน\)\s*จำกัด$/, ""); // ตัด "(มหาชน) จำกัด" ข้างหลัง
            remaining = remaining.replace(/\s*จำกัด\s*\(มหาชน\)$/, ""); // เผื่อกรณีสลับคำ
            setCtName(remaining.trim());
            setNewName("");
            return;
        }

        // 2. เคสพิเศษ: บริษัทจำกัดทั่วไป (ID: 2) เช่น "บริษัท เครี่ เดอะเดย์ บายจา จำกัด"
        if (trimmedName.startsWith("บริษัท") && trimmedName.endsWith("จำกัด")) {
            setCtType(2);
            setNewType(2);
            let remaining = trimmedName.replace(/^บริษัท\s*/, ""); // ตัด "บริษัท " ข้างหน้า
            remaining = remaining.replace(/\s*จำกัด$/, "");      // ตัด " จำกัด" ข้างหลัง
            setCtName(remaining.trim());
            setNewName("");
            return;
        }

        // 3. เคสทั่วไปสำหรับประเภทอื่นๆ
        const validTypes = ctype.filter((t) => t.type && t.type.trim() !== "");
        const sortedCtype = [...validTypes].sort((a, b) => b.type.trim().length - a.type.trim().length);

        let matchedType = sortedCtype.find((t) => trimmedName.startsWith(t.type.trim()));
        if (!matchedType) {
            matchedType = sortedCtype.find((t) => {
                const cleanType = t.type.trim();
                return trimmedName.endsWith(cleanType) || trimmedName.includes(cleanType);
            });
        }

        if (matchedType) {
            const cleanType = matchedType.type.trim();
            const regex = new RegExp(cleanType, 'g');
            const remainingName = trimmedName.replace(regex, "").trim();

            setCtType(matchedType.id);
            setNewType(matchedType.id);
            setCtName(remainingName);
            setNewName("");
        } else {
            // ถ้าไม่เข้าเงื่อนไขไหนเลย ให้เป็น ID 1 (none)
            setCtType(1);
            setNewType(1);
            setCtName(trimmedName);
            setNewName("");
        }
    };

    // ฟังก์ชันยืนยันก่อนบันทึก
    const confirmAndSave = () => {
        if (!newName.trim()) {
            alert("Please enter the new customer's name.");
            return;
        }

        // แสดงกล่องยืนยันก่อนบันทึก
        const isConfirmed = window.confirm("Do you want to save this information?");
        if (isConfirmed) {
            handleSave();
        }
    };

    
    const handleSave = async () => {      

        const ctID = props.data.id;
        const playload = {
            name: newName.trim(),
            type: newType,
        };
        try {            
            await Axios.put(url + "/editCustomer/" + ctID, playload);                       
            if (props.onHide){
              props.onUpdate();
              props.onHide();              
            }            

        } catch (error) {
            console.error("Error updating customer name:", error);
            alert("Error updating customer data.");
        }
    };

  
    useEffect(() => {
       getType();
       subName(props.data.name);
    },[props]);

    useEffect(() => {
      // console.log(props.data.id);
      // console.log(props.data.name);

      // console.log(ctName);
      // console.log(ctType);
    }, [props]);

    return (
        <div>
            <div
                id="staticModal"
                data-modal-backdrop="static"
                tabIndex="-1"
                aria-hidden="true"
                className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full ${
                    props.show ? "" : "hidden"
                }`}
            >
                <div className="relative w-full max-w-3xl md:max-w-xl lg:max-w-3xl max-h-full top-[100px] left-1/2 md:left-[calc(50%+120px)] -translate-x-1/2">
                    {/*-- Modal content --*/}
                    <div className="relative bg-white rounded-lg shadow">
                        {/*-- Modal header --*/}
                        <div className="p-4 border-b rounded-t">
                            <div className="flex items-start justify-between">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-black">
                                    Edit Customer Name
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                    onClick={props.onHide}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </button>
                            </div>                                          

                        </div>

                        {/*-- Modal body --*/}
                        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-scroll">
                            <ul>
                                   {/* ส่วนแสดงข้อมูล Current */}
                            <div className="flex gap-2 mt-2 items-center">
                                <label htmlFor="ctName" className="w-1/3">Current Customer Name : </label>
                                 
                               <input 
                                    id="ctType" 
                                    className="w-1/6 border rounded px-2 py-1 bg-gray-100 text-gray-600" 
                                    value={ctype.find((t) => t.id === ctType)?.type || (ctType === 1 ? "none" : ctType)} 
                                    readOnly 
                                />   
                                 <input 
                                    id="ctName" 
                                    className="w-1/2 border rounded px-2 py-1 bg-gray-100 text-gray-600" 
                                    value={ctName || ""} 
                                    readOnly 
                                />        
                            </div>

                            {/* ส่วนกรอกข้อมูล New */}
                            <div className="flex gap-2 mt-3 items-center">
                                <label htmlFor="ctNameNew" className="w-1/3">New Customer Name : </label>
                                <select
                                    value={newType}
                                    onChange={(e) => setNewType(Number(e.target.value))}
                                    className="w-1/6 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500" 
                                >
                                    {ctype.map((t, i) => (
                                        <option value={t.id} key={"customerType-" + i}>
                                            {t.id == 1 ? "none" : t.type}
                                        </option>
                                    ))}
                                </select>

                                <input 
                                    id="ctNameNew" 
                                    className="w-1/2 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500" 
                                    value={newName} 
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Enter new name"
                                />        
                            </div>   
                            </ul>
                        </div>

                        {/*-- Modal footer --*/}
                        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b justify-between">
                            <button
                                type="button"
                                className="bg-gray-500 hover:bg-gray-400 text-white font-medium px-4 py-2 rounded shadow-sm flex items-center gap-2 transition-colors"
                                onClick={() => {
                                    setNewName("");
                                    setNewType("");
                                }}
                            >
                                Clear
                            </button>

                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
                                    onClick={confirmAndSave}
                                >
                                    Ok
                                </button>

                                <button
                                    type="button"
                                    className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
                                    onClick={props.onHide}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            {props.show && (
                <div
                    className="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"
                ></div>
            )}
        </div>
    );
}