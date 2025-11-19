import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout() {
  const location = useLocation();

  // Pages that should NOT show header/footer
  const hideLayout =
    location.pathname.startsWith("/checkout") ||
    location.pathname.startsWith("/dashboard");

  // Home page should NOT wrap the top section (HeroSlider)
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!hideLayout && <Header />}

      <main className="flex-1 w-full">

        {isHomePage ? (
          <Outlet />
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
