import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function AppLayout() {
    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }}>
            <Navbar />
            <main>
                <Outlet />   {/* << render nội dung trang ở đây */}
            </main>
            <Footer />
        </div>
    );
}
