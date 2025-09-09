import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

export default function useToken() {
  const getToken = () => {
    //const tokenSting = localStorage.getItem('token');

    const userToken = localStorage.getItem("token");
    return userToken;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    var decode = jwt_decode(userToken);
    var data = JSON.stringify({
      name: decode.name,
      ALevel: decode.ALevel,
      Dept: decode.Dept,
      EmID: decode.EmID,
    });
    var CryptoJS = require("crypto-js");
    let arr = userToken.split(".");
    localStorage.setItem(
      "token",
      CryptoJS.AES.encrypt(
        JSON.stringify(arr[0]),
        process.env.REACT_APP_KEY
      ).toString()
    );
    localStorage.setItem("session1", arr[1]);
    localStorage.setItem(
      "session2",
      CryptoJS.AES.encrypt(
        JSON.stringify(arr[2]),
        process.env.REACT_APP_KEY
      ).toString()
    );
    localStorage.setItem(
      "_data",
      CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.REACT_APP_KEY
      ).toString()
    );
    //localStorage.setItem("expire", Date.now() + 1000 * 60 * 60); //set expire 60 min.
    setToken(userToken.token);
  };
  /*
  useEffect(() => {
    const expire = parseInt(localStorage.getItem("expire"));
    if (expire < Date.now()) {
      localStorage.clear();
      window.location.reload(false);
    }
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (token) {
        localStorage.setItem("expire", Date.now() + 1000 * 60 * 60); //set expire 60 min.
      } else {
        localStorage.removeItem("expire");
      }
    }

    window.addEventListener("mousemove", handleScroll);
    window.addEventListener("keydown", handleScroll);
    window.addEventListener("mousedown", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleScroll);
      window.removeEventListener("keydown", handleScroll);
      window.removeEventListener("mousedown", handleScroll);
    };
  }, []);

  useEffect(() => {
    setInterval(() => {
      const expire = parseInt(localStorage.getItem("expire"));
      if (expire < Date.now()) {
        localStorage.clear();
        clearInterval();
        alert("Your session is expired, Please re login to JBaby");
        window.location.reload(false);
      }
    }, 1000 * 30);
  });
*/
  return {
    setToken: saveToken,
    token,
  };
}
