import RegistPage from "./components/registration/B526/registration";
import PreregistPage from "./components/registration/B526/preregistration";
import PostPage from "./components/registration/B526/postregister";

import RegistPage_dc from "./components/registration/I526/registration";
import PreregistPage_dc from "./components/registration/I526/preregistration";
import PostPage_dc from "./components/registration/I526/postregister";

import Exregist from "./components/exregist/exregist";
import Exqr from "./components/exregist/exqr";

import BuyerRegist from "./components/buyerregist/BuyerRegist";
import QRCode from "./components/buyerregist/QRCode";
import FormRegister from "./components/buyerregist/redeem/registration";
import PostRedeem from "./components/buyerregist/redeem/postregister";
import Floorplan from "./components/floorplan/floorplan";

import HomeMegashow from "./components/HomeMegaShow/index";
import Submit from "./components/HomeMegaShow/submit";
import { path } from "d3";

const AppRegistRoutes = [
  {
    path: "exregist",
    element: <Exregist />,
  },
  {
    path: "exregist/:code",
    element: <Exregist />,
  },
  {
    path: "exqr",
    element: <Exqr />,
  },
  {
    path: "b526/preregistration",
    element: <PreregistPage />,
  },
  {
    path: "b526/preregistration/:cp",
    element: <PreregistPage />,
  },
  {
    path: "b526/registration",
    element: <RegistPage />,
  },
  {
    path: "b526/postregister/:res/:key",
    element: <PostPage />,
  },

  {
    path: "i526/preregistration",
    element: <PreregistPage_dc />,
  },
  {
    path: "i526/preregistration/:cp",
    element: <PreregistPage_dc />,
  },
  {
    path: "i526/registration",
    element: <RegistPage_dc />,
  },
  {
    path: "i526/postregister/:res/:key",
    element: <PostPage_dc />,
  },

  {
    path: "redeem",
    element: <BuyerRegist />,
  },

  {
    path: "redeem/:qr",
    element: <QRCode />,
  },

  {
    path: "redeem/form",
    element: <FormRegister />,
  },
  {
    path: "redeem/postregister",
    element: <PostRedeem />,
  },
  {
    path: "floorplan/",
    element: <Floorplan />,
  },
  {
    path: "floorplan/:pos",
    element: <Floorplan />,
  },

  {
    path: "homemegashow",
    element: <HomeMegashow />,
  },

  {
    path: "homemegashow/:cp",
    element: <HomeMegashow />,
  },
  {
    path: "homemegashow/submit",
    element: <Submit />,
  },
];

export default AppRegistRoutes;
