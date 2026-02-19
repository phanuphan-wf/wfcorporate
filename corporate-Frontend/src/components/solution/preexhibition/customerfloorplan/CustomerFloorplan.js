import React, { createContext, useEffect, useState } from "react";
import Axios from "axios";

import ListFloorplan from "./ListFloorplan";

export default function CustomerFloorplan(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_fl;

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
    }

    useEffect(() => {
    console.log({ data});
    }, [data]);

    
    useEffect(() => {
        if (!file) {
            setPreview(null);        
            setData(prev => ({ ...prev, Picture: "" }));
            return;
        }    
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);    
        setData(prev => ({ ...prev, Picture: file.name }));
       
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const isFormValid = () => {

        console.log("Current file state:", file);

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

    return (
        <section id="CustomerFloorplan">
             <h1 className="text-xl font-medium">Customer Floorplan</h1>
                <div className="my-1 flex items-center">
                    <label htmlFor="txt-exid" className="w-[150px]">
                     EXID :
                    </label>
                    <input
                    type="text"
                    id="txt-exid"
                    className="w-[300px]"
                    placeholder=""
                    value={data.Exid}
                    onChange={(e) => setData({ ...data, Exid: e.target.value })}
                    />
                 
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

                        {file && (
                            <div className="flex flex-col items-start gap-2">
                                <button
                                    type="button"
                                    className="btn-gray px-3 py-1 text-sm"
                                    onClick={() => {
                                        setFile(null);
                                        document.getElementById("picture").value = "";
                                    }}
                                >
                                    Cancel
                                </button>
                                
                                <div className="max-w-[120px] border rounded overflow-hidden bg-gray-50">
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="object-contain w-full h-auto max-h-[100px]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="my-1 flex items-center">
                    <label htmlFor="txt-brow" className="w-[150px]">
                     Brow :
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
                    <input
                        type="text"
                        id="txt-decpth"
                        className="w-[300px]"
                        value={data.Decp_Th}
                        onChange={(e) => setData({ ...data, Decp_Th: e.target.value })}
                    />
                    </div>
                    <div className="flex items-center">
                    <label htmlFor="txt-decpen" className="w-[150px]">
                        Decp EN :
                    </label>
                    <input
                        type="text"
                        id="txt-decpen"
                        className="w-[300px]"
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
                    <input
                        type="text"
                        id="txt-productth"
                        className="w-[300px]"
                        value={data.Product_Th}
                        onChange={(e) => setData({ ...data, Product_Th: e.target.value })}
                    />
                    </div>
                    <div className="flex items-center">
                    <label htmlFor="txt-producten" className="w-[150px]">
                        Product EN :
                    </label>
                    <input
                        type="text"
                        id="txt-producten"
                        className="w-[300px]"
                        value={data.Product_En}
                        onChange={(e) => setData({ ...data, Product_En: e.target.value })}
                    />
                    </div>
                </div>

                <div className="flex justify-between mt-4 w-full md:w-2/3">
                    <button
                        className="px-2 btn-green"                       
                        // disabled={!isFormValid}
                        onClick={submitData}
                    >
                    Add 
                    </button>

                    <button 
                        className="btn-gray px-3" 
                        onClick={clickCancel}
                    >
                    Clear Data
                    </button>
                </div> 

               <ListFloorplan reload={reloadFlag} />
        </section>

      
    );
}