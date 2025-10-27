import { Outlet } from "react-router-dom";
import GuestNavbar from "../components/layout/GuestNavbar";

const GuestLayout = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <GuestNavbar />
      <main className="flex-grow pt-16 ">
        <Outlet />
      </main>
    </div>
  );
};

export default GuestLayout;
