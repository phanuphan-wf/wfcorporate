import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Simulate } from "react-dom/test-utils";
import ModalOtp from "./ModalOtp";

const now = 1800000000000;
let host, root, props;
beforeEach(() => {
  jest.useFakeTimers(); jest.setSystemTime(now);
  global.IS_REACT_ACT_ENVIRONMENT = true;
  HTMLDialogElement.prototype.showModal = jest.fn();
  HTMLDialogElement.prototype.close = jest.fn();
  host = document.createElement("div"); document.body.appendChild(host); root = createRoot(host);
  props = { challenge: { challengeId: "test", maskedPhone: "******1234", expiresAt: new Date(now + 300000).toISOString(), resendAvailableAt: new Date(now + 60000).toISOString() },
    busy: false, onVerify: jest.fn(), onResend: jest.fn(), onCancel: jest.fn() };
});
afterEach(() => { act(() => root.unmount()); host.remove(); jest.useRealTimers(); });
const render = () => act(() => root.render(<ModalOtp {...props} />));
test("accepts six digits including leading zero before verification", () => {
  render();
  const input = host.querySelector("input");
  act(() => Simulate.change(input, { target: { value: "00a1234" } }));
  expect(Array.from(host.querySelectorAll("input"), input => input.value)).toEqual(["0", "0", "1", "2", "3", "4"]);
  act(() => Simulate.submit(host.querySelector("form")));
  expect(props.onVerify).toHaveBeenCalledWith("001234");
});
test("expired OTP disables confirmation while allowing a new OTP", () => {
  render();
  act(() => jest.advanceTimersByTime(300000));
  expect(host.querySelector('button[type="submit"]').disabled).toBe(true);
  const resend = host.querySelectorAll('button[type="button"]')[0];
  expect(resend.disabled).toBe(false);
  act(() => Simulate.click(resend));
  expect(props.onResend).toHaveBeenCalledTimes(1);
});
test("resending clears the previous OTP and restarts the countdown", () => {
  render();
  act(() => Simulate.change(host.querySelector("input"), { target: { value: "123456" } }));
  props = { ...props, challenge: { ...props.challenge, expiresAt: new Date(now + 360000).toISOString() } };
  render();
  expect(host.querySelector("input").value).toBe("");
  expect(host.textContent).toContain("6:00");
});

test("typing advances focus and backspace clears the previous empty slot", () => {
  render();
  const inputs = host.querySelectorAll("input");
  act(() => Simulate.change(inputs[0], { target: { value: "7" } }));
  expect(document.activeElement).toBe(inputs[1]);
  act(() => Simulate.keyDown(inputs[1], { key: "Backspace" }));
  expect(inputs[0].value).toBe("");
  expect(document.activeElement).toBe(inputs[0]);
});
test("pasting a complete OTP distributes digits and preserves leading zeros", () => {
  render();
  const inputs = host.querySelectorAll("input");
  act(() => Simulate.paste(inputs[2], { clipboardData: { getData: () => "001234" } }));
  expect(Array.from(inputs, input => input.value).join("")).toBe("001234");
  act(() => Simulate.submit(host.querySelector("form")));
  expect(props.onVerify).toHaveBeenCalledWith("001234");
});
