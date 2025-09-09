import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";

import { dataContext } from "../addNewProduct";

import ModalDelSign from "./modalDelSign";

export default function ProductList(props) {
  const { cusIDC, uploadC, productC } = useContext(dataContext);
  const [upload, setUpload] = uploadC;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctm;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [product, setProduct] = productC;
  const [productlist, setProductlist] = useState([]);
  const getList = async () => {
    const res = await Axios.get(url + "/getProduct/" + cusID).then((r) =>
      setProductlist(r.data)
    );
  };

  const [cusID, setcusID] = cusIDC;

  useEffect(() => {
    getList();
  }, [cusID, upload]);

  const [delId, setDelId] = useState("");

  const delProduct = (id, name, file) => {
    setTxtDel({ name: name, file: file });
    setDelId(id);
    setModalDel(true);
  };

  const [modalDel, setModalDel] = useState(false);
  const { BlobServiceClient } = require("@azure/storage-blob");

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

  const confirmDel = async (cf) => {
    if (cf) {
      try {
        const res = await Axios.delete(url + "/delProduct/" + delId);
        if (txtDel.file != undefined) {
          deletePic(txtDel.file, "solution-product");
        }
        setUpload(!upload);
      } catch (err) {
        alert("Error! - Cannot delete Product data");
      }
    }
    setModalDel(false);
  };

  const [txtDel, setTxtDel] = useState({ name: "", file: "" });

  const editProduct = (id) => {
    let p = productlist.filter((x) => x.productID == id)[0];
    setProduct({
      ProductID: p.productID,
      Name: p.name,
      Detail: p.detail,
      Brand: p.brand,
      Picture: p.picture,
    });
  };

  return (
    <div id="sign-list">
      <div className="text-lg">List of customer sign person</div>
      <div className="flex flex-col gap-2 my-2">
        {productlist.map((s, i) => (
          <div className="border rounded-md w-full flex gap-0.5 overflow-hidden">
            <div className="bg-zinc-500 text-white w-8 text-center">
              {i + 1}
            </div>
            <div
              id="product-data"
              className="flex gap-x-4 max-lg:gap-y-2 max-lg:flex-wrap w-full min-h-fit px-2 pb-1"
            >
              <div className="lg:basis-1/4 flex flex-col justify-between h-fit">
                <div>
                  <div className="flex gap-2">
                    <div>Product :</div>
                    <div>{s.name}</div>
                  </div>
                  <div className="flex gap-2">
                    <div>Brand :</div>
                    <div>{s.brand}</div>
                  </div>
                </div>
              </div>
              <div className="lg:basis-1/3 flex flex-col justify-between h-fit">
                <div className="flex gap-2">
                  <div className="min-w-fit">Detail :</div>
                  <div>{s.detail}</div>
                </div>
              </div>
              {s.picture != "" ? (
                <div className="lg:basis-1/4 flex gap-2">
                  <div>Product Picture</div>
                  <div className="max-w-[150px] h-[150px] mt-2">
                    <img
                      src={
                        "https://worldfair.blob.core.windows.net/solution-product/" +
                        s.picture
                      }
                      alt="productPicture"
                      className="object-contain object-center w-full max-h-[150px]"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="w-fit">
              <button
                className="bg-yellow-500 px-3 text-white flex h-full"
                onClick={() => editProduct(s.productID)}
              >
                Edit
              </button>
            </div>
            <div className="w-fit">
              <button
                className="bg-red-500 px-1 text-white flex h-full"
                onClick={() => delProduct(s.productID, s.name, s.picture)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModalDelSign
        show={modalDel}
        onHide={() => setModalDel(false)}
        confirmDel={confirmDel}
        txtDel={txtDel}
      />
    </div>
  );
}
