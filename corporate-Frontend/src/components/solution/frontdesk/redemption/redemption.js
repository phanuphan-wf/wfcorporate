import React, { useEffect, useState } from "react";
import Axios from "axios";

import BuyerData from "./buyerData";
import BillDetail from "./billDetail";
import ModalInfo from "./modalInfo";

import useHeader from "../../../hook/useHeader";

export default function Redemption(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_Coupon_api;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  useEffect(() => {
    getExName();
  }, []);

  const [exhition, setExhibition] = useState([]);

  const getExName = async () => {
    try {
      const res = Axios.get(url + "/GetEx/false").then((res) => {
        setExhibition(res.data);
      });
    } catch (err) {
      alert("Error! - Load exhibition data failed " + err);
    }
  };

  const [exID, setExID] = useState({ ExhibitionID: "" });

  const [vis, setVis] = useState({});

  const [billList, setBillList] = useState([]);

  const bData = (data) => {
    setVis(data);
  };

  const bBill = (data) => {
    setBillList(data);
  };

  const [reset, setReset] = useState(false);

  const convertDate = (data) => {
    // date input dd/mm/yyyy (พศ)

    let dt = "1900-01-01T00:00:00";

    if (data.match(/^\d{1,2}[/]\d{1,2}[/]\d{4}$/)) {
      let bd = data;
      let dd = bd.substring(0, bd.indexOf("/"));
      let dy = bd.substring(bd.indexOf("/") + 1);
      let mm = dy.substring(0, dy.indexOf("/"));
      let yy = dy.substring(dy.indexOf("/") + 1);
      dt =
        Number(yy - 543) +
        "-" +
        (mm.length == 1 ? "0" : "") +
        mm +
        "-" +
        (dd.length == 1 ? "0" : "") +
        dd +
        "T00:00:00";
    }

    return dt;
  };

  const [hold, setHold] = useState(false);

  const submitData = async (e) => {
    e.preventDefault();
    setHold(true);
    if (vis.Name == "" || vis.PersonalID == "" || vis.Tel == "") {
      setInfoText({
        header: "Warning",
        body: "Please fill buyer data before adding",
        headerStyle: "text-red-500",
        adding: true,
      });
      setModalInfo(true);
      return;
    }

    if (!billList || billList.length === 0) {
      setInfoText({
        header: "Warning",
        body: "Please add at least one bill before submitting.",
        headerStyle: "text-red-500",
        adding: true,
      });
      setModalInfo(true);
      setHold(false);
      return;
    }

    let trID = 0;
    let data = vis;

    data.birthday = convertDate(data.birthday);

    if (data.Sex == "ชาย") {
      data.Sex = true;
    } else {
      data.Sex = false;
    }

    let postVis = Object.assign(data, exID);

    const res = await Axios.post(url + "/PostVis", postVis).then((res) => {
      trID = res.data.trID;
    });

    let bl = billList.map((b) => {
      let dep = 0;
      if (b.deposit == "") {
        dep = 0;
      } else {
        dep = b.deposit;
      }

      let vol = 0;
      if (b.Volumn == "") {
        vol = 0;
      } else {
        vol = b.Volumn;
      }

      return { ...b, trID: trID, deposit: dep, Volumn: vol };
    });

    const resbl = await Axios.post(url + "/PostBill", bl).then((res) => {
      if (res.status == 200) {
        setInfoText({
          header: "Information",
          body: "Data adding succeed",
          headerStyle: "text-blue-500",
          adding: true,
        });
        setModalInfo(true);
      } else {
        setInfoText({
          header: "Adding Failed",
          body: "Data adding failed",
          headerStyle: "text-red-500",
          adding: true,
        });
        setModalInfo(true);
      }
    });

    setReset(!reset);
    document.getElementById("bname").focus();
  };

  useEffect(() => {
    setHold(false);
  }, [reset]);

  const [modalInfoShow, setModalInfo] = useState(false);

  const [infoText, setInfoText] = useState({});

  const closeModal = () => {
    setModalInfo(false);
  };

  useEffect(() => {
    //console.log(vis);
  }, [vis]);

  return (
    <section className="redemption">
      <div className="text-xl md:text-3xl font-medium">Premium Redemption</div>
      <div>
        <label for="exName" className="block">
          Select Exhibtiion:
        </label>
        <select
          id="exName"
          name="exName"
          className={`cmb ${exID.ExhibitionID != "" ? "bg-green-300" : ""}`}
          onChange={(e) => setExID({ ExhibitionID: e.target.value })}>
          <option value="0" disabled selected>
            Select exhibition name
          </option>
          {exhition.map((ex) => (
            <option value={ex.exhibitionID} key={ex.exhibitionID}>
              {ex.name + " (" + ex.exhibitionID + ")"}
            </option>
          ))}
        </select>
      </div>
      <BuyerData exID={exID.ExhibitionID} data={bData} reset={reset} />
      <BillDetail exID={exID.ExhibitionID} data={bBill} reset={reset} />
      <div className="flex w-full justify-end my-3">
        <button
          className="border-2 border-green-600 px-4 py-1 rounded-md w-fit bg-green-600 text-white hover:bg-white hover:text-green-600 disabled:bg-slate-400 disabled:border-slate-400 disabled:hover:text-white"
          onClick={(e) => submitData(e)}
          disabled={hold}>
          Submit Data
        </button>
      </div>
      <ModalInfo show={modalInfoShow} onHide={closeModal} infoText={infoText} />
    </section>
  );
}
