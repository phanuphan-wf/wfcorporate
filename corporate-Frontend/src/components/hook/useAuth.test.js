import React, { act } from "react";
import { createRoot } from "react-dom/client";
import Axios from "axios";
import { AuthProvider } from "./useAuth";
import { SESSION_KEYS } from "../../config/authSession";

jest.mock("react-router-dom", () => ({ useNavigate: () => jest.fn() }));
jest.mock("axios", () => ({
  post: jest.fn(() => Promise.resolve({})),
  interceptors: { response: { use: jest.fn(() => 1), eject: jest.fn() } },
}));
let root, host, originalLocation, listeners;
const start = 1800000000000;
beforeEach(() => {
  jest.useFakeTimers(); jest.setSystemTime(start);
  Axios.post.mockResolvedValue({});
  Axios.interceptors.response.use.mockReturnValue(1);
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  localStorage.setItem("user", JSON.stringify({ name: "Test", accessToken: "test-token" }));
  localStorage.setItem(SESSION_KEYS.started, String(start));
  localStorage.setItem(SESSION_KEYS.activity, String(start));
  originalLocation = window.location;
  delete window.location;
  window.location = { replace: jest.fn(), reload: jest.fn() };
  listeners = {};
  const originalAdd = window.addEventListener.bind(window);
  jest.spyOn(window, "addEventListener").mockImplementation((name, callback, options) => {
    listeners[name] = callback; originalAdd(name, callback, options);
  });
  host = document.createElement("div"); document.body.appendChild(host);
  root = createRoot(host);
  act(() => root.render(<AuthProvider><span>Test</span></AuthProvider>));
});
afterEach(() => {
  act(() => root.unmount()); host.remove(); window.location = originalLocation;
  jest.restoreAllMocks(); jest.useRealTimers();
});
test("idle expiration logs out once at ten minutes", () => {
  act(() => jest.advanceTimersByTime(10 * 60000));
  expect(localStorage.getItem("user")).toBeNull();
  expect(window.location.replace).toHaveBeenCalledTimes(1);
});
test("mouse activity extends inactivity and calls server", () => {
  jest.setSystemTime(start + 9 * 60000);
  act(() => listeners.mousemove({ isTrusted: true }));
  expect(Number(localStorage.getItem("expire"))).toBe(start + 19 * 60000);
  expect(Axios.post).toHaveBeenCalled();
  expect(localStorage.getItem(SESSION_KEYS.started)).toBe(String(start));
});
test("expired session cannot be revived by keyboard activity", () => {
  jest.setSystemTime(start + 10 * 60000);
  act(() => listeners.keydown({ isTrusted: true }));
  expect(localStorage.getItem("user")).toBeNull();
});
test("untrusted synthetic activity does not extend session", () => {
  jest.setSystemTime(start + 5 * 60000);
  act(() => listeners.mousemove({ isTrusted: false }));
  expect(localStorage.getItem(SESSION_KEYS.activity)).toBe(String(start));
});
test("only one timer exists across rerenders and cleanup removes it", () => {
  act(() => root.render(<AuthProvider><span>Changed</span></AuthProvider>));
  expect(jest.getTimerCount()).toBe(1);
  act(() => root.unmount());
  expect(jest.getTimerCount()).toBe(0);
  root = createRoot(host);
});
test("logout from another tab clears this tab", () => {
  localStorage.removeItem("user");
  act(() => listeners.storage());
  expect(window.location.replace).toHaveBeenCalledWith("/");
});
