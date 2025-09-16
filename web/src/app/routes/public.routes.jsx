// map route Landing & Login
import React, { lazy } from "react";
import { ROUTE_PATHS } from "./paths";

const LandingPage = lazy(() => import("../../features/home/pages/LandingPage"));
const LoginPage   = lazy(() => import("../../features/auth/pages/LoginPage"));

export const publicRoutes = [
    { path: ROUTE_PATHS.home,  element: <LandingPage /> },
    { path: ROUTE_PATHS.login, element: <LoginPage /> },
];
