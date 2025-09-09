import Home from "./components/home/home";
import Calendar from "./components/calendar/calendar";
import News from "./components/News/news";
import Joinus from "./components/joinus/joinus";
import Reservation from "./components/reservation/reservation";
import Aboutus from "./components/ aboutus/aboutus";
import OurServices from "./components/ourservices/ourservices";

const AppRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/calendar",
    element: <Calendar />,
  },
  {
    path: "/news",
    element: <News />,
  },
  {
    path: "/joinus",
    element: <Joinus />,
  },
  {
    path: "/reservation",
    element: <Reservation />,
  },
  {
    path: "/reservation/:exid",
    element: <Reservation />,
  },
  {
    path: "/aboutus",
    element: <Aboutus />,
  },
  {
    path: "/ourservices",
    element: <OurServices />,
  },
];

export default AppRoutes;
