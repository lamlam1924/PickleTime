// tạo router & gắn layout
import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./AppLayout";
import { publicRoutes } from "./routes/public.routes";

export default function App() {
    const router = createBrowserRouter([
        { element: <AppLayout />, children: [...publicRoutes] }
    ]);
    return (
        <Suspense fallback={<div style={{padding:24}}>Loading…</div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
}

