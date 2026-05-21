import BI from "./components/landingpage/B326/landingpage";

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
    path: "/b326",
    element: <BI />,
  },
  {
    path: "/b326/:cp",
    element: <BI />,
  },
];

export default AppLandingRoutes;
