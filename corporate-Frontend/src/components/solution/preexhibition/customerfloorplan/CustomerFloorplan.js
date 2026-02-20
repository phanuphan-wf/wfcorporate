import React, { createContext, useEffect, useState } from "react";
import Axios from "axios";


import ListFloorplan from "./ListFloorplan";

export default function CustomerFloorplan(props) {
  const urlEx = process.env.REACT_APP_API_URI + process.env.REACT_APP_squ;
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_fl;
    const [exList, setExList] = useState([]);

    const getEx = async () => {
        try {
            const res = await Axios.get(urlEx + "/exlist");
            if (res.status === 200) {
                setExList(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getEx();
    }, []);


    const Floorplandata = {
        Exid : "",
        Name_th : "",
        Name_en : "",
        Picture : "",
        Brow : "",
        Decp_Th : "",
        Decp_En : "",
        Product_Th : "",
        Product_En : "",

    };

    const [data, setData] = useState(Floorplandata);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [reloadFlag, setReloadFlag] = useState(0);

    const clickCancel = () => {
      setData(Floorplandata);
      setFile(null);
      document.getElementById("picture").value = "";
      setIsEditMode(false);
    }

    // useEffect(() => {
    // console.log({ data});
    // }, [data]);

    
    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        setData(prev => ({
            ...prev,
            Picture: file.name
        }));

        return () => URL.revokeObjectURL(objectUrl);

    }, [file]);

    const imageUrl = preview || (data?.Picture
        ? `https://worldfair.blob.core.windows.net/showfloorplan/${data.Picture}`
        : null);

    const isFormValid = () => {     

        if (!data.Exid.trim()) {
            alert("Please enter the Product ID (Exid).");
            return false;
        }

        if (!data.Name_th.trim()) {
            alert("Please enter the Product Name (Thai).");
            return false;
        }
        
        if (!data.Name_en.trim()) {
            alert("Please enter the Product Name (English).");
            return false;
        }         

        if (!data.Picture.trim()) { 
            alert("Please upload a product image.");
            return false;
        }

        if (!data.Brow.trim()) {
            alert("Please enter the Brow.");
            return false;
        } 

        if (!data.Decp_Th.trim()) {
            alert("Please enter the Description (Thai).");
            return false;
        }

        if (!data.Decp_En.trim()) {
            alert("Please enter the Description (English).");
            return false;
        }

        if (!data.Product_Th.trim()) {
            alert("Please enter the Product Details (Thai).");
            return false;
        }

        if (!data.Product_En.trim()) {
            alert("Please enter the Product Details (English).");
            return false;
        }   
       
        
        // All checks passed
        return true;
    }


    const submitData = async () => {
     if (!isFormValid()) return;

        try {
            const formData = new FormData();

            formData.append("Exid", data.Exid);
            formData.append("Name_th", data.Name_th);
            formData.append("Name_en", data.Name_en);
            formData.append("Picture", file);
            formData.append("Brow", data.Brow);
            formData.append("Decp_Th", data.Decp_Th);
            formData.append("Decp_En", data.Decp_En);
            formData.append("Product_Th", data.Product_Th);
            formData.append("Product_En", data.Product_En);  

            const res = await Axios.post(url + "/postCustomer/", formData);

                if (res.status === 200) {
                    alert("Add FloorPlan Success");
                    setData(Floorplandata);
                    setFile(null); 
                    document.getElementById("picture").value = "";  
                    setReloadFlag((prev) => prev + 1);              
                
                }
            } catch (error) {
                console.error(error);
                alert("Submit failed");
            }
    };

    const [editData, setEditData] = useState(null);    
    const [isEditMode, setIsEditMode] = useState(false);
    const handleEditFromList = (data) => {
        setEditData(data);       
    };

    useEffect(() => {
        if (!editData) return;

        const fetchDetail = async () => {
            try {
                const [resTH, resEN] = await Promise.all([
                    Axios.get(url + "/getDetail/" + editData, {
                        headers: { "Accept-Language": "th" },
                    }),
                    Axios.get(url + "/getDetail/" + editData, {
                        headers: { "Accept-Language": "en" },
                    }),
                ]);

                if (resTH.status === 200 && resEN.status === 200) {
                    setData({
                        id: resEN.data.id,
                        Name_th: resTH.data.name,
                        Name_en: resEN.data.name,
                        Picture: resEN.data.picture,
                        Brow: resEN.data.brow,
                        Decp_Th: resTH.data.description,
                        Decp_En: resEN.data.description,
                        Product_Th: resTH.data.product,
                        Product_En: resEN.data.product,
                    });
                }
            } catch (error) {
                console.error("Fetch detail error:", error);
            }
        };

        fetchDetail();
        setIsEditMode(true);

    }, [editData]);

    const editFloorplan = async () => {
        try {
            const formData = new FormData();

            formData.append("Exid", data.Exid);
            formData.append("Name_th", data.Name_th);
            formData.append("Name_en", data.Name_en);           
            formData.append("Picture", file);  
            formData.append("Brow", data.Brow);
            formData.append("Decp_Th", data.Decp_Th);
            formData.append("Decp_En", data.Decp_En);
            formData.append("Product_Th", data.Product_Th);
            formData.append("Product_En", data.Product_En);

            const res = await Axios.put(url+"/putCustomer/" + data.id,formData);

            if (res.status === 204) {
                alert("Edit FloorPlan Success");
                setData(Floorplandata);
                setFile(null); 
                document.getElementById("picture").value = "";  
                setIsEditMode(false);
                setReloadFlag(prev => prev + 1);
            }

        } catch (error) {
            console.error(error);
            alert("Edit failed");
        }
    };
   

    return (
        <section id="CustomerFloorplan">
             <h1 className="text-xl font-medium">Customer Floorplan</h1>
                <div className="my-1 flex items-center">
                    <label htmlFor="txt-exid" className="w-[150px]">
                     EXID :
                    </label>

                    <select
                        id="exhibition"
                        className="cmb w-[300px]"
                        value={data.Exid || ""}
                        onChange={(e) =>
                            setData({ ...data, Exid: e.target.value })
                        }
                    >
                        <option value="" disabled hidden>
                            Please select exhibition
                        </option>

                        {exList.map((ex, i) => (
                            <option key={ex.id ?? i} value={ex.id}>
                                {ex.name} ({ex.id})
                            </option>
                        ))}
                    </select>

                   
                 
                </div>

                <div className="my-1 flex items-center max-sm:flex-wrap gap-3">
                    <div className="flex items-center">
                    <label htmlFor="txt-nameth" className="w-[150px]">
                        Name TH :
                    </label>
                    <input
                        type="text"
                        id="txt-nameth"
                        className="w-[300px]"
                        value={data.Name_th}
                        onChange={(e) => setData({ ...data, Name_th: e.target.value })}
                    />
                    </div>
                    <div className="flex items-center">
                    <label htmlFor="txt-nameen" className="w-[150px]">
                        Name EN :
                    </label>
                    <input
                        type="text"
                        id="txt-nameen"
                        className="w-[300px]"
                        value={data.Name_en}
                        onChange={(e) => setData({ ...data, Name_en: e.target.value })}
                    />
                    </div>
                </div>

                <div className="my-1 flex items-center"> 
                    <label htmlFor="picture" className="w-[150px] pt-1">
                        Picture :
                    </label>

                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            id="picture"
                            accept="image/*" 
                            className="w-[300px]"
                            onChange={(e) => { setFile(e.target.files[0]); }}
                            
                        />

                        {imageUrl && (
                            <div className="flex flex-col items-start gap-2">

                                {file && (
                                    <button
                                        type="button"
                                        className="btn-gray px-3 py-1 text-sm"
                                        onClick={() => {
                                            setFile(null);
                                            setPreview(null);
                                            document.getElementById("picture").value = "";
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}

                                <div className="max-w-[120px] border rounded overflow-hidden bg-gray-50">
                                    <img
                                        src={imageUrl}
                                        alt=""
                                        className="object-contain w-full h-auto max-h-[100px]"
                                    />
                                </div>

                            </div>
                        )}
                    </div>
                </div>

                <div className="my-1 flex items-center">
                    <label htmlFor="txt-brow" className="w-[150px]">
                     Row :
                    </label>
                    <input
                    type="text"
                    id="txt-brow"
                    className="w-[300px]"
                    placeholder=""
                    value={data.Brow}
                    onChange={(e) => setData({ ...data, Brow: e.target.value })}
                    />
                 
                </div>

                <div className="my-1 flex items-center max-sm:flex-wrap gap-3">
                    <div className="flex items-center">
                    <label htmlFor="txt-decpth" className="w-[150px]">
                        Decp TH :
                    </label>

                    <textarea
                        className="border border-[#b3b3b3] w-[300px] rounded-md px-2 py-1 focus:outline-none focus:shadow-[0_0_0_0.2rem_white,0_0_5px_0.25rem_red] focus:border-white"
                        rows={3}
                        value={data.Decp_Th}
                        onChange={(e) => setData({ ...data, Decp_Th: e.target.value })}
                    />
                    
                    </div>
                    <div className="flex items-center">
                    <label htmlFor="txt-decpen" className="w-[150px]">
                        Decp EN :
                    </label>                   
                    <textarea
                        className="border border-[#b3b3b3] w-[300px] rounded-md px-2 py-1 focus:outline-none focus:shadow-[0_0_0_0.2rem_white,0_0_5px_0.25rem_red] focus:border-white"
                        rows={3}
                        value={data.Decp_En}
                         onChange={(e) => setData({ ...data, Decp_En: e.target.value })}
                    />
                    </div>
                </div>

                <div className="my-1 flex items-center max-sm:flex-wrap gap-3">
                    <div className="flex items-center">
                    <label htmlFor="txt-productth" className="w-[150px]">
                        Product TH :
                    </label>               

                    <textarea
                        className="border border-[#b3b3b3] w-[300px] rounded-md px-2 py-1 focus:outline-none focus:shadow-[0_0_0_0.2rem_white,0_0_5px_0.25rem_red] focus:border-white"
                        rows={3}
                        value={data.Product_Th}
                        onChange={(e) => setData({ ...data, Product_Th: e.target.value })}
                    />
                    </div>
                    <div className="flex items-center">
                    <label htmlFor="txt-producten" className="w-[150px]">
                        Product EN :
                    </label>               
                    <textarea
                        className="border border-[#b3b3b3] w-[300px] rounded-md px-2 py-1 focus:outline-none focus:shadow-[0_0_0_0.2rem_white,0_0_5px_0.25rem_red] focus:border-white"
                        rows={3}
                        value={data.Product_En}
                        onChange={(e) => setData({ ...data, Product_En: e.target.value })}
                    />
                    </div>
                </div>

                <div className="flex justify-between mt-4 w-full md:w-2/3">                   

                    {isEditMode ? (
                        <button className="px-2 bg-orange-500 hover:bg-orange-600 text-white rounded" onClick={editFloorplan}>
                        Save Edit
                        </button>
                    ) : (
                        <button className="px-2 btn-green" onClick={submitData}>
                            Add 
                        </button>
                    )}                                   


                    <button 
                        className="btn-gray px-3" 
                        onClick={clickCancel}
                    >
                    Clear Data
                    </button>
                </div> 

                <ListFloorplan reload={reloadFlag} onEdit={handleEditFromList} />
              
        </section>

      
    );
}