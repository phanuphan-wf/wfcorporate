import BI from "./components/landingpage/I526/landingpage";

import IM from "./components/landingpage/B526/landingpage";

const AppLandingRoutes = [
  {
    path: "/b526",
    element: <IM />,
  },
  {
    path: "/b526/:cp",
    element: <IM />,
  },
  {
    path: "/i526",
    element: <BI />,
  },
  {
    path: "/i526/:cp",
    element: <BI />,
  },
];

export default AppLandingRoutes;
