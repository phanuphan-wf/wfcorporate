import { useState, useEffect } from "react";
import Axios from "axios";

export default function useHeader() {
  const [header, setHeader] = useState(null);

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_token;

  const getBearer = async () => {
    if (localStorage.getItem("user")) {
      let user = JSON.parse(window.localStorage.getItem("user"));

      var CryptoJS = require("crypto-js");

      let data = {
        name: user.name,
        EmID: CryptoJS.AES.decrypt(
          user.EmID,
          process.env.REACT_APP_KEY
        ).toString(CryptoJS.enc.Utf8),
        ALevel: Number(user.ALevel),
        Dept: Number(user.Dept),
        key: process.env.REACT_APP_jwtkey,
      };

      const res = await Axios.post(url + "/verify", data).then((res) => {
        setHeader(res.data);
      });
    }
  };

  useEffect(() => {
    getBearer();
  }, []);

  return header;
}
