import { useEffect, useState } from "react";

import CheckoutLarge from "./checkoutpages/CheckoutLarge.jsx";

import CheckoutSmall from "./checkoutpages/CheckoutSmall.jsx";

const Checkout = () => {
    const [isSmall, setIsSmall] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => setIsSmall(window.innerWidth <= 1024);

        let timeout;

        const optimizedResize = () => {
            clearTimeout(timeout);

            timeout = setTimeout(handleResize, 150);
        };

        window.addEventListener("resize", optimizedResize);

        return () => window.removeEventListener("resize", optimizedResize);
    }, []);

    return isSmall ? <CheckoutSmall /> : <CheckoutLarge />;
};

export default Checkout;