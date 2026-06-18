import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useProducts } from "../../context/ProductContext.jsx";

function MainLayout() {
    const location = useLocation();
    const { error } = useProducts();

    // Pages that should NOT show header/footer
    const hideLayout =
        location.pathname.startsWith("/checkout") ||
        location.pathname.startsWith("/dashboard") ||
        location.pathname === "/maintenance" ||
        !!error;

    // Home page should NOT wrap the top section (HeroSlider)
    const isFullWidthPage = 
        location.pathname === "/" || 
        location.pathname === "/about-us";
    const isDashboard = location.pathname.startsWith("/dashboard");

    return (
        <div className="min-h-screen flex flex-col">
            {!hideLayout && <Header />}

            <main className="flex-1 w-full bg-gray-50">
                {isFullWidthPage ? (
                    <div className="bg-white">
                        <Outlet />
                    </div>
                ) : isDashboard ? (
                    // NO padding, NO container for dashboard
                    <div className="w-full">
                        <Outlet />
                    </div>
                ) : (
                    <div className="mx-auto w-full max-w-screen-xl px-4 py-4">
                        <Outlet />
                    </div>
                )}
            </main>

            {!hideLayout && <Footer />}
        </div>
    );
}

export default MainLayout;
