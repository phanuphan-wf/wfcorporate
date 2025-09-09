// Code Generated: 2/15/2024 11:00:47 AM
import React, { createContext, useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import VisitorInfo from "./visinfo";
import VisitorQuestion from "./visquestion";
import Axios from "axios";

export const dataContext = createContext();

export default function VisitorSurvey(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_svy;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const inittv = {
    uid: "",
    c33: 0,
    c35: 0,
    c30: 0,
    c23: 0,
    c31: 0,
    c27: 0,
    c22: 0,
    c32: 0,
    c34: 0,
    c36: 0,
    c29: 0,
    c18: 0,
    c25: 0,
    c16: 0,
    c5: 0,
    non: 1,
  };
  const [qtv, setQTV] = useState(inittv);

  const initProgram = { uid: "", drama: 0, news: 0, game: 0, doc: 0, sport: 0 };
  const [qProgram, setQProgram] = useState(initProgram);

  const initData = {
    mobile: "",
    offen: 0,
    favExhibitor: 0,
    favProduct: 0,
    favPrice: 0,
    favPromotion: 0,
    favOther: "0",
    buy: 0,
    buyQuality: 0,
    buyPrice: 0,
    buyDesign: 0,
    buyService: 0,
    buyPromotion: 0,
    buyOther: "0",
    nbuyProduct: 0,
    nbuyDesign: 0,
    nbuyPrice: 0,
    nbuyHouse: 0,
    nbuyOther: "0",
    moreExhibitor: 0,
    moreProduct: 0,
    moreProductTxt: "",
    morePromotion: 0,
    moreLounge: 0,
    morePremium: 0,
    moreOther: "0",
    suggest: "",
  };

  const [data, setData] = useState(initData);

  const initQMedia = {
    uid: "",
    tv: 0,
    billboard: 0,
    newspaper: 0,
    facebook: 0,
    google: 0,
    youtube: 0,
    line: 0,
    friend: 0,
    other: 0,
    cutout: 0,
    radio: 0,
    tiktok: 0,
    sms: 0,
  };

  const [qMedia, setQMedia] = useState(initQMedia);

  const [user, setUser] = useState({});

  useEffect(() => {
    //console.log("data", data);
  }, [data]);

  useEffect(() => {
    //console.log("qtv", qtv);
  }, [qtv]);

  useEffect(() => {
    //console.log("qProgram", qProgram);
  }, [qProgram]);

  useEffect(() => {
    //console.log("qMedia", qMedia);
  }, [qMedia]);

  const [btnSubmit, setBtnSubmit] = useState(false);

  const submitData = async () => {
    setBtnSubmit(true);

    if (user.id == undefined) {
      alert("Please check visitor data before submit");
      setBtnSubmit(false);
      return;
    }

    try {
      const res = await Axios.post(url + "/addChannel", qtv);
    } catch (e) {
      if (e.response.status === 400) {
        alert("Cannot add Favorite Channel");
      }
    }

    try {
      const res = await Axios.post(url + "/addTV", qProgram);
    } catch (e) {
      if (e.response.status === 400) {
        alert("Cannot add Favorite Program");
      }
    }

    try {
      const res = await Axios.post(url + "/addMedia", qMedia);
    } catch (e) {
      if (e.response.status === 400) {
        alert("Cannot add watching Media");
      }
    }

    try {
      const res = await Axios.post(url + "/addSurvey", data);
    } catch (e) {
      if (e.response.status === 400) {
        alert("Cannot add Survey Data");
      }
    }

    document.getElementById("offent").value = "0";

    setQTV(inittv);
    setQProgram(initProgram);
    setData(initData);
    setQMedia(initQMedia);
    setUser({});
    setTvselect(0);
    setBtnSubmit(false);
  };

  const [tvselect, setTvselect] = useState(0);

  return (
    <dataContext.Provider
      value={{
        userC: [user, setUser],
        qtvC: [qtv, setQTV],
        qProgramC: [qProgram, setQProgram],
        dataC: [data, setData],
        tvselectC: [tvselect, setTvselect],
        qmediaC: [qMedia, setQMedia],
      }}
    >
      <section id="visitor-survey">
        <div id="header">
          <h1 className="text-2xl">Visitor Survey</h1>
        </div>
        <div className="my-4">
          <VisitorInfo />
        </div>
        <div id="survey-questions">
          <VisitorQuestion />
        </div>
        <div className="flex justify-end mb-5">
          <button
            className="btn btn-primary md:text-lg px-3 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:border-gray-400"
            onClick={submitData}
            disabled={btnSubmit}
          >
            {!btnSubmit ? "Submit" : "saving..."}
          </button>
        </div>
      </section>
    </dataContext.Provider>
  );
}
