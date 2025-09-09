import React, { useState, useEffect } from "react";
import Regist from "./registration";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function PreRegist(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_reg;
  const navigate = useNavigate();
  const [regDate, setRegDate] = useState([]);

  const exId = "b224";

  const { cp } = useParams();

  async function getDate() {
    const res = await Axios.get(url + "/PreDate");
    setRegDate(res.data);
  }

  useEffect(() => {
    getDate();
  }, []);

  const [sDate, setSDate] = useState("");
  const [eDate, setEDate] = useState("");

  useEffect(() => {
    let d = regDate;
    d.map((d) => {
      if (d.property === "preRegStart") {
        setSDate(new Date(d.val));
      }
      if (d.property === "preRegEnd") {
        setEDate(new Date(d.val));
      }
    });
  }, [regDate]);

  useEffect(() => {
    if (sDate !== "" && eDate !== "") {
      const today = new Date();

      if (today >= new Date(sDate) && today <= new Date(eDate)) {
      } else {
        navigate("/" + exId + "/postregister/expire/xfmb");
      }
    }
  }, [eDate]);

  return <Regist preregister={true} campaign={cp != undefined ? cp : ""} />;
}
