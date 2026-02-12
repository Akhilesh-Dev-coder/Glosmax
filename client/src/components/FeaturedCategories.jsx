import React from "react";
import { Link } from "react-router-dom";

const FeaturedCategories = () => {
  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-20 py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">
            Featured <span className="text-brand-red">Categories</span>
          </h2>
          <p className="text-white/40 mt-2 uppercase text-xs tracking-widest font-bold">
            Curated solutions for every surface
          </p>
        </div>
        <Link
          className="text-xs font-black uppercase tracking-widest text-brand-red hover:text-white transition-colors flex items-center gap-2"
          to="/shop"
        >
          Browse All{" "}
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
        <Link
          to="/shop?category=Exterior Care"
          className="group relative overflow-hidden category-card h-full block"
        >
          <img
            alt="Exterior Care"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ3-F71nbH6xrq0BM2MdEVGpoTNq4TJ3m95fq1yKM51HXCHqwcYwjJ9LFAk9k_xh_mE0yfIRuLj4n7IkqVGAeJtUMnJqTRdTMvcgav5zEJ4VRuybzCBbDZ4KIItyBaDdeoOiQVjFVk_qEqxJLrkMM1r-Y-mWbM0TM5doyzfiDlKGRKsOfIFGjnTjAnRYaG6kDzynXl50jBjsIugggOWmhtzHViXc5YOAM9L_RkxbbjCeBZDmBw7iThnnPqREXimNB_DfdaG0pe_BKZ"
          />
          <div className="absolute inset-0 bg-black/60 category-overlay transition-colors duration-500"></div>
          <div className="absolute inset-0 p-10 flex flex-col justify-end">
            <span className="material-symbols-outlined text-brand-red text-4xl mb-4 filled-icon">
              directions_car
            </span>
            <h3 className="text-3xl font-black uppercase italic mb-2">
              Exterior
            </h3>
            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Pristine paint protection and ceramic coatings by Glosmax.
            </p>
            <span className="text-xs font-black uppercase tracking-widest text-white border-b-2 border-brand-red w-fit pb-1 group-hover:text-brand-red transition-colors">
              Explore
            </span>
          </div>
        </Link>
        <Link
          to="/shop?category=Interior Care"
          className="group relative overflow-hidden category-card h-full block"
        >
          <img
            alt="Interior Care"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC75daZga4FFJZOX8hVvq4K_xZj2J0qLo3lXOkJvJ8cOd_vnuCQD3eE4AklbLldp7Eo3Vf3PYvtsYBWkLfrS7wE2i4TkSuvF8Htfvs8j-PXGgMuIOrzV6C_RwiGVIOcwr05pZyPCFYgqL83brJUDgaTqE6ZjTuJ9Mv5L7Os0mjCDpq8yYqK4p4LHG-Y3NkIYQe0Ft-rFDKCTDxUvlVUWrykCDQVJBJOYs1B97aHdFjBPyKlQyU1AfquVxVFJ8Ze8Xr-WYsSGGu5U9bJ"
          />
          <div className="absolute inset-0 bg-black/60 category-overlay transition-colors duration-500"></div>
          <div className="absolute inset-0 p-10 flex flex-col justify-end">
            <span className="material-symbols-outlined text-brand-red text-4xl mb-4 filled-icon">
              event_seat
            </span>
            <h3 className="text-3xl font-black uppercase italic mb-2">
              Interior
            </h3>
            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Deep cleansing and premium surface conditioning formulas.
            </p>
            <span className="text-xs font-black uppercase tracking-widest text-white border-b-2 border-brand-red w-fit pb-1 group-hover:text-brand-red transition-colors">
              Explore
            </span>
          </div>
        </Link>
        <Link
          to="/shop?category=Coatings"
          className="group relative overflow-hidden category-card h-full block"
        >
          <img
            alt="Professional Coatings"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTdoeRgv6rDlD24CxuDkODgvXw2axP0qRY50dR2kh-95mCDv_D1EQinJgPJhqALPcz8XdtS7zHv4X76_-n8_YfKyJrI1_rrfhX3Ou1GlxndxRy0aIS8pCEet2jCDPE0sPtWOMguDCbR1TBXsH_9PMsnDWG7EbdUvCSNkjWn_8NaCxJ0WV_awSMHPKKmOC8qe0MXDAUpj6EroTVz_uBMH3EpMfb5lotcxRc28A1bOCII_DaFJNArmYrzqF9yuPIgYO7BH5wr-ZpZxR6"
          />
          <div className="absolute inset-0 bg-black/60 category-overlay transition-colors duration-500"></div>
          <div className="absolute inset-0 p-10 flex flex-col justify-end">
            <span className="material-symbols-outlined text-brand-red text-4xl mb-4 filled-icon">
              verified_user
            </span>
            <h3 className="text-3xl font-black uppercase italic mb-2">
              Coatings
            </h3>
            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Industrial-grade graphene and ceramic tech from Glosmax labs.
            </p>
            <span className="text-xs font-black uppercase tracking-widest text-white border-b-2 border-brand-red w-fit pb-1 group-hover:text-brand-red transition-colors">
              Explore
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedCategories;
