import BI from "./components/landingpage/I526/landingpage";

import IM from "./components/landingpage/I426/landingpage";

const AppLandingRoutes = [
  {
    path: "/i426",
    element: <IM />,
  },
  {
    path: "/i426/:cp",
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
