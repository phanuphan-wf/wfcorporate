import BI from "./components/landingpage/B326/landingpage";

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
    path: "/b326",
    element: <BI />,
  },
  {
    path: "/b326/:cp",
    element: <BI />,
  },
];

export default AppLandingRoutes;
