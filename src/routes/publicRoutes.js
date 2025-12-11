import Login from "../components/login/Login";
import DashBoard from "../components/allpages/dashboard/DashBoard";

export const PublicRoutes = [
    { path: "/", element: <Login /> },
    { path: "/dashboard", element: <DashBoard /> }
];
