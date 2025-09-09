import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import { useLocalStorage } from "../../../hook/useLocalStorage";
import useHeader from "../../../hook/useHeader";
import { dataContext } from "../editCus";

import ModalDelAddr from "./modalDelAddr";

export default function AddrList(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctm;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const Acc = useLocalStorage("user")[0].ALevel;

  const { cusIDC, customerAC, aftSubmitC } = useContext(dataContext);

  const [cusID, setCusID] = cusIDC;

  const [customerA, setCustomerA] = customerAC;

  const [addrList, setAddrList] = useState([]);

  const getAddrList = async () => {
    const res = await Axios.get(url + "/getAddr/" + cusID).then((r) =>
      setAddrList(r.data)
    );
  };

  useEffect(() => {
    if (cusID) {
      getAddrList();
    }
  }, [cusID, aftSubmitC]);

  const changeUse = async (a) => {
    const res = await Axios.put(url + "/updateAddr/" + cusID + "/" + a).then(
      (r) => setAddrList(r.data)
    );
  };

  const changeTax = async (a) => {
    const res = await Axios.put(url + "/updateTax/" + cusID + "/" + a).then(
      (r) => setAddrList(r.data)
    );
  };

  const [modalDel, setModalDel] = useState(false);

  const closeModalDel = () => setModalDel(false);

  const [delID, setDelID] = useState({});
  const openModalDel = (id) => {
    let st = addrList.filter((a) => a.addrID == id)[0].street;
    setDelID({ id: id, st: st });
    setModalDel(true);
  };
  const confirmDel = (cf) => {
    if (cf) {
      delAddr(delID.id);
    }
    setModalDel(false);
  };

  const delAddr = async (a) => {
    const res = await Axios.delete(url + "/delAddr/" + a).then((r) => {
      if (r.status === 200) {
        getAddrList();
      }
    });
  };

  const initCustomerA = {
    Street: "",
    SubDistrict: "0",
    District: "0",
    Province: "0",
    Postal: "",
    Tel: "",
    Fax: "",
    web: "",
    email: "",
    TaxID: "",
    TaxName: "",
    Branch: "1",
    subBranch: "000",
  };

  const editData = (dat) => {
    const d = addrList.filter((a) => a.addrID == dat)[0];
    setCustomerA({
      addrID: d.addrID,
      Street: d.street,
      SubDistrict: d.subDistrict,
      District: d.district,
      Province: d.province,
      Postal: d.postal,
      Tel: d.tel,
      Fax: d.fax,
      web: d.web,
      email: d.email,
      TaxID: d.taxID,
      TaxName: d.taxName,
      Branch: d.branch,
      subBranch: d.subBranch,
      useAdd: d.useAdd,
      taxAdd: d.taxAdd,
    });
  };

  return (
    <div id="addr-list">
      <div className="text-lg">List of customer sign person</div>
      <div className="flex flex-col gap-2 my-2">
        {addrList.map((a, i) => (
          <div
            className="border rounded-md w-full overflow-hidden flex gap-2 max-md:flex-wrap"
            key={"addr-list-" + i}
          >
            <div className="bg-zinc-500 text-white w-8 text-center">
              {i + 1}
            </div>
            <div id="addr-data" className="w-full">
              <div className="flex gap-2">
                <div>Address :</div>
                <div>
                  {a.street +
                    (a.subDistrict != ""
                      ? a.province.includes("กรุงเทพ")
                        ? " แขวง" + a.subDistrict
                        : " ตำบล" + a.subDistrict
                      : "") +
                    (a.district != ""
                      ? a.province.includes("กรุงเทพ")
                        ? " เขต" + a.district
                        : " อำเภอ" + a.district
                      : "") +
                    " " +
                    a.province +
                    (a.postal != "" ? " " + a.postal : "")}
                </div>
              </div>
              <div className="flex w-full flex-wrap divide-x-2 *:px-4">
                <div className="flex gap-2 first:pl-0 last:pr-0">
                  <div>Telephone :</div>
                  <div>{a.tel}</div>
                </div>
                <div className="flex gap-2 first:pl-0 last:pr-0">
                  <div>Line :</div>
                  <div>{a.fax}</div>
                </div>
                <div className="flex gap-2 first:pl-0 last:pr-0">
                  <div>Email :</div>
                  <div>{a.email}</div>
                </div>

                <div className="flex gap-2 first:pl-0 last:pr-0">
                  <div>Website :</div>
                  <div>{a.web}</div>
                </div>
              </div>
              <div className="flex w-full flex-wrap divide-x-2 *:px-4">
                <div className="flex gap-2 first:pl-0 last:pr-0">
                  <div>Tax ID :</div>
                  <div>{a.taxID}</div>
                </div>
                <div className="flex gap-2 first:pl-0 last:pr-0">
                  <div>Tax Name :</div>
                  <div>{a.taxName}</div>
                </div>
                <div className="flex gap-2 first:pl-0 last:pr-0">
                  <div>Office :</div>
                  <div>
                    {a.branch == "1"
                      ? "Head Office"
                      : "Branch - " + a.subBranch}
                  </div>
                </div>
              </div>

              <div className="flex w-full md:w-3/4 lg:w-1/2 gap-4 my-2">
                {a.useAdd && (
                  <div className="basis-1/2 bg-green-600 text-white text-center py-1 rounded-md">
                    Contract Address
                  </div>
                )}
                {a.taxAdd && (
                  <div className="basis-1/2 bg-pink-600 text-white text-center py-1 rounded-md">
                    Tax Address
                  </div>
                )}
              </div>
            </div>

            <div className="flex min-w-fit max-md:flex-col max-md:w-full gap-0.5">
              <div className="flex md:flex-col md:w-28 w-full gap-0.5">
                <button
                  className="bg-yellow-500 px-3 text-white flex h-full items-center cursor-pointer max-md:w-full max-md:justify-center max-md:py-2"
                  onClick={() => editData(a.addrID)}
                >
                  edit
                </button>
                {!a.useAdd && (
                  <button
                    className="bg-green-600 px-2 text-white flex h-full items-center cursor-pointer max-md:w-full max-md:justify-center max-md:py-2 whitespace-nowrap"
                    onClick={() => changeUse(a.addrID)}
                  >
                    set Contract
                  </button>
                )}
                {!a.taxAdd && (
                  <button
                    className="bg-pink-600 px-2 text-white flex h-full items-center cursor-pointer max-md:w-full max-md:justify-center max-md:py-2"
                    onClick={() => changeTax(a.addrID)}
                  >
                    set Tax
                  </button>
                )}
              </div>
              {Acc == 1 && (
                <div className="w-full md:w-fit min-w-fit">
                  <button
                    className="bg-red-500 px-1 text-white flex h-full items-center cursor-pointer max-md:w-full max-md:justify-center max-md:py-2"
                    onClick={() => openModalDel(a.addrID)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <ModalDelAddr
        show={modalDel}
        onHide={closeModalDel}
        txtDel={delID.st}
        confirmDel={confirmDel}
      />
    </div>
  );
}
