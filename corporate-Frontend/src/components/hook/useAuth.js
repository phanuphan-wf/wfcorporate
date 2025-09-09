import { createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [expire, setExpire] = useLocalStorage("expire", null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data) => {
    setUser(data);
    setExpire(Date.now() + 1000 * 60 * 60 * 4); // set value to 2 hours
    navigate("/solution/dashboard", { replace: true });
    window.location.reload();
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    setExpire(null);
    clearInterval();
    navigate("/", { replace: true });
    window.location.reload();
  };

  useEffect(() => {
    setInterval(() => {
      const expire = parseInt(localStorage.getItem("expire"));
      if (expire < Date.now()) {
        alert("Your session is expired, Please re login to Solution");
        logout();
      }
    }, 1000);

    /*
    const user = localStorage.getItem("user");
    if (user == undefined) {
      window.removeEventListener("mousemove", handleScroll);
      window.removeEventListener("keydown", handleScroll);
      window.removeEventListener("mousedown", handleScroll);
    } else {
      window.addEventListener("mousemove", handleScroll);
      window.addEventListener("keydown", handleScroll);
      window.addEventListener("mousedown", handleScroll);
    }
    */
  });

  useEffect(() => {
    const exp = parseInt(localStorage.getItem("expire"));
    if (exp < Date.now()) {
      logout();
      clearInterval();
    }
  }, []);

  function handleScroll() {
    setExpire(Date.now() + 1000 * 60 * 60 * 4); // set value to 2 hours
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
