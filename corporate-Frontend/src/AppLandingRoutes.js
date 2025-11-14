import BI from "./components/landingpage/B325/landingpage";

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
    path: "/b325",
    element: <BI />,
  },
  {
    path: "/b325/:cp",
    element: <BI />,
  },
];

export default AppLandingRoutes;
