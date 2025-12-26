const NavItems = [
  {
    title: "Dashboard",
    url: "/solution/dashboard",
    show: "all",
  },
  {
    title: "Front Desk",
    url: "",
    show: "all",
    sub: [
      {
        title: "Visitor Check",
        url: "/solution/frontdesk/visitorcheck",
        show: "all",
      },
      {
        title: "Redemption",
        url: "/solution/frontdesk/redemption",
        show: "all",
      },
      {
        title: "Badge Receiving",
        url: "/solution/frontdesk/badgereceiving",
        show: "all",
      },
      {
        title: "Services Receiving",
        url: "/solution/frontdesk/servicereceive",
        show: "all",
      },
      {
        title: "Visitor Survey",
        url: "/solution/frontdesk/survey",
        show: "all",
      },
    ],
  },
  {
    title: "Pre Exhibition",
    url: "",
    show: "all",
    sub: [
      {
        title: "Contract Receiving",
        url: "/solution/preexhibition/contractreceive",
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
        title: "Contract Print",
        url: "/solution/preexhibition/contractprint",
        show: [
          { dept: 1, acc: 1 },
          { dept: 3, acc: 1 },
          { dept: 1, acc: 2 },
          { dept: 3, acc: 2 },
        ],
      },
      {
        title: "Services Quota",
        url: "/solution/preexhibition/servicequota",
        show: [
          { dept: 1, acc: 1 },
          { dept: 3, acc: 1 },
          { dept: 3, acc: 2 },
        ],
      },
    ],
  },
  {
    title: "Finance",
    url: "",
    show: [
      { dept: 1, acc: 1 },
      { dept: 6, acc: 1 },
      { dept: 6, acc: 2 },
    ],
    sub: [
      {
        title: "Collection Record",
        url: "/solution/finance/collection",
        show: [
          { dept: 1, acc: 1 },
          { dept: 6, acc: 1 },
        ],
      },
      {
        title: "Collection History",
        url: "/solution/finance/collectionhistory",
        show: "all",
      },
      {
        title: "Commission Report",
        url: "/solution/finance/commissionreport",
        show: [
          { dept: 1, acc: 1 },
          { dept: 6, acc: 1 },
        ],
      },
      {
        title: "Cheque Report",
        url: "/solution/finance/chequereport",
        show: [
          { dept: 1, acc: 1 },
          { dept: 6, acc: 1 },
        ],
      },
      {
        title: "Receiving Report",
        url: "/solution/finance/receivingreport",
        show: [
          { dept: 1, acc: 1 },
          { dept: 6, acc: 1 },
        ],
      },
      {
        title: "Collection Report",
        url: "/solution/finance/collectionreport",
        show: [
          { dept: 1, acc: 1 },
          { dept: 6, acc: 1 },
        ],
      },
    ],
  },
  {
    title: "Report",
    url: "",
    show: [
      { dept: 1, acc: 1 },
      { dept: 2, acc: 1 },
      { dept: 2, acc: 2 },
      { dept: 3, acc: 1 },
      { dept: 3, acc: 2 },
    ],
    sub: [
      {
        title: "Buyer Report",
        url: "/solution/inside/report/buyerReport",
        show: [
          { dept: 1, acc: 1 },
          { dept: 2, acc: 1 },
          { dept: 2, acc: 2 },
        ],
      },
      {
        title: "Visitor Data",
        url: "/solution/frontdesk/visitordata",
        show: "all",
      },
    ],
  },
  {
    title: "Data Warehouse",
    url: "",
    show: "all",
    sub: [
      {
        title: "Add New Customer",
        url: "/solution/datawarehouse/addnewcustomer",
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
        title: "Customer History Data",
        url: "/solution/datawarehouse/customerhistorydata",
        show: [
          { dept: 1, acc: 1 },
          { dept: 2, acc: 1 },
          { dept: 3, acc: 1 },
          { dept: 6, acc: 1 },
          { dept: 1, acc: 2 },
          { dept: 3, acc: 2 },
          { dept: 6, acc: 2 },
        ],
      },
      {
        title: "Create Exhibition",
        url: "/solution/datawarehouse/createexhibition",
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
        title: "Create Booth",
        url: "/solution/datawarehouse/createbooth",
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
        title: "Credit List",
        url: "/solution/datawarehouse/creditlist",
        show: [
          { dept: 1, acc: 1 },
          { dept: 3, acc: 1 },
          { dept: 6, acc: 1 },
          { dept: 3, acc: 2 },
        ],
      },
      {
        title: "SMS Number",
        url: "/solution/datawarehouse/sms",
        show: [
          { dept: 1, acc: 1 },
          { dept: 3, acc: 1 },
          { dept: 3, acc: 2 },
        ],
      },
      {
        title: "Employee List",
        url: "/solution/datawarehouse/employeelist",
        show: "all",
      },
    ],
  },
  {
    title: "Management",
    url: "",
    show: [
      { dept: 1, acc: 1 },
      { dept: 6, acc: 1 },
      { dept: 7, acc: 1 },
      { dept: 7, acc: 2 },
    ],
    sub: [
      {
        title: "New Employee",
        url: "/solution/management/newemployee",
        show: [
          { dept: 1, acc: 1 },
          { dept: 6, acc: 1 },
          { dept: 7, acc: 1 },
          { dept: 7, acc: 2 },
        ],
      },
    ],
  },
];

export default NavItems;
