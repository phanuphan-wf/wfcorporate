import Dashbord from "./components/solution/dashboard/dashboard";
import VisitorCheck from "./components/solution/frontdesk/visitorcheck/visitorcheck";
import Redemption from "./components/solution/frontdesk/redemption/redemption";
import VisitorData from "./components/solution/frontdesk/visitordata/visdata";
import ExhibitorBadge from "./components/solution/frontdesk/exhibitorBadge/exhibitorBadge";
import BuyerReport from "./components/solution/Report/buyerReport";
import ContractReceive from "./components/solution/preexhibition/contractReceive";
import AddNewCus from "./components/solution/datawarehouse/addNewCus";
import AddNewSign from "./components/solution/datawarehouse/addNewSign";
import AddNewProduct from "./components/solution/datawarehouse/addNewProduct";
import EditCustomer from "./components/solution/datawarehouse/editCus";
import CustomerHistoryData from "./components/solution/datawarehouse/customerHistoryData/customerHistoryData";
import VisitorSurvey from "./components/solution/frontdesk/survey/survey";
import ContractPrint from "./components/solution/preexhibition/contractPrint/contractPrint";
import CreateExhibition from "./components/solution/datawarehouse/createExhibition/createExhibition";
import SmsNumber from "./components/solution/datawarehouse/sms/smsNumber";
import CreateBooth from "./components/solution/datawarehouse/createBooth/createBooth";
import CreditList from "./components/solution/datawarehouse/creditterm/creditlist";
import Herobanner from "./components/solution/datawarehouse/Information/herobanner";
import HighlightEx from "./components/solution/datawarehouse/Information/highlight";

import { path } from "d3";

const AppProtectRoute = [
  {
    path: "dashboard",
    element: <Dashbord />,
  },
  {
    path: "frontdesk/visitorcheck",
    element: <VisitorCheck />,
  },
  {
    path: "frontdesk/redemption",
    element: <Redemption />,
  },
  {
    path: "frontdesk/visitordata",
    element: <VisitorData />,
  },
  {
    path: "frontdesk/badgereceiving",
    element: <ExhibitorBadge />,
  },
  {
    path: "frontdesk/survey",
    element: <VisitorSurvey />,
  },
  {
    path: "inside/report/buyerReport",
    element: <BuyerReport />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 2, acc: 1 },
      { dept: 2, acc: 2 },
    ],
  },
  {
    path: "preexhibition/contractreceive",
    element: <ContractReceive />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 3, acc: 1 },
      { dept: 6, acc: 1 },
      { dept: 1, acc: 2 },
      { dept: 3, acc: 2 },
      { dept: 6, acc: 2 },
    ],
  },
  {
    path: "preexhibition/contractprint",
    element: <ContractPrint />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 3, acc: 1 },
      { dept: 1, acc: 2 },
      { dept: 3, acc: 2 },
    ],
  },
  {
    path: "datawarehouse/addnewcustomer",
    element: <AddNewCus />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 3, acc: 1 },
      { dept: 6, acc: 1 },
      { dept: 1, acc: 2 },
      { dept: 3, acc: 2 },
      { dept: 6, acc: 2 },
    ],
  },
  {
    path: "datawarehouse/addnewsign/:cid",
    element: <AddNewSign />,
  },
  {
    path: "datawarehouse/addnewproduct/:cid",
    element: <AddNewProduct />,
  },
  {
    path: "datawarehouse/editcustomer/:cid",
    element: <EditCustomer />,
  },
  {
    path: "datawarehouse/editcustomer/:cid",
    element: <EditCustomer />,
  },
  {
    path: "datawarehouse/customerhistorydata",
    element: <CustomerHistoryData />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 2, acc: 1 },
      { dept: 3, acc: 1 },
      { dept: 6, acc: 1 },
      { dept: 1, acc: 2 },
      { dept: 2, acc: 2 },
      { dept: 3, acc: 2 },
      { dept: 6, acc: 2 },
    ],
  },
  {
    path: "datawarehouse/createexhibition",
    element: <CreateExhibition />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 3, acc: 1 },
      { dept: 6, acc: 1 },
      { dept: 1, acc: 2 },
      { dept: 3, acc: 2 },
      { dept: 6, acc: 2 },
    ],
  },
  {
    path: "datawarehouse/createbooth",
    element: <CreateBooth />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 3, acc: 1 },
      { dept: 6, acc: 1 },
      { dept: 1, acc: 2 },
      { dept: 3, acc: 2 },
      { dept: 6, acc: 2 },
    ],
  },
  {
    path: "datawarehouse/sms",
    element: <SmsNumber />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 3, acc: 1 },
      { dept: 3, acc: 2 },
    ],
  },
  {
    path: "datawarehouse/creditlist",
    element: <CreditList />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 3, acc: 1 },
      { dept: 3, acc: 2 },
      { dept: 6, acc: 1 },
    ],
  },

  {
    path: "datawarehouse/herobanner",
    element:<Herobanner />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 3, acc: 1 },     
    ],
  },

  {
    path: "datawarehouse/highlightEx",
    element:<HighlightEx />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 3, acc: 1 },     
    ],
  },

];

export default AppProtectRoute;
