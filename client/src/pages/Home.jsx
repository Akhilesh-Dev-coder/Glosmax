import React from "react";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import FeaturedCategories from "../components/FeaturedCategories";
import Features from "../components/Features";
import ProductGrid from "../components/ProductGrid";

const Home = () => {
  return (
    <>
      <div className="animate-fade-in">
        <Hero />
      </div>
      <Marquee />
      <div className="animate-slide-in [animation-delay:200ms]">
        <FeaturedCategories />
      </div>
      <div className="animate-slide-in [animation-delay:400ms]">
        <Features />
      </div>
      <div className="animate-slide-in [animation-delay:600ms]">
        <ProductGrid />
      </div>
    </>
  );
};

export default Home;
