import BI from "./components/landingpage/I525/landingpage";

import IM from "./components/landingpage/I625/landingpage";

const AppLandingRoutes = [
  {
    path: "/i625",
    element: <IM />,
  },
  {
    path: "/i625/:cp",
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
