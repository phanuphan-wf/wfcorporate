import Collection from "./components/solution/finance/collection/collection";
import CommReport from "./components/solution/finance/commReport/CommReport";
import CollectionHistory from "./components/solution/finance/collectionHistory/collectionHistory";
import Cheque from "./components/solution/finance/chequeReport/report";
import Receiving from "./components/solution/finance/receivingReport/report";
import CollectionReport from "./components/solution/finance/collectionReport/report";

const AppRouteFinance = [
  {
    path: "finance/collection",
    element: <Collection />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 6, acc: 1 },
    ],
  },
  {
    path: "finance/commissionreport",
    element: <CommReport />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 6, acc: 1 },
    ],
  },
  {
    path: "finance/collectionhistory",
    element: <CollectionHistory />,
  },
  {
    path: "finance/chequereport",
    element: <Cheque />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 6, acc: 1 },
    ],
  },
  {
    path: "finance/receivingreport",
    element: <Receiving />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 6, acc: 1 },
    ],
  },
  {
    path: "finance/collectionreport",
    element: <CollectionReport />,
    show: [
      { dept: 1, acc: 1 },
      { dept: 6, acc: 1 },
    ],
  },
];

export default AppRouteFinance;
