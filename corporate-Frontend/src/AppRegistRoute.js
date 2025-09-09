import RegistPage from "./components/registration/I425/registration";
import PreregistPage from "./components/registration/I425/preregistration";
import PostPage from "./components/registration/I425/postregister";

import RegistPage_dc from "./components/registration/I525/registration";
import PreregistPage_dc from "./components/registration/I525/preregistration";
import PostPage_dc from "./components/registration/I525/postregister";

import Exregist from "./components/exregist/exregist";
import Exqr from "./components/exregist/exqr";
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
    path: "i425/preregistration",
    element: <PreregistPage />,
  },
  {
    path: "i425/preregistration/:cp",
    element: <PreregistPage />,
  },
  {
    path: "i425/registration",
    element: <RegistPage />,
  },
  {
    path: "i425/postregister/:res/:key",
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
];

export default AppRegistRoutes;
