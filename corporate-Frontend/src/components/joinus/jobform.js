import React, { useState, useRef,useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useTranslation } from "react-i18next";

import { TiDelete } from "react-icons/ti";

export default function Jobform() {
  //const nav = useNavigate();
  const { id } = useParams(); // jobId จาก url
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;

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
    sex: true,
    //birthday: "",
    accept: false,
  };

  //console.log(initData);

  const [form, setForm] = useState(initData);

  const [birthday, setBirthday] = useState({
    day: "0",
    month: "0",
    year: "0",
  });

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
      return Array.from({ length: 40 }, (_, i) => current -(i + 20));
  };
    

  const formatBirthday = () => {

    if (!birthday.day || !birthday.month || !birthday.year) return "";

    const day = String(birthday.day).padStart(2, "0");
    const month = String(birthday.month).padStart(2, "0");
    const year = birthday.year; 

    return `${year}-${month}-${day}`;
  };


  const fileInputRef = useRef();
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
      setPicture();
      setPreview();

      // reset input file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const [resumeType, setResumeType] = useState("file"); // file | form
    const [resume, setResume] = useState();
    const [resumeError, setResumeError] = useState("");
    const resumeInputRef = useRef();

    const handleResumeChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // PDF only
      if (file.type !== "application/pdf") {
        setResume();
        setResumeError("กรุณาอัปโหลดไฟล์ PDF เท่านั้น");
        e.target.value = ""; // ⭐ reset
        return;
      }

      // ≤ 5MB
      if (file.size > 5 * 1024 * 1024) {
        setResume();
        setResumeError("ขนาดไฟล์ต้องไม่เกิน 5MB");
        e.target.value = ""; // ⭐ reset
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

    const [eddu, setEddu] = useState([
      { Level: "", Institute: "", Subject: "", GYear: "" },
    ]);

    const [hist, setHist] = useState([
      { WYear: "", Company: "", Position: "", Funct: "" },
    ]);

    /* ================= HANDLER ================= */
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

  /* ================= SUBMIT ================= */ 
    const submitApply = async () => {

      const formData = new FormData();

      formData.append("jobId",12);
      formData.append("name", "Test");
      formData.append("surname", "App");
      formData.append("addr", "99/9 ถนนสุขุมวิท");
      formData.append("subdistrict", "100101");
      formData.append("district", "1001");
      formData.append("province", "10");
      formData.append("mobile", "0891234567");
      formData.append("sex", true);
      formData.append("birthday", formatBirthday());
      formData.append("accept", true);

      // if (resume) {
      //   formData.append("resume", resume); // File
      // }

      // if (picture) {
      //   formData.append("picture", picture); // File
      // }   
      // // Eddu
      // formData.append("Eddu[0].Level", "ปริญญาตรี");
      // formData.append("Eddu[0].Institute", "Chulalongkorn University");
      // formData.append("Eddu[0].Subject", "Computer Engineering");
      // formData.append("Eddu[0].GYear", "2020");

      // // Hist
      // formData.append("Hist[0].WYear", "2020-2025");
      // formData.append("Hist[0].Company", "World Fair Co., Ltd.");
      // formData.append("Hist[0].Position", "Developer");
      // formData.append("Hist[0].Funct", "BuildApp");

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }


      try {
        const res = await Axios.post(url + "/postApply", formData);

        if (res.status === 200) {
          alert("Apply success");
        }
      } catch (err) {
        console.error(err.response || err);
        alert("Submit failed");
      }
      

    };    

    useEffect(() => {
            
    }, []);



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
                          mx-auto sm:mx-0 hover:border-red-400 transition"
              >
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
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400 text-sm text-center px-2">
                    {lang === "th" ? "คลิกเพื่อเลือกรูป" : "Click to upload photo"}
                  </span>
                )}
              </div>

              {/* INPUT FILE (HIDDEN) */}
              <input
                ref={fileInputRef}
                type="file"
                accept=""
                onChange={handleImageChange}
                className="hidden"
              />

          </div>



            {/* BASIC INFO */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
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

            <div className="grid md:grid-cols-2 gap-4 mb-6">
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
                      <div
                        className={`flex-1 text-center cursor-pointer py-2 transition
                          ${form.sex === "1" ? "bg-white" : "bg-gray-100 text-gray-500"}`}
                        onClick={() => setForm({ ...form, sex: "1" })}
                      >
                        <input
                          type="radio"
                          name="sex"
                          value="1"
                          checked={form.sex === "1"}
                          onChange={() => {}}
                          className="hidden"
                        />
                        {lang === "th" ? "ชาย" : "Male"}
                      </div>

                      {/* FEMALE */}
                      <div
                        className={`flex-1 text-center cursor-pointer py-2 transition
                          ${form.sex === "2" ? "bg-white" : "bg-gray-100 text-gray-500"}`}
                        onClick={() => setForm({ ...form, sex: "2" })}
                      >
                        <input
                          type="radio"
                          name="sex"
                          value="2"
                          checked={form.sex === "2"}
                          onChange={() => {}}
                          className="hidden"
                        />
                        {lang === "th" ? "หญิง" : "Female"}
                      </div>

                      {/* NOT SPECIFIED */}
                      <div
                        className={`flex-1 text-center cursor-pointer py-2 transition
                          ${form.sex === "3" ? "bg-white" : "bg-gray-100 text-gray-500"}`}
                        onClick={() => setForm({ ...form, sex: "3" })}
                      >
                        <input
                          type="radio"
                          name="sex"
                          value="3"
                          checked={form.sex === "3"}
                          onChange={() => {}}
                          className="hidden"
                        />
                        {lang === "th" ? "ไม่ระบุ" : "Not specified"}
                      </div>
                  </div>
            </div>

            {/* BIRTHDAY */}
            <div className="mb-6">           
              <div className="grid grid-cols-3 gap-3">

                {/* DAY */}
                <select
                    className="border p-2"
                    value={birthday.day}
                    onChange={(e) =>
                      setBirthday({ ...birthday, day: e.target.value })
                    }                 
                >
                  <option value={0} disabled hidden>
                    {lang === "th" ? "วันเกิด" : "Day"}
                  </option>
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>


                {/* MONTH */}
                <select
                  className="border p-2"
                  value={birthday.month}
                  onChange={(e) =>
                    setBirthday({ ...birthday, month: e.target.value })
                  }                
                >
                  <option value={0} disabled hidden>
                    {lang === "th" ? "เดือนเกิด" : "Month"}
                  </option>
                  {months.map((m, i) => (
                    <option key={i} value={i + 1}>
                      {lang === "th" ? m.th : m.en}
                    </option>
                  ))}
                </select>


                {/* YEAR */}
                <select
                  className="border p-2"
                  value={birthday.year}
                  onChange={(e) =>
                    setBirthday({ ...birthday, year: e.target.value })
                  }                 
                >

                  <option value={0} disabled hidden>
                    {lang === "th" ? "ปีเกิด" : "Year"}
                  </option>
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
                    className="border p-2 w-full mb-6"
                    rows={4}
                />
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-3 gap-3">
                     <input
                        name="subdistrict"
                        placeholder={lang === "th" ? "ตำบล" : "Subdistrict"}
                        value={form.subdistrict}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />

                    <input
                        name="district"
                        placeholder={lang === "th" ? "อำเภอ" : "District"}
                        value={form.district}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />

                    <input
                      name="province"
                      placeholder={lang === "th" ? "จังหวัด" : "Province"}
                      value={form.province}
                      onChange={handleChange}
                      className="border p-2 w-full"
                   />
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
                  "
                >
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
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
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
                    ref={resumeInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeChange}
                    className="hidden"
                  />
                </label>

                {resumeError && (
                  <p className="text-red-500 text-sm mt-2">
                    ⚠️ {resumeError}
                  </p>
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
                    onClick={() =>
                      setEddu([
                        ...eddu,
                        { Level: "", Institute: "", Subject: "", GYear: "" },
                      ])
                    }
                     className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
                  >
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
                          placeholder={lang === "th" ? "ปีที่จบ" : "Graduation Year"}
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
                            title={lang === "th" ? "ลบแถวนี้" : "Remove"}
                          >
                            <TiDelete  size={30} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}


                {/* WORK EXPERIENCE */}
                <div className="flex items-center justify-between mb-4 mt-8">
                  <h1 className="text-2xl font-semibold">
                    {lang === "th" ? "ประสบการณ์การทำงาน" : "Work Experience"}
                  </h1>

                  <button
                    type="button"
                    onClick={() =>
                      setHist([
                        ...hist,
                        { WYear: "", Company: "", Position: "", Funct: "" },
                      ])
                    }
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
                  >
                    {lang === "th" ? "เพิ่มประสบการณ์" : "Add Experience"}
                  </button>
                </div>


                {hist.map((h, i) => (
                  <div key={i} className="grid md:grid-cols-4 gap-3 mb-3">
                    <input
                      placeholder={lang === "th" ? "ช่วงปีที่ทำงาน" : "Working Year"}
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
                        placeholder={lang === "th" ? "หน้าที่รับผิดชอบ" : "Function"}
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
                          title={lang === "th" ? "ลบแถวนี้" : "Remove"}
                        >
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
                  onChange={handleChange}
                />
                {lang === "th"
                ? "ยินยอมให้บริษัทเก็บข้อมูลส่วนบุคคล"
                : "I accept personal data policy"}
            </label>
         
            

            {/* SUBMIT */}
            <button
               // onClick={submitApply}
                disabled={!form.accept}
                className={`mt-2 mx-auto w-full sm:w-3/4 md:w-1/4 px-8 py-2 text-white ${
                form.accept
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={submitApply}
            >
                {lang === "th" ? "ส่งใบสมัคร" : "Apply"}
            </button>

        </div>
    </div>


    </section>
  );
}
