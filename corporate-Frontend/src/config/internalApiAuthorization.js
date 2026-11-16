import Axios from "axios";

const internalControllers = new Set([
  "buyerreport",
  "coupon",
  "smsnumber",
  "customer",
  "contract",
  "contractprint",
  "customerhistory",
  "customerdata",
  "commreport",
  "collectionhistory",
  "collectionreport",
  "salesreport",
  "creport",
  "rreport",
  "creditterm",
  "servicesquota",
  "survey",
]);

const internalActions = {
  floorplancustomer: new Set(["postcustomer", "putcustomer", "deletecustomer"]),
  jobs: new Set([
    "postjob", "jobsselect", "jobslist", "updatejob",
    "getapplylist", "putwatch", "getapply",
  ]),
  webapp: new Set([
    "posthero", "heroshow", "heroselect", "posthilight",
    "hlshow", "hlselect", "postnextshow",
  ]),
};

export function attachInternalApiToken(config) {
  try {
    const apiBase = (process.env.REACT_APP_API_URI || "").replace(/\/$/, "");
    const apiRoot = new URL(apiBase + "/api/", window.location.href);
    const request = new URL(
      Axios.getUri({ baseURL: config.baseURL, url: config.url }),
      window.location.href
    );
    if (request.origin !== apiRoot.origin || !request.pathname.startsWith(apiRoot.pathname)) {
      return config;
    }

    const [controller, action] = request.pathname
      .slice(apiRoot.pathname.length)
      .toLowerCase()
      .split("/");
    if (!internalControllers.has(controller) && !internalActions[controller]?.has(action)) {
      return config;
    }

    const token = JSON.parse(window.localStorage.getItem("user"))?.accessToken;
    if (token) {
      config.headers.set("Authorization", "Bearer " + token, true);
    }
  } catch (error) {
    // Invalid URLs or unreadable local sessions can proceed without an added token.
    return config;
  }

  return config;
}
