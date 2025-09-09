import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { dataContext } from "../addNewProduct";

export default function ProductInput(props) {
  const { cusIDC, uploadC, productC } = useContext(dataContext);
  const [upload, setUpload] = uploadC;
  const [cusID, setCusID] = cusIDC;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctm;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { BlobServiceClient } = require("@azure/storage-blob");

  const initProduct = {
    CustomerID: 0,
    Name: "",
    Detail: "",
    Brand: "",
    Picture: "",
  };

  const [product, setProduct] = productC;

  const clearData = () => {
    setProduct(initProduct);
    setPicture({});
    document.getElementById("productPix").value = "";
  };

  const addSignname = async () => {
    if (picture.file != undefined) {
      if (picture.type != ".jpg" && picture.type != ".png") {
        alert('Please upload product file "jpg" or "png" format only');
        return;
      }
      if (picture.size > 530000) {
        alert("Please upload file size not exceed 500KB");
        return;
      }
    }
    const p = product.Picture;
    let data = product;
    data.CustomerID = cusID;
    data.Picture =
      picture.file != undefined
        ? picture.p_name + picture.type
        : product.Picture != ""
        ? product.Picture
        : "0";

    if (!product.ProductID) {
      try {
        const res = await Axios.post(url + "/addProduct", data).then((r) => {
          if (r.status == 200) {
            if (picture.file != undefined) {
              uploadPic(
                picture.file,
                picture.p_name + picture.type,
                "solution-product"
              );
            }
          }
        });

        clearData();
        setUpload(!upload);
      } catch (err) {
        alert("Error! - add new product data code: " + err.response.status);
      }
    } else {
      try {
        const res = await Axios.put(url + "/editProduct", data).then((r) => {
          if (r.status == 200) {
            if (picture.file != undefined) {
              console.log("p before del", p);
              deletePic(p, "solution-product");
              uploadPic(
                picture.file,
                picture.p_name + picture.type,
                "solution-product"
              );
            }
          }
        });

        clearData();
        setUpload(!upload);
      } catch (err) {
        alert("Error! - edit product data code: " + err.response.status);
      }
    }
  };

  async function uploadPic(pic, name, folder) {
    const containerName = folder;

    let key = process.env.REACT_APP_sol_product;

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

  const [picture, setPicture] = useState({});

  useEffect(() => {
    //console.log(product);
  }, [product]);

  return (
    <div id="signName" className="mt-4">
      <div className=" flex justify-between max-md:flex-wrap items-start">
        <div id="sign-input" className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="name">Product Name :</label>
            <input
              id="name"
              onChange={(e) => setProduct({ ...product, Name: e.target.value })}
              value={product.Name}
            />
          </div>
          <div className="flex items-start gap-2">
            <label htmlFor="detail">Detail :</label>
            <textarea
              id="detail"
              onChange={(e) =>
                setProduct({ ...product, Detail: e.target.value })
              }
              value={product.Detail}
              rows={3}
              className="border border-[#b3b3b3] rounded-md w-full max-w-[300px] focus:outline-none p-1 focus:shadow-[0px_0px_0px_3.2px_#ffffff,0px_0px_5px_4px_#ff0000] focus:border-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="brand">Brand :</label>
            <input
              id="brand"
              onChange={(e) =>
                setProduct({ ...product, Brand: e.target.value })
              }
              value={product.Brand}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="productPix">Picture :</label>
            <input
              id="productPix"
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
        {picture.file != undefined ? (
          <div className="md:basis-1/3">
            <div>Product Picture</div>
            <div className="max-w-[188px] max-h-[250px] mt-2">
              <img
                src={URL.createObjectURL(picture.file)}
                alt="Picture"
                className="object-contain object-center w-full max-h-[250px]"
              />
            </div>
          </div>
        ) : product.Picture != "" ? (
          <div className="md:basis-1/3">
            <div>Product Picture</div>
            <div className="max-w-[188px] max-h-[250px] mt-2">
              <img
                src={
                  "https://worldfair.blob.core.windows.net/solution-product/" +
                  product.Picture
                }
                alt="Picture"
                className="object-contain object-center w-full max-h-[250px]"
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="w-full flex justify-between mt-2">
        <button className="btn-primary px-2" onClick={clearData}>
          Clear Data
        </button>
        <button
          className={`btn-green px-3 ${
            product.ProductID
              ? "bg-yellow-500 border-yellow-500  hover:text-yellow-500 hover:border-yellow-500"
              : ""
          }`}
          onClick={() => addSignname()}
        >
          {product.ProductID ? "Edit Data" : "Submit"}
        </button>
      </div>
    </div>
  );
}
