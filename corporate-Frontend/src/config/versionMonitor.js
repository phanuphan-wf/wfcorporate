const RETRY_DELAY = 5 * 60000;
const RELOAD_KEY = "app-version-reload";

// Fetch the deployed HTML: CRA replaces this meta value from the package version.
export function startVersionMonitor(version, browser = window) {
  if (!version || version.includes("%")) return () => {};
  let stopped = false;
  let checking = false;
  let reloading = false;
  let controller;
  let lastCheckedDay;
  const localDay = () => new Date().toDateString();

  const check = async () => {
    if (stopped || checking || reloading || lastCheckedDay === localDay() || browser.navigator.onLine === false) return;
    checking = true;
    controller = new AbortController();
    const timeout = browser.setTimeout(() => controller.abort(), 15000);
    try {
      const url = new URL("index.html", browser.document.baseURI);
      url.searchParams.set("_version_check", Date.now().toString());
      const response = await browser.fetch(url.toString(), {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) return;
      const html = new DOMParser().parseFromString(await response.text(), "text/html");
      const latest = html.querySelector('meta[name="app-version"]')?.content?.trim();
      if (stopped || !latest || latest.includes("%")) return;
      lastCheckedDay = localDay();
      if (latest === version) return;

      // Avoid a reload loop if deployment/CDN temporarily serves mismatched files.
      const destination = new URL(browser.location.href);
      let lastAttempt = Number(destination.searchParams.get("_app_reload")) || 0;
      try {
        const saved = JSON.parse(browser.sessionStorage.getItem(RELOAD_KEY));
        if (saved?.version === latest) lastAttempt = saved.time;
      } catch (_) { /* Storage may be unavailable. The URL also guards retries. */ }
      if (Date.now() - lastAttempt < RETRY_DELAY) return;
      reloading = true;

      // Wait for cache removal, but cache access failure must not block updating.
      try {
        if (browser.caches) {
          const names = await browser.caches.keys();
          await Promise.allSettled(names.map(name => browser.caches.delete(name)));
        }
      } catch (_) { /* Reload still fetches a fresh document URL. */ }
      if (stopped) return;
      const time = Date.now();
      try {
        browser.sessionStorage.setItem(RELOAD_KEY, JSON.stringify({ version: latest, time }));
      } catch (_) { /* The URL guard remains available. */ }
      destination.searchParams.set("_app_reload", time.toString());
      browser.location.replace(destination.toString());
    } catch (_) {
      // Offline, timeout, or failed deployment: keep the current app and retry.
    } finally {
      browser.clearTimeout(timeout);
      checking = false;
    }
  };

  const onVisible = () => {
    if (browser.document.visibilityState === "visible") check();
  };
  check();
  let timer;
  const scheduleNextDay = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    timer = browser.setTimeout(() => {
      check();
      scheduleNextDay();
    }, midnight.getTime() - now.getTime());
  };
  scheduleNextDay();
  browser.addEventListener("focus", check);
  browser.addEventListener("online", check);
  browser.document.addEventListener("visibilitychange", onVisible);
  return () => {
    stopped = true;
    controller?.abort();
    browser.clearTimeout(timer);
    browser.removeEventListener("focus", check);
    browser.removeEventListener("online", check);
    browser.document.removeEventListener("visibilitychange", onVisible);
  };
}
