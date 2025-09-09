import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useAuth } from "../hook/useAuth";
import ModalChangePassword from "./modalChangePw";
import CryptoJS from "crypto-js";

import logo from "../img/logo-wf.png";

export default function Login(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_admin;

  const initData = { User: "", Password: "" };
  const [data, setData] = useState(initData);
  const navigate = useNavigate();

  const [verify, setVerify] = useState(false);

  const { login } = useAuth();

  async function getLogin() {
    const res = await Axios.post(url + "/verify", data).then((result) => {
      setVerify(false);
      if (result.status == 204) {
        alert(
          "UserName or Password may not right, You do not have right to access to solution"
        );
      } else if (result.data.code === 300) {
        alert("You have requested to change password");
        setModalChangeOpen(true);
      } else if (result.data.code === 202) {
        let token = result.data;
        login({
          name: token.name,
          EmID: require("crypto-js")
            .AES.encrypt(token.emID, process.env.REACT_APP_KEY)
            .toString(),
          ALevel: token.aLevel,
          Dept: token.dept,
        });
      }
    });
  }

  function onSubmit() {
    setVerify(true);
    getLogin();
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
              <form>
                <div className="mb-4 w-3/4 mx-auto">
                  <label for="username" className="block">
                    Username:
                  </label>
                  <input
                    id="username"
                    type="text"
                    onChange={(e) => setData({ ...data, User: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div className="mb-4 w-3/4 mx-auto">
                  <label for="password" className="block">
                    Password:
                  </label>
                  <input
                    id="password"
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
                <div
                  id={"btnlogin"}
                  onClick={onSubmit}
                  className="w-3/4 mx-auto block my-5 btn-primary"
                >
                  Login
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={`${verify ? "" : "hidden"}`}>
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="flex justify-center items-center">
            <div className="text-center mt-2">Verifying...</div>
          </div>
        </div>
      </div>
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
