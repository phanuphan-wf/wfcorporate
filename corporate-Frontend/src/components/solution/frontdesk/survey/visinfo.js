import React, { useContext, useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import { dataContext } from "./survey";

export default function VisitorInfo(props) {
  const { userC, qtvC, qProgramC, dataC, qmediaC } = useContext(dataContext);

  const [qtv, setQTV] = qtvC;
  const [qProgram, setQProgram] = qProgramC;
  const [data, setData] = dataC;
  const [qMedia, setQMedia] = qmediaC;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_svy;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [user, setUser] = userC;

  const userCheck = async (m) => {
    try {
      const res = await Axios.get(url + "/getName/" + m).then((res) => {
        if (res.status === 200) {
          setUser(res.data);
          document.getElementById("txtMobile").value = "";
        } else if (res.status === 204) {
          setUser({});
          alert("No user found");
        }
      });
    } catch (e) {
      if (e.response.status === 409) {
        alert("User have already submitted the survey");
      }
    }
  };

  useEffect(() => {
    if (user.id != undefined) {
      setQTV({ ...qtv, uid: user.id.toString() });
      setQProgram({ ...qProgram, uid: user.id.toString() });
      setData({ ...data, mobile: user.id.toString() });
      setQMedia({ ...qMedia, uid: user.id.toString() });
    } else {
      setQTV({ ...qtv, uid: "" });
      setQProgram({ ...qProgram, uid: "" });
      setData({ ...data, mobile: "" });
      setQMedia({ ...qMedia, uid: "" });
    }
  }, [user]);

  return (
    <section id="visitor-info">
      <div className=" w-full md:w-2/3">
        <div className="flex items-center gap-4 max-md:flex-wrap">
          <label htmlFor="mobile" className="md:text-lg">
            Visitor Mobile
          </label>
          <input
            type="text"
            placeholder="please enter visitor mobile"
            className="w-56 md:text-lg"
            id="txtMobile"
          />
          <button
            className="btn btn-primary md:text-lg px-3"
            onClick={() =>
              userCheck(document.getElementById("txtMobile").value)
            }
          >
            Check
          </button>
        </div>
        <div>
          <span className="text-lg text-red-500 md:text-lg">
            {user.name != undefined ? "คุณ" + user.name : ""}
          </span>
        </div>
      </div>
    </section>
  );
}
