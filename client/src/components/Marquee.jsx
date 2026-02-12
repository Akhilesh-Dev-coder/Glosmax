import React from "react";

const Marquee = () => {
  const items = [
    "FREE SHIPPING",
    "PREMIUM JAPANESE NANO-TECHNOLOGY",
    "OFFICIAL PORSCHE CLUB PARTNER",
    "24/7 EXPERT SUPPORT",
    "100% SATISFACTION GUARANTEED",
  ];

  return (
    <div className="bg-brand-red py-3 overflow-hidden border-y border-white/10 relative z-20">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Render items 4 times to ensure smooth infinite scroll */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-8 items-center mx-4">
            {items.map((item, idx) => (
              <React.Fragment key={idx}>
                <span className="text-white text-xs font-black uppercase italic tracking-[0.2em]">
                  {item}
                </span>
                <span className="w-2 h-2 bg-black rounded-full text-black/20">
                  •
                </span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
