import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      <img
        alt="Sleek sports car detailing"
        className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop"
      />
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 lg:px-20 flex flex-col justify-center items-start">
        <p className="text-brand-red font-black tracking-[0.3em] uppercase mb-4 italic">
          Maximum Shine. Maximum Protection.
        </p>
        <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase italic leading-tight mb-8">
          Redefine
          <br />
          <span className="text-brand-red">Excellence</span>
        </h2>
        <p className="text-lg text-white/70 max-w-xl mb-10 leading-relaxed">
          Experience the ultimate in automotive protection and finish with
          Glosmax. Engineered for those who demand nothing but perfection for
          their machines.
        </p>
        <Link
          to="/shop"
          className="bg-brand-red hover:bg-brand-red-dark text-white px-10 py-4 font-black uppercase italic tracking-widest transition-all soft-glow-red"
        >
          Shop Collection
        </Link>
      </div>
    </section>
  );
};

export default Hero;
