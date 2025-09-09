import BI from "./components/landingpage/I525/landingpage";

import IM from "./components/landingpage/I425/landingpage";

const AppLandingRoutes = [
  {
    path: "/i425",
    element: <IM />,
  },
  {
    path: "/i425/:cp",
    element: <IM />,
  },
  {
    path: "/i525",
    element: <BI />,
  },
  {
    path: "/i525/:cp",
    element: <BI />,
  },
];

export default AppLandingRoutes;
