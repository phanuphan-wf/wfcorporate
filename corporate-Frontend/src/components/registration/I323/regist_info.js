import React, { useEffect, useState } from "react";
import Axios from "axios";

import style from "./registraion.module.css";

export default function RegistInfo(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_reg;

  const getYear = () => {
    let y = [];
    let sy = new Date().getFullYear() + 543;
    let ey = sy - 100;
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

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 container max-w-5xl px-10 mb-10">
      <div className={`${style.form_group} field_name`}>
        <input
          id="name"
          placeholder="name"
          className={`${style.form_field} ${
            !verify && bio.name == ""
              ? "bg-red-300 bg-opacity-40"
              : "bg-transparent"
          }`}
          onChange={(e) => setBio({ ...bio, name: e.target.value })}
        />
        <label for="name" className={style.form_label}>
          ชื่อ *
        </label>
      </div>

      <div className={`${style.form_group} field_surname`}>
        <input
          id="surname"
          placeholder="surname"
          className={`${style.form_field} ${
            !verify && bio.surname == ""
              ? "bg-red-300 bg-opacity-40"
              : "bg-transparent"
          }`}
          onChange={(e) => setBio({ ...bio, surname: e.target.value })}
        />
        <label for="surname" className={style.form_label}>
          นามสกุล *
        </label>
      </div>

      <div className={`${style.form_group} field_mobile`}>
        <input
          id="mobile"
          placeholder="mobile"
          className={`${style.form_field} ${
            !verify && bio.mobile == ""
              ? "bg-red-300 bg-opacity-40"
              : "bg-transparent"
          }`}
          onChange={(e) => setBio({ ...bio, mobile: e.target.value })}
        />
        <label for="mobile" className={style.form_label}>
          เบอร์มือถือ *
        </label>
        <span className={`text-red-500 ${mobileFormat ? "hidden" : ""}`}>
          * กรุณากรอกเบอร์มือถือที่ถูกต้อง และไม่มีอักขระใดๆ
        </span>
      </div>

      <div className={`${style.form_group} field_email`}>
        <input
          id="email"
          placeholder="email"
          className={style.form_field}
          onChange={(e) => setBio({ ...bio, email: e.target.value })}
        />
        <label for="email" className={style.form_label}>
          อีเมล
        </label>
        <span className={`text-red-500 ${emailFormat ? "hidden" : ""}`}>
          * กรุณากรอกอีเมลในรูปแบบที่ถูกต้อง
        </span>
      </div>

      <div className={`${style.form_group} field_sex`}>
        <select
          id="sex"
          className={`${style.form_field} ${
            !verify && bio.sex == "0"
              ? "bg-red-300 bg-opacity-40"
              : "bg-transparent"
          }`}
          onChange={(e) => setBio({ ...bio, sex: e.target.value })}
        >
          <option value="0" disabled selected hidden>
            โปรดเลือก
          </option>
          <option value="1">ชาย</option>
          <option value="2">หญิง</option>
          <option value="3">ไม่ระบุ</option>
        </select>
        <label for="sex" className={style.form_label}>
          เพศ *
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`${style.form_group} field_month`}>
          <select
            id="month"
            className={style.form_field}
            onChange={(e) => setBio({ ...bio, month: e.target.value })}
          >
            <option value="0" disabled selected hidden>
              โปรดเลือก
            </option>
            {[
              "มกราคม",
              "กุมภาพันธ์",
              "มีนาคม",
              "เมษายน",
              "พฤษภาคม",
              "มิถุนายน",
              "กรกฎาคม",
              "สิงหาคม",
              "กันยายน",
              "ตุลาคม",
              "พฤศจิกายน",
              "ธันวาคม",
            ].map((m, id) => (
              <option value={id + 1} key={id}>
                {m}
              </option>
            ))}
          </select>
          <label for="month" className={style.form_label}>
            เดือนเกิด
          </label>
        </div>

        <div className={`${style.form_group} field_year`}>
          <select
            id="year"
            className={`${style.form_field} ${
              !verify && bio.year == "0"
                ? "bg-red-300 bg-opacity-40"
                : "bg-transparent"
            }`}
            onChange={(e) => setBio({ ...bio, year: e.target.value })}
          >
            <option value="0" disabled selected hidden>
              โปรดเลือก
            </option>
            {getYear().map((y, i) => (
              <option value={y} key={i}>
                {y}
              </option>
            ))}
          </select>
          <label for="year" className={style.form_label}>
            ปีเกิด *
          </label>
        </div>
      </div>

      <div className={`${style.form_group} field_income`}>
        <select
          id="imcome"
          className={style.form_field}
          onChange={(e) => setBio({ ...bio, income: e.target.value })}
        >
          <option value="0" disabled selected hidden>
            โปรดเลือก
          </option>
          {[
            { id: "10", val: "น้อยว่า 15,000" },
            { id: "15", val: "15,001-30,000" },
            { id: "30", val: "30,001-50,000" },
            { id: "50", val: "50,001-70,000" },
            { id: "70", val: "70,001-90,000" },
            { id: "90", val: "90,001-120,000" },
            { id: "120", val: "มากว่า 120,000" },
          ].map((inc, i) => (
            <option value={inc.id} key={i}>
              {inc.val}
            </option>
          ))}
        </select>
        <label for="income" className={style.form_label}>
          ฐานรายได้
        </label>
      </div>

      <div className={`${style.form_group} field_occupation`}>
        <select
          id="occupation"
          className={style.form_field}
          onChange={(e) => setBio({ ...bio, occupation: e.target.value })}
        >
          <option value="0" disabled selected hidden>
            โปรดเลือก
          </option>
          {occupation.map((d, i) => (
            <option value={d.id} key={i}>
              {d.occu}
            </option>
          ))}
        </select>
        <label for="occupation" className={style.form_label}>
          อาชีพ
        </label>
      </div>

      <div className={`${style.form_group} field_province`}>
        <select
          id="province"
          className={`${style.form_field} ${
            !verify && bio.province == "0"
              ? "bg-red-300 bg-opacity-40"
              : "bg-transparent"
          }`}
          onChange={(e) => onProvinceChange(e)}
        >
          <option value="0" disabled selected hidden>
            โปรดเลือก
          </option>
          {province.map((p, i) => (
            <option value={p.id} key={i}>
              {p.name_th}
            </option>
          ))}
        </select>
        <label for="province" className={style.form_label}>
          จังหวัด *
        </label>
      </div>

      <div className={`${style.form_group} field_district`}>
        <select
          id="district"
          className={`${style.form_field} ${
            !verify && bio.district == "0"
              ? "bg-red-300 bg-opacity-40"
              : "bg-transparent"
          }`}
          onChange={(e) => setBio({ ...bio, district: e.target.value })}
        >
          <option value="0" disabled selected>
            โปรดเลือก
          </option>
          {district.map((d, i) => (
            <option value={d.id} key={i}>
              {d.name_th}
            </option>
          ))}
        </select>
        <label for="district" className={style.form_label}>
          อำเภอ/เขต *
        </label>
      </div>
    </div>
  );
}
