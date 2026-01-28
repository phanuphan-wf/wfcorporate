import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useTranslation } from "react-i18next";
import Modal from "./FillModal";

import { TiDelete } from "react-icons/ti";

export default function Jobform() {
  //const nav = useNavigate();
  const { id } = useParams(); // jobId จาก url
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;  


  const [province, setProvince] = useState([]);
  const getProvince = async () => {
    try {
      const res = await Axios.get(url + "/GetProvince", {
        headers: {
          "Accept-Language": lang === "th" ? "th" : "en",
        },
      });
      setProvince(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  const [district, setDistrict] = useState([]);
  const getDistrict = async (provinceId) => {
    if (!provinceId) return;

    try {
      const res = await Axios.get(url + "/GetDistrict/" + provinceId, {
        headers: {
          "Accept-Language": lang === "th" ? "th" : "en",
        },
      });
      setDistrict(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  const [subdistrict, setSubdistrict] = useState([]);
  const getSubdistrict = async (districtId) => {
    if (!districtId) return;

    try {
      const res = await Axios.get(url + "/GetSubDistrict/" + districtId, {
        headers: {
          "Accept-Language": lang === "th" ? "th" : "en",
        },
      });
      setSubdistrict(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    getProvince();
    setForm((prev) => ({
      ...prev,
      district: "",
      subdistrict: "",
    }));
    
  }, [lang]);


    const onProvinceChange = (e) => {
    const provinceId = e.target.value;

    setForm({
      ...form,
      province: provinceId,
      district: "",
      subdistrict: "",
    });

    setDistrict([]);
    setSubdistrict([]);
    getDistrict(provinceId);
  };

  const onDistrictChange = (e) => {
    const districtId = e.target.value;

    setForm({
      ...form,
      district: districtId,
      subdistrict: "",
    });

    setSubdistrict([]);
    getSubdistrict(districtId);
  };


  /* ================= STATE ================= */
  const initData = {
    jobId: id,
    name: "",
    surname: "",
    addr: "",
    subdistrict: "",
    district: "",
    province: "",
    mobile: "",
    sex: null,
    birthday: "",
    accept: false,
  };

  //console.log(initData);

  const [form, setForm] = useState(initData);

  const initBirthDay = {
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear() - 20,
  };
  const [birthday, setBirthday] = useState(initBirthDay);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const months = [
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

  const getYears = () => {
    const current = new Date().getFullYear();
    return Array.from({ length: 40 }, (_, i) => current - (i + 20));
  };

  const formatBirthday = () => {
    let b = birthday;
    const y = b.year;
    const m = String(b.month).padStart(2, "0");
    const d = String(b.day).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  

  const fileInputRef = useRef(null);
  const [picture, setPicture] = useState();
  const [preview, setPreview] = useState();

  //console.log(picture);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setPicture(null);
    setPreview("");

    // reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const [resumeType, setResumeType] = useState("file"); // file | form
  const [resume, setResume] = useState();
  const [resumeError, setResumeError] = useState("");
  const resumeInputRef = useRef(null);

  //console.log(resume);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ PDF only
    if (file.type !== "application/pdf") {
      setResume(null);
      setResumeError(
        lang === "th"
          ? "รองรับเฉพาะไฟล์ PDF"
          : "Only PDF files are supported."
      );
      e.target.value = "";
      return;
    }

    // ✅ ≤ 5MB
    if (file.size > 5 * 1024 * 1024) {
      setResume(null);
      setResumeError(
        lang === "th"
          ? "ไฟล์ต้องมีขนาดไม่เกิน 5MB"
          : "File size must not exceed 5MB"
      );
      e.target.value = "";
      return;
    }
    
    setResume(file);      
    setResumeError("");
  };


  const handleRemoveResume = () => {
    setResume(null);
    setResumeError("");

    if (resumeInputRef.current) {
      resumeInputRef.current.value = ""; // ⭐ reset input file
    }
  };

  const initialEddu = [
    { Level: "", Institute: "", Subject: "", GYear: "" },
  ];

  const initialHist = [
    { WYear: "", Company: "", Position: "", Funct: "" },
  ];

  const [eddu, setEddu] = useState(initialEddu);
  const [hist, setHist] = useState(initialHist);


  /* ================= HANDLER ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  

   const [modalFillShow, setModalFillShow] = useState({
    show: false,
    message: "",
  });

  const closeFillModal = () => {
    setModalFillShow({
      ...modalFillShow,
      show: false,
    });
  };
  const openFillModal = (msg) => {
    setModalFillShow({
      show: true,
      message: msg,
    });
  };



  /* =============== check from ================ */

  const isEdduComplete = (item) =>
    item.Level &&
    item.Institute &&
    item.Subject &&
    item.GYear;

  const handleAddEddu = () => {
    const lastEddu = eddu[eddu.length - 1];

    if (!isEdduComplete(lastEddu)) {
      openFillModal(
        lang === "th"
          ? "กรุณากรอกข้อมูลการศึกษาให้ครบก่อนเพิ่มรายการใหม่"
          : "Please complete the education information before adding a new one."

      );   
      return false;
    }

    setEddu([
      ...eddu,
      { Level: "", Institute: "", Subject: "", GYear: "" },
    ]);
  };
  

  const isHistComplete = (item) =>
    item.WYear &&
    item.Company &&
    item.Position &&
    item.Funct;

    const handleAddHist = () => {
    const lastHist = hist[hist.length - 1];

    if (!isHistComplete(lastHist)) {
      openFillModal(
        lang === "th"
          ? "กรุณากรอกข้อมูลประสบการณ์การทำงานให้ครบก่อนเพิ่มรายการใหม่"
          : "Please complete the work experience information before adding a new one."
      );
      return;
    }

    setHist([
      ...hist,
      { WYear: "", Company: "", Position: "", Funct: "" },
    ]);
  };


  const validateForm = () => {
    if (!picture) {
      openFillModal(lang === "th" ? "กรุณาอัปโหลดรูปภาพ" : "Please upload photo");
      return false;
    }

    if (!form.name.trim()) {
      openFillModal(lang === "th" ? "กรุณากรอกชื่อ" : "Please enter name");
      return false;
    }

    if (!form.surname.trim()) {
      openFillModal(lang === "th" ? "กรุณากรอกนามสกุล" : "Please enter surname");
      return false;
    }

    if (!form.mobile.trim()) {
      openFillModal(lang === "th" ? "กรุณากรอกเบอร์โทรศัพท์" : "Please enter mobile");
      return false;
    }

    if (form.sex === null) {
      openFillModal(lang === "th" ? "กรุณาเลือกเพศ" : "Please select SEX");
      return false;
    }

    if (!form.addr.trim()) {
      openFillModal(lang === "th" ? "กรุณากรอกที่อยู่" : "Please enter your address");
      return false;
    }

    if (!form.province) {
      openFillModal(lang === "th" ? "กรุณาเลือกจังหวัด" : "Please select province");
      return false;
    }

    if (!form.district) {
      openFillModal(lang === "th" ? "กรุณาเลือกอำเภอ" : "Please select district");
      return false;
    }

    if (!form.subdistrict) {
      openFillModal(lang === "th" ? "กรุณาเลือกตำบล" : "Please select subdistrict");
      return false;
    }
   
    // if (!birthday) {
    //   openFillModal(lang === "th" ? "กรุณาเลือกวันเกิด" : "Please select birthday");
    //   return false;
    // }

    if (resumeType === "file" && !resume) {
      openFillModal(
        lang === "th"
          ? "กรุณาเพิ่มไฟล์ Resume ก่อนส่งใบสมัคร"
          : "Please upload your resume before submitting."
      );
      return false;
    }

    //console.log(resumeType);


    if (resumeType === "form") {
      const hasValidEddu = eddu.every(isEdduComplete);
      const hasValidHist = hist.every(isHistComplete);

      if (!hasValidEddu) {
        openFillModal(
          lang === "th"
            ? "กรุณากรอกประวัติการศึกษาให้ครบ"
            : "Please complete education"
        );
        return false;
      }

      if (!hasValidHist) {
        openFillModal(
          lang === "th"
            ? "กรุณากรอกประสบการณ์ทำงานให้ครบ"
            : "Please complete work experience."
        );
        return false;
      }
    }
    

    return true;
  };


   
  /* ================= SUBMIT ================= */
  const submitApply = async () => {
    if (!validateForm()) {
      return;
    }

    console.log(validateForm());

    const formData = new FormData();

    formData.append("jobId", id);
    formData.append("name", form.name);
    formData.append("surname", form.surname);
    formData.append("addr", form.addr);
    formData.append("subdistrict", form.subdistrict);
    formData.append("district", form.district);
    formData.append("province", form.province);
    formData.append("mobile", form.mobile);
    formData.append("sex", form.sex);
    formData.append("birthday", formatBirthday());
    formData.append("accept", true);

    if (resume) {
      formData.append("resume", resume); // File
    }

    if (picture) {
      formData.append("picture", picture); // File
    }
    


    if (resumeType == "file") {
      formData.append("Eddu[0].Level", "0");
      formData.append("Eddu[0].Institute", "0");
      formData.append("Eddu[0].Subject", "0");
      formData.append("Eddu[0].GYear", 0);

      formData.append("Hist[0].WYear", "0");
      formData.append("Hist[0].Company", "0");
      formData.append("Hist[0].Position", "0");
      formData.append("Hist[0].Funct", "0");
      
      //return;
    }else{
      // Eddu
      eddu.forEach((eddu, i) => {
        formData.append(`Eddu[${i}].Level`, eddu.Level);
        formData.append(`Eddu[${i}].Institute`, eddu.Institute);
        formData.append(`Eddu[${i}].Subject`, eddu.Subject);
        formData.append(`Eddu[${i}].GYear`, eddu.GYear);
      });
      // Hist
      hist.forEach((hist, i) => {
        formData.append(`Hist[${i}].WYear`, hist.WYear);
        formData.append(`Hist[${i}].Company`, hist.Company);
        formData.append(`Hist[${i}].Position`, hist.Position);
        formData.append(`Hist[${i}].Funct`, hist.Funct);
      });

    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }



    try {
      const res = await Axios.post(url + "/postApply", formData);

      if (res.status === 200) {
        openFillModal(
          lang === "th"
            ? "ส่งข้อมูลสมัครงานสำเร็จ กรุณารอเจ้าหน้าที่ติดต่อกลับ"
            : "Your job application has been submitted successfully. Please wait for our team to contact you."
        );

         setForm(initData);
         setEddu(initialEddu);
         setHist(initialHist);
         setBirthday(initBirthDay);
         
         handleRemoveImage();
         handleRemoveResume();
        
      }

     

    } catch (err) {
      console.error(err.response || err);
      alert("Submit failed");
    }
  };

  useEffect(() => {
    console.log(birthday);
  }, [birthday]);

  // useEffect(() =>{
  //   console.log(form);
  // },[form]);
 
  /* ================= JSX ================= */
  return (
    <section className="jobform my-10 px-4 sm:px-10 lg:px-20">
      <div className="headline mb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-center">
            {lang === "th" ? "แบบฟอร์มสมัครงาน" : "Job Application Form"}
          </h1>
        </div>
      </div>

      {/* FORM WRAPPER */}
      <div className="flex justify-center w-full mt-5 mb-3">
        <div className="w-full sm:w-[90%] lg:w-4/5">
          <h1 className="text-2xl font-semibold mb-6">
            {lang === "th" ? "ประวัติส่วนตัว" : "Personal information"}
          </h1>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
            {/* PHOTO BOX (CLICKABLE) */}
            <div
              onClick={() => fileInputRef.current.click()}
              className="relative w-32 h-40 border-2 border-dashed border-gray-400 bg-gray-50
                          flex items-center justify-center cursor-pointer
                          mx-auto sm:mx-0 hover:border-red-400 transition">
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />

                  {/* ปุ่มลบ */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // ❗ กันไม่ให้ trigger เลือกรูปอีก
                      handleRemoveImage();
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600">
                    ✕
                  </button>
                </>
              ) : (
                <span className="text-gray-400 text-sm text-center px-2">
                  {lang === "th"
                    ? "คลิกเพื่อเลือกรูป"
                    : "Click to upload photo"}
                </span>
              )}
            </div>

            {/* INPUT FILE (HIDDEN) */}
            <input              
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* BASIC INFO */}
          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <input
              name="name"
              placeholder={lang === "th" ? "ชื่อ" : "Name"}
              value={form.name}
              onChange={handleChange}
              className="border p-2 w-full"
            />

            <input
              name="surname"
              placeholder={lang === "th" ? "นามสกุล" : "Surname"}
              value={form.surname}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <input
              name="mobile"
              placeholder={lang === "th" ? "เบอร์โทร" : "Mobile"}
              value={form.mobile}
              onChange={handleChange}
              className="border p-2 w-full"
            />

           
            {/* SEX */}
              <div className="flex border rounded-md overflow-hidden">
                
                {/* MALE */}
                <label
                  className={`flex-1 text-center cursor-pointer py-2 transition
                    ${form.sex === true ? "bg-white" : "bg-gray-100 text-gray-500"}`}
                >
                  <input
                    type="radio"
                    name="sex"
                    checked={form.sex === true}
                    onChange={() => setForm({ ...form, sex: true })}
                    className="hidden"
                  />
                  {lang === "th" ? "ชาย" : "Male"}
                </label>

                {/* FEMALE */}
                <label
                  className={`flex-1 text-center cursor-pointer py-2 transition
                    ${form.sex === false ? "bg-white" : "bg-gray-100 text-gray-500"}`}
                >
                  <input
                    type="radio"
                    name="sex"
                    checked={form.sex === false}
                    onChange={() => setForm({ ...form, sex: false })}
                    className="hidden"
                  />
                  {lang === "th" ? "หญิง" : "Female"}
                </label>

              </div>

          </div>

          {/* BIRTHDAY */}
          <div className="mb-3">
            <div className="grid grid-cols-3 gap-3">
              {/* DAY */}
              <select
                className="border p-2"
                value={birthday.day}
                onChange={(e) =>
                  setBirthday({ ...birthday, day: e.target.value })
                }>
                {days.map((d) =>
                  d == birthday.day ? (
                    <option key={d} value={d} selected>
                      {d}
                    </option>
                  ) : (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ),
                )}
              </select>

              {/* MONTH */}
              <select
                className="border p-2"
                value={birthday.month}
                onChange={(e) =>
                  setBirthday({ ...birthday, month: e.target.value })
                }>
                {months.map((m, i) =>
                  i + 1 == birthday.month ? (
                    <option key={i} value={i + 1} selected>
                      {lang === "th" ? m.th : m.en}
                    </option>
                  ) : (
                    <option key={i} value={i + 1}>
                      {lang === "th" ? m.th : m.en}
                    </option>
                  ),
                )}
              </select>

              {/* YEAR */}
              <select
                className="border p-2"
                value={birthday.year}
                onChange={(e) =>
                  setBirthday({ ...birthday, year: e.target.value })
                }>
                {getYears().map((y) => (
                  <option key={y} value={y}>
                    {lang === "th" ? y + 543 : y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-2">
            {/* ADDRESS */}
            <input
              name="addr"
              placeholder={lang === "th" ? "ที่อยู่" : "Address"}
              value={form.addr}
              onChange={handleChange}
              className="border p-2 w-full mb-3"
              rows={4}
            />
          </div>

          <div className="mb-3">
            <div className="grid grid-cols-3 gap-3">  

              <select
                value={form.province}
                onChange={onProvinceChange}
                className="border p-2 w-full"
              >
                <option value="0">{lang === "th" ? "จังหวัด" : "Province"}</option>
                  {province.map((p, i) => (
                    <option value={p.id} key={i}>
                      {p.name}
                    </option>
                  ))}
              </select>

              <select
                id="district"
                value={form.district}
                onChange={onDistrictChange}
                disabled={!form.province}
                className="border p-2 w-full"
              >
                <option value="0">{lang === "th" ? "อำเภอ/เขต" : "District"}</option>
                 {district.map((d, i) => (
                  <option value={d.id} key={i}>
                    {d.name}
                  </option>
                ))}
              </select>

              <select
                id="subdistrict"
                value={form.subdistrict}
                onChange={(e) =>
                  setForm({ ...form, subdistrict: e.target.value })
                }
                disabled={!form.province}
                className="border p-2 w-full"
              >
                <option value="0">{lang === "th" ? "ตำบล" : "Subdistrict"}</option>
                 {subdistrict.map((s, i) => (
                  <option value={s.id} key={i}>
                    {s.name}
                  </option>
                ))}
              </select>
                        

            </div>
          </div>

          <h1 className="text-2xl font-semibold mb-4">
            {lang === "th" ? "รูปแบบการสมัคร" : "Resume Type"}
          </h1>

          <div className="flex gap-6 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="resumeType"
                checked={resumeType === "file"}
                onChange={() => setResumeType("file")}
              />
              {lang === "th" ? "แนบไฟล์ Resume" : "Upload Resume"}
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="resumeType"
                checked={resumeType === "form"}
                onChange={() => setResumeType("form")}
              />
              {lang === "th" ? "กรอกข้อมูลด้วยตนเอง" : "Fill Information"}
            </label>
          </div>

          {resumeType === "file" && (
            <div className="mb-6">
              <label className="font-medium block mb-2 text-sm sm:text-base">
                {lang === "th" ? "แนบไฟล์ Resume (PDF)" : "Upload Resume (PDF)"}
              </label>

              <label
                className="
                    block w-full 
                    border border-dashed rounded-md 
                    p-4 text-center cursor-pointer 
                    text-sm sm:text-base 
                    text-gray-600 
                    hover:border-red-400 transition
                    bg-gray-50
                  ">
                {resume ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-gray-800">
                      📄 {resume.name}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveResume();
                        setResume(null);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm">
                      ❌
                    </button>
                  </div>
                ) : (
                  <span>
                    {lang === "th"
                      ? "แตะเพื่อเลือกไฟล์ PDF"
                      : "Tap to upload PDF"}
                  </span>
                )}

                <input                  
                  type="file"
                  accept="application/pdf"
                  ref={resumeInputRef}
                  onChange={handleResumeChange}
                  className="hidden"
                />
              </label>

              {resumeError && (
                <p className="text-red-500 text-sm mt-2">⚠️ {resumeError}</p>
              )}
            </div>
          )}

          {resumeType === "form" && (
            <>
              {/* EDUCATION */}
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">
                  {lang === "th" ? "ประวัติการศึกษา" : "Education"}
                </h1>

                <button
                  type="button"
                  onClick={handleAddEddu}
                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5">
                  {lang === "th" ? "เพิ่มประวัติการศึกษา" : "Add Education"}
                </button>
              </div>

              {eddu.map((e, i) => (
                <div key={i} className="grid md:grid-cols-4 gap-3 mb-3">
                  {/* ระดับการศึกษา */}
                  <input
                    placeholder={lang === "th" ? "ระดับการศึกษา" : "Level"}
                    value={e.Level}
                    onChange={(ev) => {
                      const n = [...eddu];
                      n[i].Level = ev.target.value;
                      setEddu(n);
                    }}
                    className="border p-2"
                  />

                  {/* สถาบัน */}
                  <input
                    placeholder={lang === "th" ? "สถาบัน" : "Institute"}
                    value={e.Institute}
                    onChange={(ev) => {
                      const n = [...eddu];
                      n[i].Institute = ev.target.value;
                      setEddu(n);
                    }}
                    className="border p-2"
                  />

                  {/* สาขา */}
                  <input
                    placeholder={lang === "th" ? "สาขา" : "Subject"}
                    value={e.Subject}
                    onChange={(ev) => {
                      const n = [...eddu];
                      n[i].Subject = ev.target.value;
                      setEddu(n);
                    }}
                    className="border p-2"
                  />

                  <div className="flex gap-2">
                    <input
                      placeholder={
                        lang === "th" ? "ปีที่จบ" : "Graduation Year"
                      }
                      value={e.GYear}
                      onChange={(ev) => {
                        const n = [...eddu];
                        n[i].GYear = ev.target.value;
                        setEddu(n);
                      }}
                      className="border p-2 w-full"
                    />

                    {eddu.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setEddu(eddu.filter((_, index) => index !== i))
                        }
                        className="px-3 text-red-500 hover:text-red-700 border rounded"
                        title={lang === "th" ? "ลบแถวนี้" : "Remove"}>
                        <TiDelete size={30} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* WORK EXPERIENCE */}
              <div className="flex items-center justify-between mb-4 mt-8">
                <h1 className="text-lg font-semibold sm:text-2xl">
                  {lang === "th" ? "ประสบการณ์การทำงาน" : "Work Experience"}
                </h1>

                <button
                  type="button"
                  onClick={handleAddHist}
                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5">
                  {lang === "th" ? "เพิ่มประสบการณ์" : "Add Experience"}
                </button>
              </div>

              {hist.map((h, i) => (
                <div key={i} className="grid md:grid-cols-4 gap-3 mb-3">
                  <input
                    placeholder={
                      lang === "th" ? "ช่วงปีที่ทำงาน" : "Working Year"
                    }
                    value={h.WYear}
                    onChange={(ev) => {
                      const n = [...hist];
                      n[i].WYear = ev.target.value;
                      setHist(n);
                    }}
                    className="border p-2"
                  />

                  <input
                    placeholder={lang === "th" ? "บริษัท" : "Company"}
                    value={h.Company}
                    onChange={(ev) => {
                      const n = [...hist];
                      n[i].Company = ev.target.value;
                      setHist(n);
                    }}
                    className="border p-2"
                  />

                  <input
                    placeholder={lang === "th" ? "ตำแหน่ง" : "Position"}
                    value={h.Position}
                    onChange={(ev) => {
                      const n = [...hist];
                      n[i].Position = ev.target.value;
                      setHist(n);
                    }}
                    className="border p-2"
                  />

                  <div className="flex gap-2">
                    <input
                      placeholder={
                        lang === "th" ? "หน้าที่รับผิดชอบ" : "Function"
                      }
                      value={h.Funct}
                      onChange={(ev) => {
                        const n = [...hist];
                        n[i].Funct = ev.target.value;
                        setHist(n);
                      }}
                      className="border p-2 flex-1"
                    />

                    {hist.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setHist(hist.filter((_, index) => index !== i))
                        }
                        className="px-3 text-red-500 hover:text-red-700 border rounded"
                        title={lang === "th" ? "ลบแถวนี้" : "Remove"}>
                        <TiDelete size={30} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ACCEPT */}
          <label className="flex items-center gap-2 my-6">
            <input
              type="checkbox"
              name="accept"
              checked={form.accept}
              onChange={(e) =>
                setForm({ ...form, accept: e.target.checked })
              }
            />

            {lang === "th"
              ? "ยินยอมให้บริษัทเก็บข้อมูลส่วนบุคคล"
              : "I accept personal data policy"}
          </label>

          {/* SUBMIT */}
          <button        
            disabled={!form.accept}
            className={`mt-2 mx-auto w-full sm:w-3/4 md:w-1/4 px-8 py-2 text-white ${
              form.accept
                ? "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={submitApply}>
            {lang === "th" ? "ส่งใบสมัคร" : "Apply"}
          </button>
        
        
          <Modal
            show={modalFillShow.show}
            message={modalFillShow.message}
            onClose={closeFillModal}
            lang={lang}
          />

        </div>
      </div>

     
    </section>

    
  );
}
