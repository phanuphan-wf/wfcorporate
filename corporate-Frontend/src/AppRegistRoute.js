import RegistPage from "./components/registration/I126/registration";
import PreregistPage from "./components/registration/I126/preregistration";
import PostPage from "./components/registration/I126/postregister";

import RegistPage_dc from "./components/registration/B226/registration";
import PreregistPage_dc from "./components/registration/B226/preregistration";
import PostPage_dc from "./components/registration/B226/postregister";

import Exregist from "./components/exregist/exregist";
import Exqr from "./components/exregist/exqr";

import BuyerRegist from "./components/buyerregist/BuyerRegist";
import QRCode from "./components/buyerregist/QRCode";
import FormRegister from "./components/buyerregist/redeem/registration";
import PostRedeem from "./components/buyerregist/redeem/postregister";
import Floorplan from "./components/floorplan/floorplan";

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
    path: "i126/preregistration",
    element: <PreregistPage />,
  },
  {
    path: "i126/preregistration/:cp",
    element: <PreregistPage />,
  },
  {
    path: "i126/registration",
    element: <RegistPage />,
  },
  {
    path: "i126/postregister/:res/:key",
    element: <PostPage />,
  },

  {
    path: "b226/preregistration",
    element: <PreregistPage_dc />,
  },
  {
    path: "b226/preregistration/:cp",
    element: <PreregistPage_dc />,
  },
  {
    path: "b226/registration",
    element: <RegistPage_dc />,
  },
  {
    path: "b226/postregister/:res/:key",
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
];

export default AppRegistRoutes;
