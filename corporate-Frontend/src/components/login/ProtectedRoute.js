import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import NavMenu from "./NavMenu";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const { user } = useAuth();
  const [isOpen, setOpen] = useState(true);

  useEffect(() => {
    //console.log(isOpen);
  }, [isOpen]);

  if (!user) {
    // user is not authenticated
    return <Navigate to="/" />;
  }

  const menuOpen = (click) => {
    setOpen(click);
  };

  return (
    <div className="relative">
      <NavMenu menu={menuOpen} />
      <div
        className={`absolute left-[calc(5%/2)] top-[75px] w-[95%] ${
          isOpen
            ? "md:left-[240px] lg:left-[260px] md:w-[calc(100%-260px)] lg:w-[calc(100%-300px)]"
            : ""
        } transition-all duration-300 ease-in-out`}
      >
        <Outlet />
      </div>
    </div>
  );
}
