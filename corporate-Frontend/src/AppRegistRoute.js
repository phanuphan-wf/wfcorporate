import RegistPage from "./components/registration/I625/registration";
import PreregistPage from "./components/registration/I625/preregistration";
import PostPage from "./components/registration/I625/postregister";

import RegistPage_dc from "./components/registration/B325/registration";
import PreregistPage_dc from "./components/registration/B325/preregistration";
import PostPage_dc from "./components/registration/B325/postregister";

import Exregist from "./components/exregist/exregist";
import Exqr from "./components/exregist/exqr";

import BuyerRegist from "./components/buyerregist/BuyerRegist";
import QRCode from "./components/buyerregist/QRCode";
import FormRegister from "./components/buyerregist/redeem/registration";

const AppRegistRoutes = [
  {
    path: "exregist",
    element: <Exregist />,
  },
  {
    path: "exqr",
    element: <Exqr />,
  },
  {
    path: "i625/preregistration",
    element: <PreregistPage />,
  },
  {
    path: "i625/preregistration/:cp",
    element: <PreregistPage />,
  },
  {
    path: "i625/registration",
    element: <RegistPage />,
  },
  {
    path: "i625/postregister/:res/:key",
    element: <PostPage />,
  },

  {
    path: "b325/preregistration",
    element: <PreregistPage_dc />,
  },
  {
    path: "b325/preregistration/:cp",
    element: <PreregistPage_dc />,
  },
  {
    path: "b325/registration",
    element: <RegistPage_dc />,
  },
  {
    path: "b325/postregister/:res/:key",
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
];

export default AppRegistRoutes;