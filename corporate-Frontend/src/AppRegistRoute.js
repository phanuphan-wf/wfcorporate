import RegistPage from "./components/registration/I625/registration";
import PreregistPage from "./components/registration/I625/preregistration";
import PostPage from "./components/registration/I625/postregister";

import RegistPage_dc from "./components/registration/I525/registration";
import PreregistPage_dc from "./components/registration/I525/preregistration";
import PostPage_dc from "./components/registration/I525/postregister";

import Exregist from "./components/exregist/exregist";
import Exqr from "./components/exregist/exqr";

import BuyerRegist from "./components/buyerregist/BuyerRegist";
import QRCode from "./components/buyerregist/QRCode";
import FormRegister from "./components/buyerregist/redeem/preregistration";



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
    path: "i525/preregistration",
    element: <PreregistPage_dc />,
  },
  {
    path: "i525/preregistration/:cp",
    element: <PreregistPage_dc />,
  },
  {
    path: "i525/registration",
    element: <RegistPage_dc />,
  },
  {
    path: "i525/postregister/:res/:key",
    element: <PostPage_dc />,
  },
  {
    path:"buyerregist",
    element:<BuyerRegist />,
  },

  {
    path: "Qrcode",
    element: <QRCode />,
  },
  
  {
    path: "FormRegister",
    element: <FormRegister />,
  },

];

export default AppRegistRoutes;
