import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import CookieAccept from "./cookieaccept";

export default function CookieConsent() {
  const [cookies, setCookie, , updateCookies] = useCookies(["accept"]);

  useEffect(() => {
    // Refresh after sleep/backgrounding, including when the cookie expires.
    const refresh = () => updateCookies();
    const timer = window.setInterval(refresh, 60000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    refresh();
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [updateCookies]);

  const accept = () => {
    setCookie("accept", true, {
      path: "/",
      expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      sameSite: "lax",
    });
  };

  return cookies.accept === true || cookies.accept === "true"
    ? null
    : <CookieAccept accept={accept} />;
}
