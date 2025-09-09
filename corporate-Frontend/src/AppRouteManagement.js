import EmployeeList from "./components/solution/Employee/EmployeeList/employeelist";
import NewEmployee from "./components/solution/Employee/newEmployee/newemployee";
import EditEmployee from "./components/solution/Employee/editEmployee/editemployee";

const AppRouteManagement = [
  {
    path: "datawarehouse/employeelist",
    element: <EmployeeList />,
    show: "all",
  },
  {
    path: "management/newemployee",
    element: <NewEmployee />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 6, acc: 1 },
      { dept: 7, acc: 1 },
      { dept: 7, acc: 2 },
    ],
  },
  {
    path: "management/editemployee/:eid",
    element: <EditEmployee />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 6, acc: 1 },
      { dept: 7, acc: 1 },
      { dept: 7, acc: 2 },
    ],
  },
];

export default AppRouteManagement;
