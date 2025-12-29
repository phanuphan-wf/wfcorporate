import React, { useEffect, useState } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import Hilight from "./highlightdata";

export default function HighlightExhibition(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_exh;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { BlobServiceClient } = require("@azure/storage-blob");

  const [logo, setLogo] = useState({});
 

  const initData = {
    Title: "",
    Text: "",      
    Showdate: "",
  };  
  const [data, setData] = useState(initData);
  console.log(data);

  const clickCancel = () => {
    setData(initData);
    setLogo({});
    document.getElementById("logo").value = "";
  };

  async function uploadPic(pic, name, folder) {
    const containerName = folder;

    let key = process.env.REACT_APP_sol_exh;

    const blobService = new BlobServiceClient(
      `https://worldfair.blob.core.windows.net/?${key}`
    );

    const containerClient = blobService.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(name);
    const options = { blobHTTPHeaders: { blobContentType: pic.type } };
    await blobClient.uploadData(pic, options);
  }

  const submitData = async () => {
    
    if (data.Title === "") {
      alert("Please input Title before save.");
      return;
    }

    if (data.Text === "") {
      alert("Please input Text before save.");
      return;
    }

    if (data.Showdate === "") {
      alert("Please input Show Date before save.");
      return;
    }
   
    if (!logo.file) {
      alert("Please select Highlight image before save.");
      return;
    }

    let dat = data;
    if (logo.file != undefined) {
      if (logo.type != ".jpg" && logo.type != ".png") {
        alert('Please upload logo file "jpg" or "png" format only');
        return;
      }
      if (logo.size > 520000) {
        alert("Please upload file size not exceed 500KB");
        return;
      }
      await uploadPic(logo.file, logo.p_name + logo.type, "solution-exlogo");
      dat.Logo = logo.p_name + logo.type;
    }

    // const res = await Axios.post(url + "/addExhibition", dat).then((r) => {
    //   if (r.status == 200) {
    //     alert("Save success.");
    //     clickCancel();
    //   } else {
    //     alert("Save failed.");
    //   }
    // });
  };

  useEffect(() => {
    console.log(logo);
  }, [logo]);

  return (


    <section id="createHighlightExhibition" className="xl:w-4/5 2xl:w-3/4">
      {/* <div className="text-xl">Data Highlight Exhibition</div> */}
       <div className="my-4">   
          <Hilight/>
        </div>

      <div className="text-xl">Highlight Exhibition</div>
        <div className="my-4">        
          <div className="flex items-center gap-3 mb-3 w-full">
            <label className="w-36" htmlFor="Title">
              Title
            </label>
            <input
              type="text"
              className="md:w-96"
              id="Title"
              onChange={(e) => setData({ ...data, Title: e.target.value })}
              value={data.Title}
            />
          </div>
          
          <div className="flex items-center gap-3 mb-3 w-full">
            <label className="w-36" htmlFor="Text">
              Text
            </label>
            <input
              type="text"
              className="w-96"
              id="Text"
              onChange={(e) => setData({ ...data, Text: e.target.value })}
              value={data.Text}
            />
          </div>

          <div className="flex items-center gap-3 mb-3 w-full">
            <label className="w-36" htmlFor="Showdate">
              Show Date
            </label>
            <input
              type="text"
              className="md:w-96"
              id="Showdate"
              onChange={(e) => setData({ ...data, Showdate: e.target.value })}
              value={data.Showdate}
            />
          </div>       
        
          <div className="flex items-start gap-3 mb-3 w-full">
            <label className="w-36" htmlFor="logo">
              Highlight image
            </label>
            <div>
              <input
                type="file"
                className="md:w-96"
                id="logo"
                onChange={(e) => {                         
                    setLogo({
                      ...logo,
                      name: e.target.files[0].name,
                      file: e.target.files[0],
                      p_name: Date.now() + "_" + data.ExhibitionID,
                      size: e.target.files[0].size,
                      type: e.target.files[0].name.substring(
                        e.target.files[0].name.lastIndexOf(".")
                      ),
                    });
                  }}
                  disabled={data.Title === ""}
                />
              <div>
                {logo.file != undefined && (
                  <button
                    className="btn-gray px-2 mt-2"
                    onClick={() => {
                      setLogo({});
                      document.getElementById("logo").value = "";
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            <div className="max-w-[120px] max-h-[100px] mt-2">
              {logo.file != undefined && (
                <img
                  src={URL.createObjectURL(logo.file)}
                  alt="signature"
                  className="object-contain object-center w-full max-h-[100px]"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button className="btn-gray px-2" onClick={clickCancel}>
            Cancel
          </button>
          <button className="btn-green px-4" onClick={submitData}>
            Add
          </button>
        </div>
       
    </section>
  );
}
