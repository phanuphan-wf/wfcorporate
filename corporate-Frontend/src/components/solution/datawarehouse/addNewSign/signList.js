import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { useLocalStorage } from "../../../hook/useLocalStorage";

import { dataContext } from "../addNewSign";

import ModalDelSign from "./modalDelSign";

export default function SignList(props) {
  const { cusID, uploadC, signnameC, editlistC } = useContext(dataContext);
  const [upload, setUpload] = uploadC;
  const [signname, setSignname] = signnameC;
  const [editlist, setEditlist] = editlistC;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctm;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [signlist, setSignlist] = useState([]);

  const getList = async () => {
    const res = await Axios.get(url + "/GetSignList/" + cusID).then((r) =>
      setSignlist(r.data)
    );
  };

  useEffect(() => {
    if (cusID) {
      getList();
    }
  }, [cusID, upload]);

  useEffect(() => {
    //console.log(signlist);
  }, [signlist]);

  const [delId, setDelId] = useState("");

  const delSign = (id, name, file) => {
    setTxtDel({ name: name, file: file });
    setDelId(id);
    setModalDel(true);
  };

  const [modalDel, setModalDel] = useState(false);
  const { BlobServiceClient } = require("@azure/storage-blob");

  async function deletePic(name, folder) {
    const containerName = folder;

    let key = process.env.REACT_APP_sol_sign;

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
        const res = await Axios.delete(url + "/delSignname/" + delId);
        deletePic(txtDel.file, "solution-signature");
        setUpload(!upload);
      } catch (err) {
        alert("Error! - Cannot delete signname data");
      }
    }
    setModalDel(false);
  };

  const [txtDel, setTxtDel] = useState({ name: "", file: "" });

  const Acc = useLocalStorage("user")[0].ALevel;

  const changeSign = async (s) => {
    const res = await Axios.put(url + "/updateSign/" + cusID + "/" + s).then(
      (r) => setSignlist(r.data)
    );
  };

  const changeBill = async (s) => {
    const res = await Axios.put(url + "/updateBill/" + cusID + "/" + s).then(
      (r) => setSignlist(r.data)
    );
  };

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

  const editSign = (x) => {
    if (!editlist) {
      const sl = signlist.filter((s) => s.authorizeID == x)[0];
      setSignname(sl);
    } else {
      setSignname(initSignname);
    }
    setEditlist(!editlist);
  };

  return (
    <div id="sign-list">
      <div className="text-lg">List of customer sign person</div>
      <div className="flex flex-col gap-2 my-2">
        {signlist.map((s, i) => (
          <div className="border rounded-md w-full overflow-hidden flex gap-2 max-md:flex-wrap">
            <div className="bg-zinc-500 text-white w-8 text-center">
              {i + 1}
            </div>
            <div
              id="sign-data"
              className="flex gap-x-4 max-lg:gap-y-2 max-lg:flex-wrap w-full px-2 pb-1"
            >
              <div className="lg:basis-1/4 flex flex-col justify-between h-fit">
                <div>
                  <div className="flex gap-2">
                    <div>Name :</div>
                    <div>{s.name}</div>
                  </div>
                  <div className="flex gap-2">
                    <div>Position :</div>
                    <div>{s.position}</div>
                  </div>
                </div>
                {s.sign ? (
                  <div className="w-full bg-green-600 text-white text-center py-1 rounded-md">
                    Sign Person
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="lg:basis-1/4 flex flex-col justify-between h-fit">
                <div>
                  <div className="flex gap-2">
                    <div>Telephone :</div>
                    <div>{s.tel}</div>
                  </div>
                  <div className="flex gap-2">
                    <div>Personal ID :</div>
                    <div>{s.personalID}</div>
                  </div>
                </div>
                {s.billing ? (
                  <div className="w-full bg-pink-600 text-white text-center py-1 rounded-md">
                    Bill Person
                  </div>
                ) : (
                  ""
                )}
              </div>
              {s.signature != 0 ? (
                <div className="lg:basis-1/4">
                  <div>Signature Spacimen</div>
                  <div className="max-w-[150px] h-[70px] mt-2">
                    <img
                      src={
                        "https://worldfair.blob.core.windows.net/solution-signature/" +
                        s.signature +
                        ".jpg"
                      }
                      alt="signature"
                      className="object-contain object-center w-full max-h-[80px]"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              {s.picture != 0 ? (
                <div className="lg:basis-1/4">
                  <div>Sign Person Picture</div>
                  <div className="max-w-[150px] max-h-[140px] mt-2">
                    <img
                      src=""
                      alt="Picture"
                      className="object-contain object-center w-full max-h-[140px]"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="flex min-w-fit max-md:flex-col max-md:w-full gap-0.5">
              <div className="flex md:flex-col md:w-20 w-full gap-0.5">
                <button
                  className="bg-yellow-500 px-3 text-white flex h-full items-center cursor-pointer max-md:w-full max-md:justify-center max-md:py-2"
                  onClick={() => editSign(s.authorizeID)}
                >
                  {!editlist ? "edit" : "cancel"}
                </button>

                {!s.sign && (
                  <button
                    className="bg-green-600 px-2 text-white flex h-full items-center cursor-pointer max-md:w-full max-md:justify-center max-md:py-2"
                    onClick={() => changeSign(s.authorizeID)}
                  >
                    set sign
                  </button>
                )}
                {!s.billing && (
                  <button
                    className="bg-pink-600 px-2 text-white flex h-full items-center cursor-pointer max-md:w-full max-md:justify-center max-md:py-2"
                    onClick={() => changeBill(s.authorizeID)}
                  >
                    set bill
                  </button>
                )}
              </div>
              {Acc == 1 && (
                <div className="w-full md:w-fit min-w-fit">
                  <button
                    className="bg-red-500 px-1 text-white flex h-full items-center cursor-pointer max-md:w-full max-md:justify-center max-md:py-2"
                    onClick={() =>
                      delSign(s.authorizeID, s.name, s.signature + ".jpg")
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
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
