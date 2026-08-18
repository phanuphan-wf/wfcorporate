import BI from "./components/landingpage/B426/landingpage";

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
    path: "/b426",
    element: <BI />,
  },
  {
    path: "/b426/:cp",
    element: <BI />,
  },
];

export default AppLandingRoutes;
