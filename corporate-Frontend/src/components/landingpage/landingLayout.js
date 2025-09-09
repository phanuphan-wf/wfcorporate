import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../layout/Footer";

export default function LandingLayout(props) {
  return (
    <div>
      <Outlet />
      <Footer show={1} />
    </div>
  );
}
