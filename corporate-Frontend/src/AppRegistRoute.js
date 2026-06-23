import RegistPage from "./components/registration/I226/registration";
import PreregistPage from "./components/registration/I226/preregistration";
import PostPage from "./components/registration/I226/postregister";

import RegistPage_dc from "./components/registration/B426/registration";
import PreregistPage_dc from "./components/registration/B426/preregistration";
import PostPage_dc from "./components/registration/B426/postregister";

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
    path: "i226/preregistration",
    element: <PreregistPage />,
  },
  {
    path: "i226/preregistration/:cp",
    element: <PreregistPage />,
  },
  {
    path: "i226/registration",
    element: <RegistPage />,
  },
  {
    path: "i226/postregister/:res/:key",
    element: <PostPage />,
  },

  {
    path: "b426/preregistration",
    element: <PreregistPage_dc />,
  },
  {
    path: "b426/preregistration/:cp",
    element: <PreregistPage_dc />,
  },
  {
    path: "b426/registration",
    element: <RegistPage_dc />,
  },
  {
    path: "b426/postregister/:res/:key",
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
