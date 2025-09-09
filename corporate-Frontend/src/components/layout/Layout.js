import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

import NavMenu from "./NavMenu";
import Footer from "./Footer";
import CookieAccept from "./cookieaccept";

export default function Layout(props) {
  const [cookies, setCookie, removeCookie] = useCookies([]);

  const [consentShow, setConsentShow] = useState(true);

  useEffect(() => {
    if (cookies.accept) {
      setConsentShow(false);
    } else {
      setConsentShow(true);
    }
  }, [cookies]);

  const acceptCookie = () => {
    let date = new Date();
    date.setTime(date.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days from now
    setCookie("accept", true, { path: "/", expires: date });
    window.location.reload(true);
  };

  return (
    <div>
      <NavMenu />
      <Outlet />
      <Footer />
      {consentShow && <CookieAccept accept={acceptCookie} />}
    </div>
  );
}
