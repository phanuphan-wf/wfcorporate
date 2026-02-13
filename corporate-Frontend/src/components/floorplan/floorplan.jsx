import { useState, useEffect } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Floorplan() {
  const { pos } = useParams();
  const { i18n } = useTranslation();

  const [customer, setCustomer] = useState([]);
  const getCustomer = async () => {
    const res = await Axios.get();
  };

  return (
    <section className="w-full h-screen overflow-auto">
      <h1 className="font-bold text-2xl">floorplan</h1>
    </section>
  );
}
