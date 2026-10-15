import { AUTH_SESSION, getSessionDeadline } from "./authSession";
const start = 1800000000000;
test("expires after ten idle minutes", () => {
  expect(getSessionDeadline(start, start)).toBe(start + 10 * 60000);
});
test("activity extends idle deadline but never beyond original four hours", () => {
  expect(getSessionDeadline(start, start + 5 * 60000)).toBe(start + 15 * 60000);
  expect(getSessionDeadline(start, start + 239 * 60000)).toBe(start + 240 * 60000);
});
test("missing or corrupt metadata requires login", () => {
  for (const value of [0, NaN, Infinity]) {
    expect(getSessionDeadline(value, start)).toBe(0);
    expect(getSessionDeadline(start, value)).toBe(0);
  }
  expect(getSessionDeadline(start, start - 1)).toBe(0);
});
test("supports configured duration and disabling limits", () => {
  expect(getSessionDeadline(start, start, { enabled: true, idleMinutes: 2, maxMinutes: 30 })).toBe(start + 120000);
  expect(getSessionDeadline(0, 0, { ...AUTH_SESSION, enabled: false })).toBe(Infinity);
});
