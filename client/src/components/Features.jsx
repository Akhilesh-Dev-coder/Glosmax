import React from "react";

const Features = () => {
  return (
    <section className="bg-surface-dark border-y border-white/5 py-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-brand-red/10 border border-brand-red/20 rounded flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-brand-red text-4xl filled-icon">
                science
              </span>
            </div>
            <h4 className="text-xl font-black uppercase italic mb-4">
              Professional Grade
            </h4>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Glosmax formulas are developed for elite detailers, now available
              for your home garage.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-brand-red/10 border border-brand-red/20 rounded flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-brand-red text-4xl filled-icon">
                bolt
              </span>
            </div>
            <h4 className="text-xl font-black uppercase italic mb-4">
              Fast Shipping
            </h4>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Next-day fulfillment to ensure you're ready for your next weekend
              project with Glosmax.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-brand-red/10 border border-brand-red/20 rounded flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-brand-red text-4xl filled-icon">
                support_agent
              </span>
            </div>
            <h4 className="text-xl font-black uppercase italic mb-4">
              Expert Support
            </h4>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Our Glosmax master detailers are on standby to help you achieve
              the perfect finish.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
