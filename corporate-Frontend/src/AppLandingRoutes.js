import BI from "./components/landingpage/B426/landingpage";

import IM from "./components/landingpage/I226/landingpage";

const AppLandingRoutes = [
  {
    path: "/i226",
    element: <IM />,
  },
  {
    path: "/i226/:cp",
    element: <IM />,
  },
  {
    path: "/b426",
    element: <BI />,
  },
  {
    path: "/b426/:cp",
    element: <BI />,
  },
];

export default AppLandingRoutes;
