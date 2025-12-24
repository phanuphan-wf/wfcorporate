import BI from "./components/landingpage/B325/landingpage";

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
    path: "/b325",
    element: <BI />,
  },
  {
    path: "/b325/:cp",
    element: <BI />,
  },
];

export default AppLandingRoutes;
