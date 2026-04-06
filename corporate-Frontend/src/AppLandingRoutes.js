import BI from "./components/landingpage/B126/landingpage";

import IM from "./components/landingpage/B226/landingpage";

const AppLandingRoutes = [
  {
    path: "/b226",
    element: <IM />,
  },
  {
    path: "/b226/:cp",
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
