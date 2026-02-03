import BI from "./components/landingpage/B126/landingpage";

import IM from "./components/landingpage/I126/landingpage";

const AppLandingRoutes = [
  {
    path: "/i126",
    element: <IM />,
  },
  {
    path: "/i126/:cp",
    element: <IM />,
  },
  {
    path: "/b126",
    element: <BI />,
  },
  {
    path: "/b126/:cp",
    element: <BI />,
  },
];

export default AppLandingRoutes;
