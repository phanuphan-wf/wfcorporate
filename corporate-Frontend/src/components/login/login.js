import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useAuth } from "../hook/useAuth";
import ModalOtp from "./ModalOtp";
import ModalChangePassword from "./modalChangePw";
import CryptoJS from "crypto-js";

import logo from "../img/logo-wf.png";

export default function Login(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_admin;

  const initData = { User: "", Password: "" };
  const [data, setData] = useState(initData);
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState("");

  const [verify, setVerify] = useState(false);

  const { login } = useAuth();

  const finishLogin = (token) => login({
    name: token.name,
    EmID: CryptoJS.AES.encrypt(token.emID, process.env.REACT_APP_KEY).toString(),
    ALevel: token.aLevel, Dept: token.dept, accessToken: token.accessToken,
    sessionStartedAt: token.sessionStartedAt, sessionPolicy: token.sessionPolicy,
  });

  const requestError = (error) => setError(error.response?.data?.message ||
    (error.response?.status === 429 ? "ทำรายการบ่อยเกินไป กรุณารอสักครู่" : "ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่"));

  async function onSubmit(event) {
    event.preventDefault();
    if (verify || challenge) return;
    setVerify(true); setError("");
    try {
      const result = await Axios.post(url + "/verify", data);
      if (result.status === 204) setError("Username หรือ Password ไม่ถูกต้อง หรือไม่มีสิทธิ์เข้าใช้งาน");
      else if (result.data.code === 300) setModalChangeOpen(true);
      else if (result.data.code === 206) setChallenge(result.data);
      else setError("รูปแบบการตอบกลับไม่ถูกต้อง กรุณาติดต่อผู้ดูแลระบบ");
    } catch (error) { requestError(error); }
    finally { setVerify(false); }
  }

  async function verifyOtp(otp) {
    if (verify) return;
    setVerify(true); setError("");
    try {
      const result = await Axios.post(url + "/otp/verify", { challengeId: challenge.challengeId, otp });
      if (result.data.code === 202 && result.data.accessToken) await finishLogin(result.data);
      else setError("ยืนยัน OTP ไม่สำเร็จ กรุณาลองใหม่");
    } catch (error) { requestError(error); }
    finally { setVerify(false); }
  }

  async function resendOtp() {
    if (verify) return;
    setVerify(true); setError("");
    try {
      const result = await Axios.post(url + "/otp/resend", { challengeId: challenge.challengeId });
      setChallenge(result.data);
    } catch (error) { requestError(error); }
    finally { setVerify(false); }
  }

  useEffect(() => {
    document.title = "World Fair Solution Login";
  }, []);

  useEffect(() => {
    //console.log(data);
  }, [data]);

  const [modalChangeOpen, setModalChangeOpen] = useState(false);

  const closeModalChangePassword = () => {
    setModalChangeOpen(false);
  };

  /*

  useEffect(() => {
    console.log(data.Password);
  }, [data.Password]);

  const [userdata, setUserData] = useState({});
  const changePassword = async () => {
    const res = await Axios.get(url + "/getuser").then((res) => {
      let data = res.data;
      data.map((user) => {
        //console.log(user.userID);
        changePasswordToMD5(user);
      });
    });
  };

  useEffect(() => {}, [userdata]);

  const changePasswordToMD5 = async (id) => {
    const Crypto = require("crypto-js");
    const data = {
      User: id.user,
      Password: id.password,
      NewPassword: Crypto.MD5(id.password).toString(),
    };
    const res = await Axios.post(url + "/changepw", data);
  };

  */

  return (
    <div id="login-form">
      <div className="md:container">
        <div className="flex justify-center sm:items-center h-screen">
          <div
            className={`w-full sm:w-3/4 md:w-3/5 lg:w-[40%] sm:shadow-xl shadow-black py-10`}
          >
            <div className="text-center mb-5">
              <img
                src={logo}
                alt="worldfair logo"
                id={"logo-wf"}
                className="w-1/3 block mx-auto mb-4"
              />
              <h2 className="text-2xl font-medium">World Fair Solution</h2>
              <p>for authorized person only</p>
            </div>
            <div className={`w-full`}>
              <form onSubmit={onSubmit}>
                <div className="mb-4 w-3/4 mx-auto">
                  <label htmlFor="username" className="block">
                    Username:
                  </label>
                  <input
                    id="username"
                    required autoComplete="username" disabled={verify || !!challenge}
                    type="text"
                    onChange={(e) => setData({ ...data, User: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div className="mb-4 w-3/4 mx-auto">
                  <label htmlFor="password" className="block">
                    Password:
                  </label>
                  <input
                    id="password"
                    required autoComplete="current-password" disabled={verify || !!challenge}
                    type="password"
                    onChange={(e) =>
                      setData({
                        ...data,
                        Password: CryptoJS.MD5(e.target.value).toString(),
                      })
                    }
                    className="w-full"
                  />
                </div>
                {error && !challenge && <p role="alert" className="w-3/4 mx-auto text-red-600">{error}</p>}
                <button
                  type="submit" disabled={verify || !!challenge}
                  id={"btnlogin"}
                  className="w-3/4 mx-auto block my-5 btn-primary"
                >
                  {verify ? "Verifying..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={`${verify && !challenge ? "" : "hidden"}`}>
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="flex justify-center items-center">
            <div className="text-center mt-2">Verifying...</div>
          </div>
        </div>
      </div>
      <ModalOtp challenge={challenge} busy={verify} error={error} onVerify={verifyOtp}
        onResend={resendOtp} onCancel={() => { setChallenge(null); setError(""); }} />
      <ModalChangePassword
        show={modalChangeOpen}
        onHide={closeModalChangePassword}
        user={data}
      />
      {/*
      <div>
        <button className="btn-primary" onClick={changePassword}>
          change password to md5
        </button>
      </div>
                  */}
    </div>
  );
}
