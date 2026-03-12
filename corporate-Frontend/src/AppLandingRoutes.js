import BI from "./components/landingpage/B226/landingpage";

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
    path: "/b226",
    element: <BI />,
  },
  {
    path: "/b226/:cp",
    element: <BI />,
  },
];

export default AppLandingRoutes;
