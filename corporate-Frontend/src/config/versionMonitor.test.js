import { startVersionMonitor } from "./versionMonitor";

let browser, stop;
const response = version => ({ ok: true, text: async () => `<meta name="app-version" content="${version}">` });
const flush = async () => { for (let i = 0; i < 15; i++) await Promise.resolve(); };
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 9, 26, 23, 59, 0));
  sessionStorage.clear();
  browser = {
    fetch: jest.fn().mockResolvedValue(response("1")),
    document, navigator: { onLine: true }, sessionStorage,
    location: { href: "https://example.com/solution/orders?filter=open#row", replace: jest.fn() },
    setTimeout, clearTimeout,
    addEventListener: jest.fn(), removeEventListener: jest.fn(),
  };
});
afterEach(() => { stop?.(); jest.useRealTimers(); });

test("checks on opening and at midnight, without polling or rechecking on same-day focus", async () => {
  stop = startVersionMonitor("1", browser);
  await flush();
  const focus = browser.addEventListener.mock.calls.find(([name]) => name === "focus")[1];
  await focus();
  expect(browser.fetch).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(60000);
  await flush();
  expect(browser.fetch).toHaveBeenCalledTimes(2);
  expect(browser.location.replace).not.toHaveBeenCalled();
  expect(browser.fetch.mock.calls[0][1].cache).toBe("no-store");
});

test("a tab waking the next day checks immediately", async () => {
  stop = startVersionMonitor("1", browser);
  await flush();
  jest.setSystemTime(new Date(2026, 9, 27, 9));
  const focus = browser.addEventListener.mock.calls.find(([name]) => name === "focus")[1];
  await focus();
  expect(browser.fetch).toHaveBeenCalledTimes(2);
});

test("waits for cache deletion and reloads the same route with its query and hash", async () => {
  browser.fetch.mockResolvedValue(response("2"));
  let resolveDelete;
  browser.caches = { keys: async () => ["app"], delete: jest.fn(() => new Promise(resolve => { resolveDelete = resolve; })) };
  stop = startVersionMonitor("1", browser);
  await flush();
  expect(browser.location.replace).not.toHaveBeenCalled();
  resolveDelete(true);
  await flush();
  const destination = new URL(browser.location.replace.mock.calls[0][0]);
  expect(destination.pathname).toBe("/solution/orders");
  expect(destination.searchParams.get("filter")).toBe("open");
  expect(destination.hash).toBe("#row");
  expect(destination.searchParams.has("_app_reload")).toBe(true);
});

test("updates without Cache API and does not rely on another tab's version cookie", async () => {
  document.cookie = "x_client_version=2; path=/";
  browser.fetch.mockResolvedValue(response("2"));
  stop = startVersionMonitor("1", browser);
  await flush();
  expect(browser.location.replace).toHaveBeenCalledTimes(1);
});

test("cache access failure does not prevent updating", async () => {
  browser.fetch.mockResolvedValue(response("2"));
  browser.caches = { keys: jest.fn().mockRejectedValue(new Error("denied")) };
  stop = startVersionMonitor("1", browser);
  await flush();
  expect(browser.location.replace).toHaveBeenCalledTimes(1);
});

test.each([response("%REACT_APP_VERSION%"), { ok: false }, { ok: true, text: async () => "<html>maintenance</html>" }])("ignores unavailable or invalid version responses", async result => {
  browser.fetch.mockResolvedValue(result);
  stop = startVersionMonitor("1", browser);
  await flush();
  expect(browser.location.replace).not.toHaveBeenCalled();
});

test("network failure is retried on reconnect without reloading", async () => {
  browser.fetch.mockRejectedValueOnce(new Error("offline"));
  stop = startVersionMonitor("1", browser);
  await flush();
  const online = browser.addEventListener.mock.calls.find(([name]) => name === "online")[1];
  await online();
  expect(browser.fetch).toHaveBeenCalledTimes(2);
  expect(browser.location.replace).not.toHaveBeenCalled();
});

test("prevents repeated reloads when deployment still returns old assets", async () => {
  sessionStorage.setItem("app-version-reload", JSON.stringify({ version: "2", time: Date.now() }));
  browser.fetch.mockResolvedValue(response("2"));
  stop = startVersionMonitor("1", browser);
  await flush();
  expect(browser.location.replace).not.toHaveBeenCalled();
});

test("cleanup cancels a pending check and the next-day timer", async () => {
  let resolve;
  browser.fetch.mockReturnValue(new Promise(done => { resolve = done; }));
  stop = startVersionMonitor("1", browser);
  stop();
  resolve(response("2"));
  await flush();
  jest.advanceTimersByTime(86400000);
  expect(browser.location.replace).not.toHaveBeenCalled();
  expect(browser.fetch).toHaveBeenCalledTimes(1);
});
