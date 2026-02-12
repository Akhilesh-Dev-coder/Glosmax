import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-white/5 bg-surface-dark py-16 px-6 lg:px-20">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Glosmax"
              className="h-16 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-white/50 leading-relaxed">
            Engineering excellence for the modern automotive enthusiast. Glosmax
            provides premium care for those who settle for nothing less than
            perfection.
          </p>
        </div>
        <div>
          <h4 className="font-black mb-6 uppercase text-xs tracking-[0.2em] text-white/40">
            Shop
          </h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li>
              <a className="hover:text-brand-red transition-colors" href="#">
                Exterior Essentials
              </a>
            </li>
            <li>
              <a className="hover:text-brand-red transition-colors" href="#">
                Interior Preservation
              </a>
            </li>
            <li>
              <a className="hover:text-brand-red transition-colors" href="#">
                Pro Coatings
              </a>
            </li>
            <li>
              <a className="hover:text-brand-red transition-colors" href="#">
                Accessory Kits
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-black mb-6 uppercase text-xs tracking-[0.2em] text-white/40">
            Company
          </h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li>
              <a className="hover:text-brand-red transition-colors" href="#">
                The Mission
              </a>
            </li>
            <li>
              <a className="hover:text-brand-red transition-colors" href="#">
                Authorized Pro Centers
              </a>
            </li>
            <li>
              <a className="hover:text-brand-red transition-colors" href="#">
                Brand Ambassador
              </a>
            </li>
            <li>
              <a className="hover:text-brand-red transition-colors" href="#">
                Help Center
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-black mb-6 uppercase text-xs tracking-[0.2em] text-white/40">
            Stay Updated
          </h4>
          <div className="space-y-4">
            <p className="text-xs text-white/40 uppercase font-bold">
              Join the Glosmax inner circle for VIP access.
            </p>
            <div className="flex gap-2">
              <input
                className="bg-black/40 border-white/10 rounded px-4 py-3 text-sm w-full focus:ring-1 focus:ring-brand-red focus:border-brand-red outline-none placeholder-white/20"
                placeholder="Email address"
                type="email"
              />
              <button className="bg-brand-red px-6 py-3 rounded text-white font-black text-xs uppercase italic hover:bg-brand-red-dark transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
        <p>© 2026 Glosmax. Redefining Excellence.</p>
        <div className="flex gap-8">
          <a className="hover:text-brand-red transition-colors" href="#">
            Privacy
          </a>
          <a className="hover:text-brand-red transition-colors" href="#">
            Terms
          </a>
          <a className="hover:text-brand-red transition-colors" href="#">
            Warranty
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
