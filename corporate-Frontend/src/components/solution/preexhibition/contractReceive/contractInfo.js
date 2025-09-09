import React, { useContext, useEffect, useState, useRef } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import useCheckMobile from "../../../hook/useCheckMobile";
import { NumericFormat } from "react-number-format";

import { dataContext } from "../contractReceive";

import ModalAddBooth from "./modalAddBooth";

export default function ContractInfo(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctr;
  const bearer = useHeader();
  const txtBooth = useRef();
  const mobile = useCheckMobile();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { exhibitionC, contractDetailC, priceCorrectionC, boothAvaiC } =
    useContext(dataContext);
  const [selectExhibition, setSelectExhibition] = exhibitionC;
  const [contractDetail, setContractDetail] = contractDetailC;
  const [priceCorrection, setPriceCorrection] = priceCorrectionC;
  const [boothAvai, setBoothAvai] = boothAvaiC;

  const initContractDetail = {
    ...contractDetail,
    BoothNo: "",
    Spaces: 0.0,
    PriceID: 0,
    Markup: 0.0,
    DisElec: 0.0,
    DisOther: 0.0,
    Volume: 0.0,
    Grid: "",
  };

  const initCorrection = {
    conner: false,
    electric: false,
    pillar: false,
    early: false,
    otherP: false,
    other: false,
  };

  const initPriceCorrection = {
    ...priceCorrection,
    historyID: 0,
    conner: 0.0,
    electric: 0.0,
    pillar: 0.0,
    early: 0.0,
    other: 0.0,
    otherP: 0.0,
  };
  const [correction, setCorrection] = useState(initCorrection);

  const [exhibition, setExhibition] = useState([]);
  const [pastShow, setPastShow] = useState(false);

  const getEx = async () => {
    const res = await Axios.get(url + "/getExhibition/" + pastShow).then(
      (res) => setExhibition(res.data)
    );
  };

  useEffect(() => {
    getEx();
  }, []);

  useEffect(() => {
    getEx();
    document.getElementById("cmbExhibition").value = "0";
    setSelectExhibition("0");
  }, [pastShow]);

  const [zone, setZone] = useState([]);

  const getZone = async () => {
    const res = await Axios.get(url + "/getZone/" + selectExhibition).then(
      (res) => setZone(res.data)
    );
  };

  useEffect(() => {
    if (selectExhibition != "0") {
      getZone();
      getBooth();
    } else {
      setZone([]);
      setBooth([]);
    }
  }, [selectExhibition]);

  const bPrice = () => {
    try {
      return zone.filter((z) => z.priceID == contractDetail.PriceID)[0].bPrice;
    } catch (err) {
      return "";
    }
  };

  const amountCal = () => {
    try {
      if (contractDetail.Spaces != 0 && contractDetail.PriceID != 0) {
        const cal =
          (Number(contractDetail.Spaces) /
            zone.filter((z) => z.priceID == contractDetail.PriceID)[0].area) *
          zone.filter((z) => z.priceID == contractDetail.PriceID)[0].bPrice;

        return cal;
      } else {
        return 0;
      }
    } catch {
      return 0;
    }
  };

  const priceAdjust = () => {
    const adj =
      Number(priceCorrection.conner) -
      Number(priceCorrection.electric) -
      Number(priceCorrection.pillar) -
      Number(priceCorrection.early) -
      Number(priceCorrection.other) +
      Number(priceCorrection.otherP);
    return adj;
  };

  const correctionChange = (c) => {
    setCorrection({ ...correction, [c]: !correction[c] });
    if (correction[c] == true) {
      setPriceCorrection({ ...priceCorrection, [c]: 0 });
      if (c == "early") {
        setContractDetail({ ...contractDetail, DisOther: 0 });
      }
    }
  };

  useEffect(() => {
    setContractDetail({
      ...contractDetail,
      Volume: amountCal() + priceAdjust(),
    });
  }, [contractDetail.Spaces, contractDetail.PriceID, priceCorrection]);

  const [booth, setBooth] = useState([]);
  const getBooth = async () => {
    const res = await Axios(url + "/getBooth/" + selectExhibition).then((r) =>
      setBooth(r.data)
    );
  };

  const boothShow = () => {
    if (contractDetail.BoothNo != "") {
      const list = booth.filter((b) =>
        b.boothNo.toUpperCase().includes(contractDetail.BoothNo.toUpperCase())
      );
      return list;
    } else {
      return [];
    }
  };

  const [boothFocus, setBoothFocus] = useState(false);

  const boothSelect = (booth) => {
    setContractDetail({ ...contractDetail, BoothNo: booth });
    setBoothFocus(false);
  };

  const boothCheck = (bh) => {
    //console.log(bh);
    if (bh != "" && selectExhibition != 0) {
      const data = booth.filter((b) => b.boothNo == bh);
      //console.log(data);
      if (!data.length) {
        setBoothAvai(false);
      } else {
        setBoothAvai(true);
      }
    } else {
      setBoothAvai(true);
    }
  };

  useEffect(() => {
    boothCheck(contractDetail.BoothNo);
  }, [contractDetail.BoothNo]);

  const boothShowPosition = () => {
    if (mobile) {
      return txtBooth.current.offsetLeft;
    } else {
      return txtBooth.current.offsetLeft + txtBooth.current.clientWidth + 20;
    }
  };

  const clearData = () => {
    setContractDetail(initContractDetail);
    setCorrection(initCorrection);
    setPriceCorrection(initPriceCorrection);
    getBooth();
  };

  useEffect(() => {
    clearData();
  }, [contractDetail.ContractID]);

  useEffect(() => {
    //console.log(boothAvai);
  }, [boothAvai]);

  const [isAdd, setIsAdd] = useState(false);

  const closeModalAdd = () => {
    setIsAdd(false);
  };

  const confirmAdd = (cf) => {
    if (cf) {
      getBooth();
    }
    setIsAdd(false);
  };

  return (
    <div className="contract-info">
      <div className="mb-2 flex items-center flex-wrap gap-x-4 gap-y-2">
        <div>
          <label htmlFor="cmbexhibition" className="mr-2">
            Exhibition Name :
          </label>
          <select
            className="cmb"
            id="cmbExhibition"
            onChange={(e) => setSelectExhibition(e.target.value)}
          >
            <option value={"0"} disabled hidden selected>
              select exhibition
            </option>
            {exhibition.map((e, i) => (
              <option value={e.exhibitionID} key={"cmbExhibition-" + i}>
                {e.name + " (" + e.exhibitionID + ")"}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <input
            id="past-exh"
            type="checkbox"
            className="accent-red-500 w-4 h-4 focus:border-none focus:shadow-none"
            onChange={() => setPastShow(!pastShow)}
          />
          <label htmlFor="past-exh">show past exhibition</label>
        </div>
      </div>
      {boothFocus && (
        <div
          className="absolute z-10 w-screen h-screen"
          onClick={() => setBoothFocus(false)}
        ></div>
      )}
      <div className="border rounded-md relative w-full mt-4">
        <div className="bg-white px-3 absolute -top-3 left-4">
          Contract Detail
        </div>
        <div className="px-4 py-4 relative">
          <div className="flex justify-between max-lg:flex-wrap">
            <div>
              <label htmlFor="booth" className="block">
                Booth No.
              </label>
              <input
                id="booth"
                onChange={(e) =>
                  setContractDetail({
                    ...contractDetail,
                    BoothNo: e.target.value.toUpperCase(),
                  })
                }
                value={contractDetail.BoothNo}
                onFocus={() => setBoothFocus(true)}
                className="relative z-20"
                ref={txtBooth}
              />
              <div>
                <span hidden={boothAvai} className="text-red-500">
                  Please select available booth only
                </span>
              </div>
              {boothFocus && (
                <div
                  className="absolute md:top-4 z-20 max-md:mt-2 shadow-lg"
                  style={{
                    left: boothShowPosition(),
                  }}
                >
                  <div className="border rounded-md  bg-white">
                    <div className="border-b px-4 py-2 bg-red-200 text-red-600 rounded-t-md">
                      Available Booth
                    </div>
                    <div className="h-fit max-h-[200px] overflow-y-auto">
                      <ul>
                        {boothShow().map((b, i) => (
                          <li
                            className="hover:bg-indigo-500 hover:text-white px-4 py-1"
                            onClick={() => boothSelect(b.boothNo)}
                          >
                            {b.boothNo}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div
                      className="border-t px-4 py-2 text-indigo-500 hover:bg-indigo-700 hover:text-white rounded-b-md cursor-pointer"
                      onClick={() => setIsAdd(true)}
                    >
                      Add Booth
                    </div>
                  </div>
                </div>
              )}
            </div>
            <ModalAddBooth
              show={isAdd}
              onHide={closeModalAdd}
              exid={selectExhibition}
              confirmAdd={confirmAdd}
            />
            <div>
              <label htmlFor="space" className="block">
                Space (Sq.m.)
              </label>
              <input
                id="space"
                onChange={(e) =>
                  setContractDetail({
                    ...contractDetail,
                    Spaces: e.target.value,
                  })
                }
                value={contractDetail.Spaces != 0 ? contractDetail.Spaces : ""}
              />
            </div>
            <div className="basis-1/2 md:basis-1/3 lg:basis-1/5">
              <label htmlFor="zone" className="block">
                Zone
              </label>
              <select
                className="cmb w-full min-w-[120px]"
                id="zone"
                onChange={(e) =>
                  setContractDetail({
                    ...contractDetail,
                    PriceID: Number(e.target.value),
                  })
                }
                value={contractDetail.PriceID}
              >
                <option value={"0"} disabled selected hidden>
                  select zone
                </option>
                {zone.map((z, i) => (
                  <option value={z.priceID} key={"cmb-zone-" + i}>
                    {z.zone}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pb" className="block">
                Price/Booth
              </label>
              <input
                id="pb"
                className="border-none"
                disabled
                value={
                  bPrice() != ""
                    ? bPrice()
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                    : ""
                }
              />
            </div>
            <div className="flex items-center">
              <span>=</span>
            </div>
            <div>
              <label htmlFor="amount" className="block">
                Amount
              </label>
              <input
                id="amount"
                className="border-none"
                disabled
                value={
                  contractDetail.Volume != 0
                    ? Number(amountCal())
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                    : ""
                }
              />
            </div>
          </div>
          <div className="flex justify-between max-lg:flex-wrap">
            <div>
              <label htmlFor="grid" className="block">
                Gridline
              </label>
              <input
                id="grid"
                onChange={(e) =>
                  setContractDetail({
                    ...contractDetail,
                    Grid: e.target.value.toUpperCase(),
                  })
                }
                value={contractDetail.Grid != "" ? contractDetail.Grid : ""}
              />
            </div>
            <div className="border border-[#b3b3b3] rounded-md relative basis-4/5 mt-4 py-5 px-4">
              <div className="absolute bg-white px-2 -top-3 left-4">
                Price Correction
              </div>
              <div className="flex justify-between flex-wrap gap-1">
                <div className="flex items-center lg:basis-[33%]">
                  <input
                    type="checkbox"
                    id="chbconner"
                    className="mr-1 accent-emerald-500 w-4 h-4 focus:border-none focus:shadow-none"
                    onChange={() => correctionChange("conner")}
                    checked={correction.conner}
                  />
                  <label htmlFor="txtconner" className="mr-1">
                    + Conner
                  </label>
                  <NumericFormat
                    value={
                      priceCorrection.conner != 0 ? priceCorrection.conner : ""
                    }
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    onValueChange={(n) =>
                      setPriceCorrection({
                        ...priceCorrection,
                        conner: n.value != "" ? Number(n.value) : 0,
                      })
                    }
                    className="text-right pr-3 disabled:bg-zinc-300"
                    disabled={!correction.conner}
                  />
                </div>
                <div className="flex items-center lg:basis-[33%]">
                  <input
                    type="checkbox"
                    id="chbelectric"
                    className="mr-1 accent-red-500 w-4 h-4 focus:border-none focus:shadow-none"
                    onChange={() => correctionChange("electric")}
                    checked={correction.electric}
                  />
                  <label htmlFor="txtelectric" className="mr-1">
                    - Electric
                  </label>
                  <NumericFormat
                    value={
                      priceCorrection.electric != 0
                        ? priceCorrection.electric
                        : ""
                    }
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    onValueChange={(n) =>
                      setPriceCorrection({
                        ...priceCorrection,
                        electric: n.value != "" ? Number(n.value) : 0,
                      })
                    }
                    className="text-right pr-3 disabled:bg-zinc-300"
                    disabled={!correction.electric}
                  />
                </div>
                <div className="flex items-center lg:basis-[33%]">
                  <input
                    type="checkbox"
                    id="chbpillar"
                    className="mr-1 accent-red-500 w-4 h-4 focus:border-none focus:shadow-none"
                    onChange={() => correctionChange("pillar")}
                    checked={correction.pillar}
                  />
                  <label htmlFor="txtpillar" className="mr-1">
                    - Pillar
                  </label>
                  <NumericFormat
                    value={
                      priceCorrection.pillar != 0 ? priceCorrection.pillar : ""
                    }
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    onValueChange={(n) =>
                      setPriceCorrection({
                        ...priceCorrection,
                        pillar: n.value != "" ? Number(n.value) : 0,
                      })
                    }
                    className="text-right pr-3 disabled:bg-zinc-300"
                    disabled={!correction.pillar}
                  />
                </div>
                <div className="flex items-center lg:basis-[33%]">
                  <input
                    type="checkbox"
                    id="chbearly"
                    className="mr-1 accent-red-500 w-4 h-4 focus:border-none focus:shadow-none"
                    onChange={() => correctionChange("early")}
                    checked={correction.early}
                  />
                  <label htmlFor="txtearly" className="mr-1">
                    - Early
                  </label>
                  <NumericFormat
                    value={
                      priceCorrection.early != 0 ? priceCorrection.early : ""
                    }
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    onValueChange={(n) => {
                      setPriceCorrection({
                        ...priceCorrection,
                        early: n.value != "" ? Number(n.value) : 0,
                      });
                      setContractDetail({
                        ...contractDetail,
                        DisOther: n.value != "" ? Number(n.value) : 0,
                      });
                    }}
                    className="text-right pr-3 disabled:bg-zinc-300"
                    disabled={!correction.early}
                  />
                </div>
                <div className="flex items-center lg:basis-[33%]">
                  <input
                    type="checkbox"
                    id="chbother"
                    className="mr-1 accent-red-500 w-4 h-4 focus:border-none focus:shadow-none"
                    onChange={() => correctionChange("other")}
                    checked={correction.other}
                  />
                  <label htmlFor="txtother" className="mr-1">
                    - Other
                  </label>
                  <NumericFormat
                    value={
                      priceCorrection.other != 0 ? priceCorrection.other : ""
                    }
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    onValueChange={(n) =>
                      setPriceCorrection({
                        ...priceCorrection,
                        other: n.value != "" ? Number(n.value) : 0,
                      })
                    }
                    className="text-right pr-3 disabled:bg-zinc-300"
                    disabled={!correction.other}
                  />
                </div>
                <div className="flex items-center lg:basis-[33%]">
                  <input
                    type="checkbox"
                    id="chbotherP"
                    className="mr-1 accent-red-500 w-4 h-4 focus:border-none focus:shadow-none"
                    onChange={() => correctionChange("otherP")}
                    checked={correction.otherP}
                  />
                  <label htmlFor="txtotherP" className="mr-1">
                    + Other
                  </label>
                  <NumericFormat
                    value={
                      priceCorrection.otherP != 0 ? priceCorrection.otherP : ""
                    }
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    onValueChange={(n) =>
                      setPriceCorrection({
                        ...priceCorrection,
                        otherP: n.value != "" ? Number(n.value) : 0,
                      })
                    }
                    className="text-right pr-3 disabled:bg-zinc-300"
                    disabled={!correction.otherP}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <button
              className="border rounded-md bg-slate-300 px-3 py-1 hover:bg-white"
              onClick={clearData}
            >
              Clear Data
            </button>
            <div>
              <label htmlFor="amount-cal">Amount Contract</label>
              <input
                id="amount-cal"
                className="text-xl bg-black w-[200px] py-2 px-2 text-right text-green-500 ml-2"
                value={
                  contractDetail.Volume != 0
                    ? Number(contractDetail.Volume)
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                    : ""
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
