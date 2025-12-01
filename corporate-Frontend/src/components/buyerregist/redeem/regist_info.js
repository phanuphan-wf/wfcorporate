
import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useTranslation } from "react-i18next";

import style from "./registraion.module.css";

export default function RegistInfo(props) {
  const { t, i18n } = useTranslation("redeem", { keyPrefix: "regist_redeem.info" });
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_reg;

  const getYear = () => {
    let y = [];
    let sy = new Date().getFullYear() + 543;
    let ey = sy - 90;
    for (let i = sy - 10; i > ey; i--) {
      y.push(i);
    }
    return y;
  };

  const [occupation, setOccupation] = useState([]);

  const getOccu = async () => {
    const res = await Axios.get(url + "/GetOccu").then((res) => {
      setOccupation(res.data);
    });
  };

  const [province, setProvince] = useState([]);
  const getProvince = async () => {
    const res = await Axios.get(url + "/GetProvince").then((res) => {
      setProvince(res.data);
    });
  };

  const [district, setDistrict] = useState([]);
  const getDistrict = async (id) => {
    const res = await Axios.get(url + "/GetDistrict/" + id).then((res) => {
      setDistrict(res.data);
    });
  };

  useEffect(() => {
    getOccu();
    getProvince();
  }, []);

  const onProvinceChange = (e) => {
    document.getElementById("district").selectedIndex = "0";
    getDistrict(e.target.value);
    setBio({ ...bio, province: e.target.value, district: "0" });
  };

  const initBio = {
    name: "",
    surname: "",
    mobile: "",
    email: "",
    sex: "0",
    month: "0",
    year: "0",
    income: "0",
    province: "0",
    district: "0",
    occupation: "0",
  };

  const [bio, setBio] = useState(initBio);

  useEffect(() => {
    props.bioData(bio);
    mobileVerify();
    emailVerify();
  }, [bio]);

  const [mobileFormat, setMobileFormat] = useState(true);
  const [emailFormat, setEmailFormat] = useState(true);

  const mobileVerify = () => {
    if (bio.mobile != "") {
      let check = bio.mobile.match(/^\d{10}$/);

      if (check) {
        setMobileFormat(true);
      } else {
        setMobileFormat(false);
      }
    } else {
      setMobileFormat(true);
    }
  };

  const emailVerify = () => {
    if (bio.email != "") {
      let check = bio.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

      if (check) {
        setEmailFormat(true);
      } else {
        setEmailFormat(false);
      }
    } else {
      setEmailFormat(true);
    }
  };

  const [verify, setVerify] = useState(true);

  useEffect(() => {
    setVerify(props.verify);
  }, [props.verify]);

  const month = [
    { th: "มกราคม", en: "January" },
    { th: "กุมภาพันธ์", en: "February" },
    { th: "มีนาคม", en: "March" },
    { th: "เมษายน", en: "April" },
    { th: "พฤษภาคม", en: "May" },
    { th: "มิถุนายน", en: "June" },
    { th: "กรกฎาคม", en: "July" },
    { th: "สิงหาคม", en: "August" },
    { th: "กันยายน", en: "September" },
    { th: "ตุลาคม", en: "October" },
    { th: "พฤศจิกายน", en: "November" },
    { th: "ธันวาคม", en: "December" },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 md:container max-w-5xl px-4 md:px-10 mb-10 max-sm:text-lg">
      <div className={`${style.form_group} field_name`}>
        <input
          id="name"
          placeholder="name"
          className={`${style.form_field} ${
            !verify && bio.name == ""
              ? "bg-red-100 border-gray-400 "
              : bio.name != ""
              ? "bg-white border-gray-400"
              : "bg-[#bfbfbf] border-white"
          } border-2`}
          onChange={(e) => setBio({ ...bio, name: e.target.value })}
        />
        <label for="name" className={style.form_label}>
          {t("name")}
        </label>
      </div>

      <div className={`${style.form_group} field_surname`}>
        <input
          id="surname"
          placeholder="surname"
          className={`${style.form_field} ${
            !verify && bio.surname == ""
              ? "bg-red-100 border-gray-400 "
              : bio.surname != ""
              ? "bg-white border-gray-400"
              : "bg-[#bfbfbf] border-white"
          } border-2`}
          onChange={(e) => setBio({ ...bio, surname: e.target.value })}
        />
        <label for="surname" className={style.form_label}>
          {t("surname")}
        </label>
      </div>

      <div className={`${style.form_group} field_mobile`}>
        <input
          id="mobile"
          placeholder="mobile"
          className={`${style.form_field} ${
            !verify && bio.mobile == ""
              ? "bg-red-100 border-gray-400 "
              : bio.mobile != ""
              ? "bg-white border-gray-400"
              : "bg-[#bfbfbf] border-white"
          } border-2`}
          onChange={(e) => setBio({ ...bio, mobile: e.target.value })}
        />
        <label for="mobile" className={style.form_label}>
          {t("phone")}
        </label>
        <span className={`text-red-500 ${mobileFormat ? "hidden" : ""}`}>
          {t("veriPhone")}
        </span>
      </div>

      <div className={`${style.form_group} field_email`}>
        <input
          id="email"
          placeholder="email"
          className={`${style.form_field} ${
            bio.email != ""
              ? "bg-white border-gray-400"
              : "bg-[#bfbfbf] border-white"
          } border-2`}
          onChange={(e) => setBio({ ...bio, email: e.target.value })}
        />
        <label for="email" className={style.form_label}>
          {t("email")}
        </label>
        <span className={`text-red-500 ${emailFormat ? "hidden" : ""}`}>
          {t("veriEmail")}
        </span>
      </div>

      <div className={`${style.form_group} field_sex`}>
        <div
          className={`flex justify-around  rounded-lg border-2 ${
            bio.sex != "0" ? "border-gray-400" : "border-[#bfbfbf]"
          } ${
            !verify && bio.sex == "0"
              ? "bg-red-100 border-gray-400"
              : "bg-[#bfbfbf]"
          }`}
        >
          <div
            className={`flex basis-1/3 justify-center border-r rounded-l-md ${
              bio.sex == "1" ? "bg-white" : "bg-transparent text-gray-500"
            }`}
          >
            <input
              id="male"
              type="radio"
              name="radsex"
              className={`hidden`}
              onChange={(e) => setBio({ ...bio, sex: "1" })}
            />
            <label for="male" className="py-[9px] cursor-pointer">
              {t("male")}
            </label>
          </div>
          <div
            className={`flex basis-1/3 justify-center border-r ${
              bio.sex == "2" ? "bg-white" : "bg-transparent text-gray-500"
            }`}
          >
            <input
              id="female"
              type="radio"
              name="radsex"
              className={`hidden`}
              onChange={(e) => setBio({ ...bio, sex: "2" })}
            />
            <label for="female" className="py-[9px] cursor-pointer">
              {t("female")}
            </label>
          </div>
          <div
            className={`flex basis-1/3 justify-center rounded-r-md ${
              bio.sex == "3" ? "bg-white" : "bg-transparent text-gray-500"
            }`}
          >
            <input
              id="na"
              type="radio"
              name="radsex"
              className={`hidden`}
              onChange={(e) => setBio({ ...bio, sex: "3" })}
            />
            <label for="na" className="py-[9px] cursor-pointer">
              {t("sex_na")}
            </label>
          </div>
        </div>
        <label
          className={`absolute text-gray-500
           px-[10px] transition-all duration-200 -z-10`}
          style={{ top: `${bio.sex != "0" ? "-15px" : "10px"}` }}
        >
          {t("sex")}
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`${style.form_group} field_month`}>
          <select
            id="month"
            className={`${
              bio.month != "0"
                ? `${style.form_field} border-gray-400 bg-white`
                : `${style.beforeselect} border-white bg-[#bfbfbf]`
            } border-2`}
            onChange={(e) => setBio({ ...bio, month: e.target.value })}
          >
            <option value="0" disabled selected hidden></option>
            {month.map((m, id) => (
              <option value={id + 1} key={id}>
                {i18n.language == "th" ? m.th : m.en}
              </option>
            ))}
          </select>
          <label
            for="month"
            className={`${
              bio.month != "0" ? style.selected_label : style.form_label
            }`}
          >
            {t("month")}
          </label>
        </div>

        <div className={`${style.form_group} field_year`}>
          <select
            id="year"
            className={`${
              bio.year != "0"
                ? `${style.form_field} border-gray-400 bg-white`
                : !verify && bio.year == "0"
                ? `bg-red-100 border-gray-400 ${style.beforeselect} `
                : `border-white bg-[#bfbfbf] ${style.beforeselect}`
            } border-2`}
            onChange={(e) => setBio({ ...bio, year: e.target.value })}
          >
            <option value="0" disabled selected hidden></option>
            {getYear().map((y, i) => (
              <option value={y} key={i}>
                {i18n.language == "th" ? y : Number(y) - 543}
              </option>
            ))}
          </select>
          <label
            for="year"
            className={`${
              bio.year != "0" ? style.selected_label : style.form_label
            }`}
          >
            {t("year")}
          </label>
        </div>
      </div>

      <div className={`${style.form_group} field_income`}>
        <select
          id="imcome"
          className={`${
            bio.income != "0"
              ? `${style.form_field} border-gray-400 bg-white`
              : `${style.beforeselect} border-white bg-[#bfbfbf]`
          } border-2`}
          onChange={(e) => setBio({ ...bio, income: e.target.value })}
        >
          <option value="0" disabled selected hidden></option>
          {[
            { id: "10", val: t("less") + " 15,000" },
            { id: "15", val: "15,001-30,000" },
            { id: "30", val: "30,001-50,000" },
            { id: "50", val: "50,001-70,000" },
            { id: "70", val: "70,001-90,000" },
            { id: "90", val: "90,001-120,000" },
            { id: "120", val: t("more") + " 120,000" },
          ].map((inc, i) => (
            <option value={inc.id} key={i}>
              {inc.val}
            </option>
          ))}
        </select>
        <label
          for="income"
          className={`${
            bio.income != "0" ? style.selected_label : style.form_label
          }`}
        >
          {t("income")}
        </label>
      </div>

      <div className={`${style.form_group} field_occupation`}>
        <select
          id="occupation"
          className={`${
            bio.occupation != "0"
              ? `${style.form_field} border-gray-400 bg-white`
              : `${style.beforeselect} border-white bg-[#bfbfbf]`
          } border-2`}
          onChange={(e) => setBio({ ...bio, occupation: e.target.value })}
        >
          <option value="0" disabled selected hidden></option>
          {occupation.map((d, i) => (
            <option value={d.id} key={i}>
              {i18n.language == "th" ? d.occu : d.occu_en}
            </option>
          ))}
        </select>
        <label
          for="occupation"
          className={`${
            bio.occupation != "0" ? style.selected_label : style.form_label
          }`}
        >
          {t("occupation")}
        </label>
      </div>

      <div className={`${style.form_group} field_province`}>
        <select
          id="province"
          className={`${
            bio.province != "0"
              ? `${style.form_field} border-gray-400 bg-white`
              : !verify && bio.province == "0"
              ? `bg-red-100 border-gray-400 ${style.beforeselect} `
              : `border-white bg-[#bfbfbf] ${style.beforeselect}`
          } border-2`}
          onChange={(e) => onProvinceChange(e)}
        >
          <option value="0" disabled selected hidden></option>
          {province.map((p, i) => (
            <option value={p.id} key={i}>
              {i18n.language == "th" ? p.name_th : p.name_en}
            </option>
          ))}
        </select>
        <label
          for="province"
          className={`${
            bio.province != "0" ? style.selected_label : style.form_label
          }`}
        >
          {t("province")}
        </label>
      </div>

      <div className={`${style.form_group} field_district`}>
        <select
          id="district"
          className={`${
            bio.district != "0"
              ? `${style.form_field} border-gray-400 bg-white`
              : !verify && bio.district == "0"
              ? `bg-red-100 border-gray-400 ${style.beforeselect} `
              : `border-white bg-[#bfbfbf] ${style.beforeselect}`
          } border-2`}
          onChange={(e) => setBio({ ...bio, district: e.target.value })}
        >
          <option value="0" disabled selected></option>
          {district.map((d, i) => (
            <option value={d.id} key={i}>
              {i18n.language == "th" ? d.name_th : d.name_en}
            </option>
          ))}
        </select>
        <label
          for="district"
          className={`${
            bio.district != "0" ? style.selected_label : style.form_label
          }`}
        >
          {t("district")}
        </label>
      </div>
    </div>
  );
}
