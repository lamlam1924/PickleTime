import React from "react";
import {createBrowserRouter} from "react-router-dom";

// import {ProtectedRoute} from "@components/ProtectedRoute"
import Home from "@pages/Home.jsx";
import Login from "@pages/Login";
import SignUp from "@pages/SignUp";
import ForgotPassword from "@pages/ForgotPassword";
import ResetPassword from "@pages/ResetPassword";
import GoogleCallback from "@pages/GoogleCallback";

//  all the components that are used in the layout
import {AdminLayout, GuestLayout, OwnerLayout} from "@layouts";
import CustomerLayout from "@layouts/CustomerLayout";

//  all the components that are used in the owner dashboard
import {AddTurf, OwnerBookings, OwnerDashboard, OwnerReviews, TurfManagement,} from "@components/owner";

//  all the components that are used in the admin dashboard
import {
    AdminDashboard,
    AllTurf,
    NewOwnerRequests,
    OwnerPage,
    RejectedOwnerRequests,
    TransactionSection,
    TurfList,
    UserManagement,
} from "@components/admin";
import ProtectedRoute from "@components/ProtectedRoute/ProtectedRoute";

// 404 page
import {NotFound} from "@components/common";
import Facility from "@components/turf/Facility.jsx";
import FacilityDetails from "@components/turf/FacilityDetails.jsx";
import BecomeOwner from "@/features/becomeOwner/BecomeOwner.jsx";
import RoleSwitcherPage from "@pages/RoleSwitcherPage.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <GuestLayout/>,
        errorElement: <NotFound/>,
        children: [
            {
                path: "",
                element: <Home/>,
            },
            {
                path: "login",
                element: <Login/>,
            },
            {
                path: "signup",
                element: <SignUp/>,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword/>,
            },
            {
                path: "reset-password",
                element: <ResetPassword/>,
            },
            {
                path: "auth/google-success",
                element: <GoogleCallback/>,
            },
        ],
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute allowedRoleIds={[1]}>
                <AdminLayout/>
            </ProtectedRoute>
        ),
        children: [
            {index: true, element: <AdminDashboard/>},
            {
                path: "owner-requests",
                children: [
                    {path: "new", element: <NewOwnerRequests/>},
                    {path: "rejected", element: <RejectedOwnerRequests/>},
                ],
            },
            {path: "users", element: <UserManagement/>},
            {
                path: "owners",
                children: [
                    {path: "", element: <OwnerPage/>},
                    {path: ":ownerId/turf", element: <TurfList/>},
                ],
            },

            {path: "turfs", element: <AllTurf/>},
            {path: "transactions", element: <TransactionSection/>},
            {
                path: "profile",
                element: (
                    <React.Suspense fallback={<div>Loading...</div>}>
                        {React.createElement(React.lazy(() => import("@pages/admin/AdminOwnerProfilePage")))}
                    </React.Suspense>
                )
            },
        ],
    },
    {
        path: "/owner",
        element: (
            <ProtectedRoute allowedRoleIds={[2]}>
                <OwnerLayout/>
            </ProtectedRoute>
        ),
        children: [
            {path: "", element: <OwnerDashboard/>},
            {path: "add-turf", element: <AddTurf/>},
            {path: "turfs", element: <TurfManagement/>},
            {path: "reviews", element: <OwnerReviews/>},
            {path: "bookings", element: <OwnerBookings/>},
            {
                path: "profile",
                element: (
                    <React.Suspense fallback={<div>Loading...</div>}>
                        {React.createElement(React.lazy(() => import("@pages/admin/AdminOwnerProfilePage")))}
                    </React.Suspense>
                )
            },
        ],
    },
    {
        path: "/customer",
        element: (
            <ProtectedRoute allowedRoleIds={[3]}>
                <CustomerLayout/>
            </ProtectedRoute>
        ),
        children: [
            {index: true, element: <Home/>}, // 👈 Dùng lại Home.jsx
            {path: "search", element: <Facility/>},
            {path: "turf/:id", element: <FacilityDetails/>},
            {path: "become-owner", element: <BecomeOwner/>},
            {
                path: "profile",
                element: (
                    <React.Suspense fallback={<div>Loading...</div>}>
                        {React.createElement(React.lazy(() => import("@pages/customer/ProfilePage")))}
                    </React.Suspense>
                )
            },
        ],
    },

    {
        path: "/select-role",
        element: (
            <RoleSwitcherPage/>
        ),
    },
]);

export default router;
