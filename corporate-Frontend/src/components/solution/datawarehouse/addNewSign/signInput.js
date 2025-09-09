import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { dataContext } from "../addNewSign";

export default function SignInput(props) {
  const { cusID, uploadC, signnameC, editlistC } = useContext(dataContext);
  const [upload, setUpload] = uploadC;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctm;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { BlobServiceClient } = require("@azure/storage-blob");

  const [signname, setSignname] = signnameC;

  const initSignname = {
    billing: false,
    customerID: 0,
    name: "",
    personalID: "",
    picture: 0,
    position: "",
    sign: false,
    signature: 0,
    tel: "",
  };

  const clearData = () => {
    setSignname(initSignname);
    setSignature({});
    setPicture({});
    document.getElementById("signPix").value = "";
    document.getElementById("cusPix").value = "";
  };

  const addSignname = async () => {
    if (signature.file != undefined) {
      if (signature.type != ".jpg") {
        alert('Please upload signature file "jpg" format only');
        return;
      }
      if (signature.size > 110000) {
        alert("Please upload file size not exceed 100KB");
        return;
      }
    }

    if (picture.file != undefined) {
      if (picture.type != ".jpg") {
        alert('Please upload signature file "jpg" format only');
        return;
      }
      if (picture.size > 520000) {
        alert("Please upload file size not exceed 500KB");
        return;
      }
    }
    const p = signname.signature;
    let data = signname;
    data.customerID = cusID;
    data.signature =
      signature.file != undefined
        ? signature.p_name.toString()
        : editlist
        ? signname.signature
        : "0";
    data.picture =
      picture.file != undefined
        ? picture.p_name.toString()
        : editlist
        ? signname.picture
        : "0";

    //console.log(data);

    if (!editlist) {
      try {
        const res = await Axios.post(url + "/addSignname", data).then((r) => {
          if (r.status == 200) {
            if (signature.file != undefined) {
              uploadPic(
                signature.file,
                signature.p_name + signature.type,
                "solution-signature"
              );
            }
          }
        });
        clearData();
        setUpload(!upload);
      } catch (err) {
        alert("Error! - add new signname data code: " + err.response.status);
      }
    } else {
      try {
        const res = await Axios.put(url + "/editSignname", data).then((r) => {
          if (r.status == 200) {
            if (signature.file != undefined) {
              deletePic(signname.signature + ".jpg", "solution-signature");
              uploadPic(
                signature.file,
                signature.p_name + signature.type,
                "solution-signature"
              );
            }
          }
        });
        clearData();
        setUpload(!upload);
        setEditlist(false);
      } catch (err) {
        alert("Error! - edit signname data code: " + err.response.status);
      }
    }
  };

  async function uploadPic(pic, name, folder) {
    const containerName = folder;

    let key = process.env.REACT_APP_sol_sign;

    const blobService = new BlobServiceClient(
      `https://worldfair.blob.core.windows.net/?${key}`
    );

    const containerClient = blobService.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(name);
    const options = { blobHTTPHeaders: { blobContentType: pic.type } };
    await blobClient.uploadData(pic, options);
  }

  async function deletePic(name, folder) {
    const containerName = folder;

    let key = process.env.REACT_APP_sol_product;

    const blobService = new BlobServiceClient(
      `https://worldfair.blob.core.windows.net/?${key}`
    );

    const containerClient = blobService.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(name);
    await blobClient.delete();
  }

  const [signature, setSignature] = useState({});

  const [picture, setPicture] = useState({});

  const [editlist, setEditlist] = editlistC;

  useEffect(() => {
    //console.log(signature);
  }, [signature]);

  /* covert แล้ว ติด promise เรียก file ไม่ได้

  const convertImg = async (url) => {
    const res = await fetch(url)
      .then((r) => r.blob())
      .then((b) => {
        const file = new File([b], signname.signature + ".jpg", {
          type: b.type,
        });
        return file;
      });
  };
  */

  useEffect(() => {
    if (!editlist) {
      clearData();
    }
  }, [editlist]);

  return (
    <div id="signName" className="mt-4">
      <div className=" flex justify-between max-md:flex-wrap items-start">
        <div id="sign-input" className="flex flex-col gap-2">
          <div className="sm:flex items-center gap-2">
            <label htmlFor="name" className="block">
              Name :
            </label>
            <input
              id="name"
              onChange={(e) =>
                setSignname({ ...signname, name: e.target.value })
              }
              value={signname.name}
            />
          </div>
          <div className="sm:flex items-center gap-2">
            <label htmlFor="position" className="block">
              Position :
            </label>
            <input
              id="position"
              onChange={(e) =>
                setSignname({ ...signname, position: e.target.value })
              }
              value={signname.position}
            />
          </div>
          <div className="sm:flex items-center gap-2">
            <label htmlFor="tel" className="block">
              Telephone :
            </label>
            <input
              id="tel"
              onChange={(e) =>
                setSignname({ ...signname, tel: e.target.value })
              }
              value={signname.tel}
            />
          </div>
          <div className="sm:flex items-center gap-2">
            <label htmlFor="pid" className="block">
              Personal ID :
            </label>
            <input
              id="pid"
              onChange={(e) =>
                setSignname({ ...signname, personalID: e.target.value })
              }
              value={signname.personalID}
            />
          </div>
          <div className="sm:flex items-center gap-2">
            <label htmlFor="signPix" className="block">
              Signature :
            </label>
            <input
              id="signPix"
              type="file"
              className="text-sm border-[#b3b3b3]"
              onChange={(e) =>
                setSignature({
                  ...signature,
                  name: e.target.files[0].name,
                  file: e.target.files[0],
                  p_name: Date.now() + cusID,
                  size: e.target.files[0].size,
                  type: e.target.files[0].name.substring(
                    e.target.files[0].name.lastIndexOf(".")
                  ),
                })
              }
            />
          </div>
          <div className="sm:flex items-center gap-2">
            <label htmlFor="cusPix" className="block">
              Picture :
            </label>
            <input
              id="cusPix"
              type="file"
              className="text-sm border-[#b3b3b3]"
              onChange={(e) =>
                setPicture({
                  ...picture,
                  name: e.target.files[0].name,
                  file: e.target.files[0],
                  p_name: Date.now() + cusID,
                  size: e.target.files[0].size,
                  type: e.target.files[0].name.substring(
                    e.target.files[0].name.lastIndexOf(".")
                  ),
                })
              }
            />
          </div>
        </div>

        {signature.file != undefined ? (
          <div>
            <div>Signature Spacimen</div>
            <div className="max-w-[120px] max-h-[100px] mt-2">
              <img
                src={URL.createObjectURL(signature.file)}
                alt="signature"
                className="object-contain object-center w-full max-h-[100px]"
              />
            </div>
          </div>
        ) : (
          editlist && (
            <div>
              <div>Signature Spacimen</div>
              <div className="max-w-[120px] max-h-[100px] mt-2">
                <img
                  src={
                    "https://worldfair.blob.core.windows.net/solution-signature/" +
                    signname.signature +
                    ".jpg"
                  }
                  alt="signature"
                  className="object-contain object-center w-full max-h-[100px]"
                />
              </div>
            </div>
          )
        )}
        {picture.file != undefined && (
          <div>
            <div>Sign Person Picture</div>
            <div className="max-w-[188px] max-h-[250px] mt-2">
              <img
                src={URL.createObjectURL(picture.file)}
                alt="Picture"
                className="object-contain object-center w-full max-h-[250px]"
              />
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex justify-between mt-2">
        <button className="btn-primary px-2" onClick={clearData}>
          Clear Data
        </button>
        <button
          className={`btn-green px-3 ${
            editlist
              ? "border-yellow-500 bg-yellow-500 hover:border-yellow-500 hover:text-yellow-500"
              : ""
          }`}
          onClick={() => addSignname()}
        >
          {!editlist ? "Submit" : "Edit Data"}
        </button>
      </div>
    </div>
  );
}
