import Axios from "axios";
import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { AUTH_SESSION, SESSION_KEYS, getSessionDeadline } from "../../config/authSession";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const login = async (data) => {
    const now = data.sessionStartedAt || Date.now();
    localStorage.setItem(SESSION_KEYS.started, String(now));
    localStorage.setItem(SESSION_KEYS.activity, String(now));
    localStorage.setItem("expire", String(getSessionDeadline(now, now, data.sessionPolicy || AUTH_SESSION)));
    setUser(data);
    navigate("/solution/dashboard", { replace: true });
    window.location.reload();
  };

  const logout = async () => {
    if (user?.accessToken) {
      try {
        await Axios.post(process.env.REACT_APP_API_URI + process.env.REACT_APP_admin + "/session/logout", {},
          { headers: { Authorization: "Bearer " + user.accessToken }, timeout: 5000 });
      } catch { /* ล้างข้อมูลในเครื่องแม้ network ใช้ไม่ได้ */ }
    }
    localStorage.removeItem(SESSION_KEYS.started);
    localStorage.removeItem(SESSION_KEYS.activity);
    localStorage.removeItem("expire");
    setUser(null);
    navigate("/", { replace: true });
    window.location.reload();
  };

  useEffect(() => {
    if (!user) return;
    let leaving = false;
    let lastPing = 0;
    let pingInFlight = false;
    const policy = user.sessionPolicy || AUTH_SESSION;
    const leave = () => {
      if (leaving) return;
      leaving = true;
      localStorage.removeItem(SESSION_KEYS.started);
      localStorage.removeItem(SESSION_KEYS.activity);
      localStorage.removeItem("expire");
      localStorage.removeItem("user");
      window.location.replace("/");
    };
    const check = () => {
      let stored;
      try { stored = JSON.parse(localStorage.getItem("user")); }
      catch { leave(); return false; }
      if (!stored?.accessToken || !user.accessToken) {
        leave();
        return false;
      }
      if (stored.accessToken !== user.accessToken) {
        window.location.reload();
        return false;
      }
      if (!policy.enabled) return true;
      const deadline = getSessionDeadline(
        Number(localStorage.getItem(SESSION_KEYS.started)),
        Number(localStorage.getItem(SESSION_KEYS.activity)), policy
      );
      if (Date.now() >= deadline) {
        leave();
        return false;
      }
      return true;
    };
    const activity = (event) => {
      if (!event.isTrusted || !check() || !policy.enabled) return;
      const now = Date.now();
      const last = Number(localStorage.getItem(SESSION_KEYS.activity));
      // ลดการเขียน storage จาก mousemove โดยยังใช้เวลาร่วมกันทุกแท็บ
      if (user.accessToken && now - lastPing >= 1000 && !pingInFlight) {
        lastPing = now;
        pingInFlight = true;
        Axios.post(process.env.REACT_APP_API_URI + process.env.REACT_APP_admin + "/session/activity", {},
          { headers: { Authorization: "Bearer " + user.accessToken }, timeout: 5000 })
          .catch((error) => { if (error.response?.status === 401) leave(); })
          .finally(() => { pingInFlight = false; });
      }
      if (now - last < 1000) return;
      localStorage.setItem(SESSION_KEYS.activity, String(now));
      localStorage.setItem("expire", String(getSessionDeadline(
        Number(localStorage.getItem(SESSION_KEYS.started)), now, policy
      )));
    };
    const interceptor = Axios.interceptors.response.use(response => response, error => {
      const authorization = error.config?.headers?.Authorization;
      if (error.response?.status === 401 && authorization === "Bearer " + user.accessToken) leave();
      return Promise.reject(error);
    });
    check();
    const timer = window.setInterval(check, 1000);
    const events = ["mousemove", "mousedown", "keydown", "touchstart"];
    events.forEach((name) => window.addEventListener(name, activity, { passive: true }));
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("storage", check);
    return () => {
      Axios.interceptors.response.eject(interceptor);
      window.clearInterval(timer);
      events.forEach((name) => window.removeEventListener(name, activity));
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("storage", check);
    };
  }, [user]);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
