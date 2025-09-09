import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";

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
import { useLocalStorage } from "./components/hook/useLocalStorage";

export default function App(props) {
  const version = process.env.REACT_APP_VERSION;

  const [cookies, setCookie, removeCookie] = useCookies([]);
  const cVersion = cookies.x_client_version;

  useEffect(() => {
    document.title = "Thailand's Leading Consumer Show Organizer | World Fair";
    //console.log(version);
  }, []);

  useEffect(() => {
    if ("caches" in window) {
      if (cVersion !== version) {
        caches.keys().then((names) => {
          // Delete all the cache files
          names.forEach((name) => {
            caches.delete(name);
          });
        });
        setCookie("x_client_version", version);
        window.location.reload(true);
      }
    }
  }, [cookies]);

  TagManager.initialize({ gtmId: "GTM-TNXV5QG" });
  TagManager.initialize({ gtmId: "GTM-KNX9WC4" });
  TagManager.initialize({ gtmId: "GTM-WF82RCBH" });

  return (
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
      <Route path="/solution" element={<ProtectedRoute />}>
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
  );
}
