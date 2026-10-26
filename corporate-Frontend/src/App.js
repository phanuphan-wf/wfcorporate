import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./components/hook/useAuth";
import UserNavMenu from "./components/login/NavMenu";
import { useCookies } from "react-cookie";
import CookieConsent from "./components/layout/CookieConsent";
import { startVersionMonitor } from "./config/versionMonitor";

import "./custom.css";

import AppRoutes from "./AppRoutes";
import Layout from "./components/layout/Layout";
import Login from "./components/login/login";
import ProtectedRoute from "./components/login/ProtectedRoute";
import AppProtectRoute from "./AppProtectRoute";
import LandingLayout from "./components/landingpage/landingLayout";
import AppLandingRoutes from "./AppLandingRoutes";
import AppRegistRoutes from "./AppRegistRoute";
import AppRouteFinance from "./AppRouteFinance";
import AppRouteManagement from "./AppRouteManagement";

import TagManager from "react-gtm-module";

export default function App(props) {
  const version = process.env.REACT_APP_VERSION;
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [solutionMenuOpen, setSolutionMenuOpen] = useState(false);
  const isSolutionPage = pathname === "/solution" || pathname.startsWith("/solution/");

  const [, setCookie] = useCookies(["x_client_version"]);

  useEffect(() => {
    document.title = "Thailand's Leading Consumer Show Organizer | World Fair";
    //console.log(version);
  }, []);

  useEffect(() => {
    // Record the version actually running; another tab's cookie is not its version.
    if (version) setCookie("x_client_version", version, { path: "/", sameSite: "lax" });
    return startVersionMonitor(version);
  }, [version, setCookie]);

  TagManager.initialize({ gtmId: "GTM-TNXV5QG" });
  TagManager.initialize({ gtmId: "GTM-KNX9WC4" });
  TagManager.initialize({ gtmId: "GTM-WJDXZ9PC" }); //venuee
  TagManager.initialize({ gtmId: "GTM-WF82RCBH" }); //BrandStrom

  return (
    <>
      {user && <UserNavMenu menu={setSolutionMenuOpen} />}
      <div className={user && !isSolutionPage ? "pt-[75px] print:pt-0" : ""}>
    <Routes>
      <Route element={<Layout />}>
        {AppRoutes.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route element={<LandingLayout />}>
        {AppLandingRoutes.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route path="/">
        {AppRegistRoutes.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route exact path="/login" element={<Login />} />
      <Route path="/solution" element={<ProtectedRoute menuOpen={solutionMenuOpen} />}>
        {AppProtectRoute.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
        {AppRouteFinance.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
        {AppRouteManagement.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
      </div>
      {!isSolutionPage && <CookieConsent />}
    </>
  );
}
