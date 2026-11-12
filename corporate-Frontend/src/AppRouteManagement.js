import EmployeeList from "./components/solution/Employee/EmployeeList/employeelist";
import NewEmployee from "./components/solution/Employee/newEmployee/newemployee";
import EditEmployee from "./components/solution/Employee/editEmployee/editemployee";
import JobApplication from "./components/solution/Employee/Jobapplication/ApplyList";
import Jobform  from "./components/solution/Employee/Jobapplication/jobform";
import { Navigate } from "react-router-dom";
import { useAuth } from "./components/hook/useAuth";
import {
  canManageEmployees,
  employeeManagementAccess,
} from "./components/solution/Employee/employeePermissions";

function EmployeeManagementRoute({ children }) {
  const { user } = useAuth();

  if (!canManageEmployees(user)) {
    return <Navigate to="/solution/datawarehouse/employeelist" replace />;
  }

  return children;
}

const AppRouteManagement = [
  {
    path: "datawarehouse/employeelist",
    element: <EmployeeList />,
    show: "all",
  },
  {
    path: "management/newemployee",
    element: (
      <EmployeeManagementRoute>
        <NewEmployee />
      </EmployeeManagementRoute>
    ),
    show: employeeManagementAccess,
  },
  {
    path: "management/editemployee/:eid",
    element: (
      <EmployeeManagementRoute>
        <EditEmployee />
      </EmployeeManagementRoute>
    ),
    show: employeeManagementAccess,
  },
  {
    path: "management/jobapplication",
    element: <JobApplication />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 6, acc: 1 },
      { dept: 7, acc: 1 },
      { dept: 7, acc: 2 },
    ],
  },
  {
    path: "management/jobapplication/jobform/:id",
    element: <Jobform />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 6, acc: 1 },
      { dept: 7, acc: 1 },
      { dept: 7, acc: 2 },
    ],
  },
];

export default AppRouteManagement;
