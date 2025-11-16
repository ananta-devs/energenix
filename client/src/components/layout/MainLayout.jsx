import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';

export default function MainLayout() {
    const location = useLocation();
    const isCheckoutPage = location.pathname === '/checkout';

    return (
        <div className="min-h-screen flex flex-col">
            {!isCheckoutPage && <Header />}
            <main className="flex-1">
                <Outlet />
            </main>
            {!isCheckoutPage && <Footer />}
        </div>
    );
}
