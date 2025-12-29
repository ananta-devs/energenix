import React, { useMemo, useState, useEffect } from "react";
import { TESTIMONIALS } from "../../data"; //for dummy reviews
import { Star, Loader2 } from "lucide-react";
import HeroSlider from "./HeroSlider.jsx";
import ProductCard from "../product/ProductCard.jsx";
import { useProducts } from "../../context/ProductContext.jsx";
import about from "../../assets/aboutUs.webp";
import FullPageLoader from "../ui/FullPageLoader.jsx";

export default function HomePage() {
    const { products, loading, error } = useProducts();
    const [heroSliderLoading, setHeroSliderLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const randomTestimonials = useMemo(() => {
        return [...TESTIMONIALS].sort(() => 0.5 - Math.random()).slice(0, 3);
    }, []);

    const getRandomRating = () => Math.floor(Math.random() * 3) + 3; // 3–5

    const trendingProducts = products.filter((p) => p.trending);
    const displayedTrendingProducts = trendingProducts.slice(0, 3);

    // Handle HeroSlider loading completion
    const handleHeroSliderLoad = () => {
        setHeroSliderLoading(false);
    };

    const handleHeroSliderError = () => {
        setHeroSliderLoading(false);
    };

    // Check if everything is loading
    const isLoading = heroSliderLoading || loading;

    if (error) {
        return <div className="py-20 text-center">Error: {error.message}</div>;
    }

    return (
        <div className="w-full relative">
            {/* Full-page loading overlay - covers entire homepage except header/footer */}
            {isLoading && isMounted && <FullPageLoader />}

            {/* HERO — FULL WIDTH, NO PADDING */}
            <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
                <HeroSlider 
                    onLoad={handleHeroSliderLoad}
                    onError={handleHeroSliderError}
                />
            </div>

            {/* EVERYTHING BELOW — INSIDE CONTAINER */}
            <div className={`mx-auto w-full max-w-screen-xl px-4 space-y-20 ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500 delay-300'}`}>
                {/* TRENDING */}
                {!loading && (
                    <section>
                        <div className="text-center mb-12 bg-white mt-6">
                            <h2 className="text-3xl font-bold">Trending Now</h2>
                            <p className="text-gray-600">
                                Popular choices this season
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {displayedTrendingProducts.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>

                        {/* Optional: Show message if there are no trending products */}
                        {displayedTrendingProducts.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-500">
                                    No trending products available at the moment.
                                </p>
                            </div>
                        )}
                    </section>
                )}

                {/* STORY */}
                <section>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:ml-30">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">
                                Our Story
                            </h2>
                            <p className="text-gray-700 font-semibold mb-2">
                                70+ Years of Legacy.
                            </p>
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">EnergeniX</span>{" "}
                                was born in a small town over 70 years ago,
                                where our family began offering pure beads, real
                                crystals, and powerful spiritual items to people
                                searching for authentic products.
                            </p>
                            <p className="text-gray-700 mb-4">
                                We never relied on ads. People felt the
                                difference in our products. They returned
                                because they trusted us — and that trust is what
                                built our legacy.
                            </p>

                            <h2 className="text-2xl font-semibold mb-4 text-center lg:text-left">
                                Mission
                            </h2>
                            <p className="text-gray-700 mb-2">
                                To protect people from fake and low-quality
                                spiritual items, we deliver only pure, powerful,
                                and authentically energized products that create
                                real transformation in daily life.
                            </p>

                            <h2 className="text-2xl font-semibold mb-4 text-center lg:text-left">
                                Vision
                            </h2>
                            <p className="text-gray-700 mb-2">
                                To become India's most trusted spiritual brand,
                                carrying our 70+ year family heritage into every
                                home with products that protect, transform, and
                                uplift.
                            </p>
                        </div>

                        <img
                            src={about}
                            className="rounded-xl shadow-xl w-full max-w-sm"
                            alt="About EnergeniX"
                        />
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <section className="py-16 -mx-4 px-4 md:-mx-0 md:px-0 rounded-xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">
                            What Our Customers Say
                        </h2>
                        <p className="text-gray-600">Trusted by thousands</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {randomTestimonials.map((t) => {
                            const rating = getRandomRating();

                            return (
                                <div
                                    key={t.id}
                                    className="bg-white p-6 rounded-xl shadow-sm border"
                                >
                                    <div className="flex mb-4">
                                        {[...Array(rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-5 h-5 text-amber-400 fill-amber-400"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-4">
                                        "{t.text}"
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 font-semibold text-blue-600">
                                            {t.avatar}
                                        </div>
                                        <span className="font-semibold">
                                            {t.name}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}