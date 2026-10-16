import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Simulate } from "react-dom/test-utils";
import Axios from "axios";
import { useAuth } from "../hook/useAuth";
import Login from "./login";

jest.mock("axios", () => ({ post: jest.fn() }));
jest.mock("../hook/useAuth", () => ({ useAuth: jest.fn() }));
jest.mock("crypto-js", () => ({ AES: { encrypt: () => ({ toString: () => "encrypted-id" }) } }));
jest.mock("./ModalOtp", () => ({ challenge }) => challenge ? <div>OTP challenge</div> : null);
jest.mock("./modalChangePw", () => () => null);

let root, host, login;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  login = jest.fn(); useAuth.mockReturnValue({ login });
  host = document.createElement("div"); document.body.appendChild(host); root = createRoot(host);
  act(() => root.render(<Login />));
});
afterEach(() => { act(() => root.unmount()); host.remove(); });
const submit = async (data) => {
  Axios.post.mockResolvedValue({ status: 200, data });
  await act(async () => { Simulate.submit(host.querySelector("form")); });
};
test("accepts local-development completion only with a server-issued access token", async () => {
  await submit({ code: 202, accessToken: "server-token", emID: "test", name: "Test User" });
  expect(login).toHaveBeenCalledWith(expect.objectContaining({ accessToken: "server-token", name: "Test User" }));
});
test("OTP challenge still requires verification before login", async () => {
  await submit({ code: 206, challengeId: "test-challenge" });
  expect(login).not.toHaveBeenCalled();
  expect(host.textContent).toContain("OTP challenge");
});
test("does not accept an old completion response without an access token", async () => {
  await submit({ code: 202, emID: "test" });
  expect(login).not.toHaveBeenCalled();
  expect(host.querySelector('[role="alert"]')).not.toBeNull();
});
