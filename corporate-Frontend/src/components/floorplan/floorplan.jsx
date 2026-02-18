import { useState, useEffect } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ModalShowCustomer from "./modalCustomer";

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

  useEffect(() => {
    //console.log(customer);
  }, [customer]);

  const loc = {
    1: "bottom-[50px] left-[800px] w-[50px] h-[120px]",
    2: "bottom-[200px] left-[500px] w-[50px] h-[80px]",
  };

  const show = true;

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

  return (
    <section className="floorplan">
      <h1 className="font-bold text-2xl">floorplan</h1>
      <div className="w-full h-screen overflow-auto">
        <div className="w-[1200px] h-[1200px] border-2 border-yellow-600 bg-yellow-50 relative">
          {customer.length &&
            customer.map((c) => (
              <div
                key={`customer-${c.id}`}
                className={`${show ? "border border-red-400" : ""} absolute text-sm text-center ${loc[c.id]} cursor-pointer`}
                onClick={() => customerClick(c.id)}>
                {show ? c.name : ""}
              </div>
            ))}
        </div>
      </div>
      <ModalShowCustomer show={isShow} id={cid} onHide={closeModal} />
    </section>
  );
}
