import { Outlet } from "react-router-dom";
import CustomerNavbar from "@components/layout/CustomerNavbar";

const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomerNavbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
