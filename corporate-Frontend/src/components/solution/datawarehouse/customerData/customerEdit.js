import React, { useState, useEffect } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";

export default function CustomerDetail({customerName, onUpdate}) {   
    
    const bearer = useHeader();
    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cdp;
    const urlType = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctm;
    Axios.defaults.headers.common = {
        Authorization: "Bearer " + bearer,
    };
    
    const [isEdit, setIsEdit] = useState(false);

    const [ctName, setCtName] = useState("");
    const [customerType, setCustomerType] = useState(1);

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
            setCustomerType(1);
            setCtName(nameStr || "");

            return;
        }

        const trimmedName = nameStr.trim();

        // 1. เคสพิเศษ: บริษัทจำกัดมหาชน (ID: 7) เช่น "บริษัท เมเจอร์ ซีนีแพล็ก กรุ๊ป (มหาชน) จำกัด"
        if (trimmedName.startsWith("บริษัท") && trimmedName.includes("มหาชน")) {
            setCustomerType(7);
            let remaining = trimmedName.replace(/^บริษัท\s*/, ""); // ตัด "บริษัท " ข้างหน้า
            remaining = remaining.replace(/\s*\(มหาชน\)\s*จำกัด$/, ""); // ตัด "(มหาชน) จำกัด" ข้างหลัง
            remaining = remaining.replace(/\s*จำกัด\s*\(มหาชน\)$/, ""); // เผื่อกรณีสลับคำ
            setCtName(remaining.trim());
            return;
        }

        // 2. เคสพิเศษ: บริษัทจำกัดทั่วไป (ID: 2) เช่น "บริษัท เครี่ เดอะเดย์ บายจา จำกัด"
        if (trimmedName.startsWith("บริษัท") && trimmedName.endsWith("จำกัด")) {
            setCustomerType(2);
            let remaining = trimmedName.replace(/^บริษัท\s*/, ""); // ตัด "บริษัท " ข้างหน้า
            remaining = remaining.replace(/\s*จำกัด$/, "");      // ตัด " จำกัด" ข้างหลัง
            setCtName(remaining.trim());
            return;
        }

        // 3. เคสทั่วไปสำหรับประเภทอื่นๆ (ร้าน, หจก., ฯลฯ)
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

            setCustomerType(matchedType.id);
            setCtName(remainingName);
        } else {
            // ถ้าไม่เข้าเงื่อนไขไหนเลย ให้เป็น ID 1 (none)
            setCustomerType(1); 
            setCtName(trimmedName);
        }
    };

    // ปุ่มกด Edit
    const handleEdit = () => {
        subName(customerName?.name);
        setIsEdit(true);
    };

    // ปุ่มกด Cancel
    const handleCancel = () => {
        setIsEdit(false);
        subName(customerName?.name); 
    };

    
    const handleSave = async () => {
        if (!ctName.trim()) {
            alert("กรุณากรอกชื่อลูกค้า");
            return;
        }                   
            const id =  customerName.id;              
            const playload = {
                name: ctName.trim(),
                type: customerType,              
            };


        try {
            await Axios.put(url + "/editCustomer/" + id, playload);
        } catch (error) {
            console.error("Error updating customer name:", error);
            alert("Error update customer");
            return;
        }

        alert("บันทึกข้อมูลสำเร็จ!");
        setIsEdit(false);

        if (onUpdate) {
            try {
                await onUpdate();
            } catch (error) {
                console.error("Error refreshing customer detail:", error);
                alert("บันทึกข้อมูลสำเร็จ แต่ไม่สามารถโหลดข้อมูลล่าสุดได้");
            }
        }
    };

    useEffect(() => {
        getType();
    }, [customerName]);

    
    useEffect(() => {
        if (customerName?.name && ctype.length > 0) {
            subName(customerName.name);
        }
    }, [customerName, ctype]);

    // 3. useEffect สำหรับ Debug ค่าที่จะแสดงผล (พิมพ์ออกมาเฉพาะตอนค่าเปลี่ยนจริง ๆ)
    useEffect(() => {
        console.log("--- Debug State ---");
        console.log(customerType);
        console.log(ctName);
    }, [customerType, ctName]);

    
    // Debug เช็กค่า
    useEffect(() => {
        //console.log("Customer Type:", customerType);
       // console.log("Customer Name Only:", ctName);
    }, [customerType, ctName]);

    return (
        <div className="flex flex-wrap items-center mt-4 gap-2">
            <label htmlFor="customerName" className="mr-2 flex-shrink-0 font-medium">
                Customer Name :
            </label>

            {isEdit ? (
                <div className="flex items-center gap-2">
                    {/* เลือกประเภทลูกค้า */}
                    <select
                        value={customerType}
                        onChange={(e) => setCustomerType(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                         {ctype.map((t, i) => (
                            <option value={t.id} key={"customerType-" + i}>
                            {t.id == 1 ? "none" : t.type}
                            </option>
                        ))}
                    </select>

                    {/* ช่องแก้ไขชื่อเฉพาะ (ไม่มีคำว่า บริษัท/ห้าง/ร้าน ติดอยู่) */}
                    <input
                        type="text"
                        id="customerName"
                        value={ctName}
                        onChange={(e) => setCtName(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                </div>
            ) : (
                <span className="font-semibold text-gray-800">
                    {customerName?.name || "-"}
                </span>
            )}

            {isEdit ? (
                <>
                    <button
                        type="button"
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm transition"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </>
            ) : (
                <button
                    type="button"
                    className="ml-2 bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 text-sm transition"
                    onClick={handleEdit}
                >
                    Edit
                </button>
            )}
        </div>
    );
}