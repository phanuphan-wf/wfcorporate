import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

export default function ProtectedRoute({ menuOpen = false }) {
  const { user } = useAuth();

  if (!user) {
    // user is not authenticated
    return <Navigate to="/" />;
  }

  return (
    <div className="relative">
      <div
        className={`absolute left-[calc(5%/2)] top-[75px] w-[95%] ${
          menuOpen
            ? "md:left-[240px] lg:left-[260px] md:w-[calc(100%-260px)] lg:w-[calc(100%-300px)]"
            : ""
        } transition-all duration-300 ease-in-out`}
      >
        <Outlet />
      </div>
    </div>
  );
}
