import React, { useEffect, useState } from "react";

import { useAuth } from "../../hook/useAuth";

import NextExhibition from "./nextExhibition";

export default function Dashbord(props) {
  const { logout } = useAuth();

  const [user, setUser] = useState({});

  useEffect(() => {
    let user = JSON.parse(window.localStorage.getItem("user"));
    setUser({ name: user.name });
  }, []);

  return (
    <div>
      <div className="text-3xl">Dashbord</div>
      <div className="my-5">
        {user.name != undefined && (
          <div className="px-5">
            <div className="text-2xl font-medium">สวัสดี</div>
            <div>{"คุณ" + user.name}</div>
          </div>
        )}
      </div>
      <NextExhibition />
      <div className="btn-primary mt-[100px]" onClick={logout}>
        Logout
      </div>
    </div>
  );
}
