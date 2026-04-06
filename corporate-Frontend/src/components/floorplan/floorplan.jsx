import { useState, useEffect } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ModalShowCustomer from "./modalCustomer";

import Uhere from "./uhere";
import { Loc } from "./ExhibitorLoc";

export default function Floorplan() {
  const { pos } = useParams();
  const { i18n } = useTranslation();
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_fl;

  const [customer, setCustomer] = useState([]);
  const getCustomer = async () => {
    const res = await Axios.get(url + "/listCustomer").then((r) => {
      if (r.status == 200) {
        setCustomer(r.data);
      }
    });
  };

  useEffect(() => {
    getCustomer();
  }, []);

  const postPos = async () => {
    const res = await Axios.post(url + "/PostScan", { Loc: pos });
  };

  useEffect(() => {
    if (pos != undefined && pos != "") {
      postPos();
    }
  }, [pos]);

  useEffect(() => {
    console.log(customer);
  }, [customer]);

  const show = false;

  const [isShow, setIsShow] = useState(false);
  const [cid, setCid] = useState(0);

  const closeModal = () => {
    setIsShow(false);
  };

  const customerClick = (id) => {
    console.log(id);
    setCid(id);
    setIsShow(true);
  };

  const loc = Loc;

  const ploc = {
    entrance: "bottom-[580px] left-[770px]",
    inside: "bottom-[640px] left-[500px]",
    standee1: "top-[160px] left-[190px]",
    standee2: "top-[160px] left-[775px]",
    standee3: "bottom-[580px] left-[245px]",
    standee4: "bottom-[520px] left-[860px]",
  };

  return (
    <section className="floorplan">
      <div className="mx-auto w-fit my-4">
        <img
          src={require("./img/fur_logo.png")}
          alt="furniture fair"
          className="w-[200px] mx-auto"
        />
        <p className="text-center">7-15 March 2026, Bitec Bangna</p>
        <p className="text-sm text-center border-t text-red-400">
          ท่านสามารถแตะที่โลโก้เพื่อดูข้อมูลร้านค้าได้
          <br />
          touch on logo for watching more information
        </p>
      </div>
      <div className="w-full h-screen overflow-auto">
        <div className="w-[1000px] h-fit border-2 border-pink-600 relative">
          <img src={require("./img/b126_floorplan.png")} alt="show-floorplan" />
          {customer.length != 0 &&
            customer.map((c) => (
              <div
                key={`customer-${c.id}`}
                className={`${show ? "border border-red-400" : ""} absolute text-sm text-center ${loc[c.id]} cursor-pointer overflow-hidden`}
                onClick={() => customerClick(c.id)}>
                {show ? c.name : ""}
              </div>
            ))}
          <div
            className={`absolute ${pos != undefined ? ploc[pos] : "hidden"}`}>
            <Uhere />
          </div>
        </div>
      </div>

      <ModalShowCustomer show={isShow} id={cid} onHide={closeModal} />
    </section>
  );
}
