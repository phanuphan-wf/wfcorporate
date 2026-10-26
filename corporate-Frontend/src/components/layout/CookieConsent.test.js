import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Cookies, CookiesProvider } from "react-cookie";
import CookieConsent from "./CookieConsent";

let host, root, cookies;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  document.cookie = "accept=; Max-Age=0; path=/";
  cookies = new Cookies();
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  document.cookie = "accept=; Max-Age=0; path=/";
});
const render = () => act(() => root.render(<CookiesProvider cookies={cookies}><CookieConsent /></CookiesProvider>));

test("new visitors can consent and the banner closes without reloading", () => {
  const set = jest.spyOn(cookies, "set");
  render();
  const before = Date.now();
  act(() => host.querySelector("button").click());
  expect(host.querySelector("#cookie-consent")).toBeNull();
  const [name, value, options] = set.mock.calls[0];
  expect([name, value, options.path]).toEqual(["accept", true, "/"]);
  expect(options.expires.getTime()).toBeGreaterThanOrEqual(before + 60 * 86400000);
  expect(options.expires.getTime()).toBeLessThanOrEqual(Date.now() + 60 * 86400000);
});

test("honors an existing consent and shows again when the browser removes the expired cookie", () => {
  cookies.set("accept", true, { path: "/" });
  render();
  expect(host.querySelector("#cookie-consent")).toBeNull();
  document.cookie = "accept=; Max-Age=0; path=/";
  act(() => window.dispatchEvent(new Event("focus")));
  expect(host.querySelector("#cookie-consent")).not.toBeNull();
});

test("a false consent value does not hide the banner", () => {
  cookies.set("accept", false, { path: "/" });
  render();
  expect(host.querySelector("#cookie-consent")).not.toBeNull();
});
