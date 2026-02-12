import React from "react";
import commitmentImage from "../assets/commitment_image.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="text-center space-y-6 px-6 animate-fade-in">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
              Luxury, without{" "}
              <span className="text-brand-red block md:inline drop-shadow-2xl shadow-brand-red">
                excess.
              </span>
            </h2>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white/80">
              Deep Shine. <span className="text-brand-red">Zero Effort.</span>
            </p>
            <div className="w-24 h-1 bg-brand-red mx-auto mt-8 rounded-full shadow-[0_0_20px_rgba(139,0,0,0.5)]"></div>
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 lg:px-20 py-24 space-y-32">
        {/* About / Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-brand-red text-sm font-black tracking-[0.3em] uppercase">
                About Glosmax
              </h3>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-tight">
                Precision. <br />
                Performance. <br />
                <span className="text-brand-red">Restraint.</span>
              </h2>
            </div>
            <div className="space-y-6 text-lg text-white/70 font-medium leading-relaxed">
              <p>
                GLOSMAX is a premium car and bike care brand built on precision,
                performance, and restraint.
              </p>
              <p>
                We create detailing products for those who see their vehicles as
                more than machines. Every GLOSMAX product is engineered to
                deliver deep shine with zero effort, while protecting paint,
                surfaces, and finishes over time.
              </p>
              <p className="text-white font-bold italic">
                Luxury, without excess.
              </p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 border border-brand-red/20 rounded-xl group-hover:border-brand-red/40 transition-colors"></div>
            <img
              alt="Premium Product"
              className="rounded-lg relative z-10 grayscale hover:grayscale-0 transition-all duration-700 w-full aspect-[4/3] object-cover shadow-2xl shadow-black/50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPW4U1Rpvduv2zusPaEecwR6La4cQs52vIbdseRoMyj8NRBP80SL015Tv5Rnle9AJnXIo-DEoCLAgLnHlyXc419J0Tai4LMBdTAk-WCWYmcEACHKEq_Rn-WCb3c6tTeDX3A4uUhGZqSI53wioxp43mO-k3_yxOP_6KCDNw37eR0Q6s6TxbMZlspREGXZNc8bE3KMTNyVzHqqiVZoQw38-cF5iru3EHJACwHGrh2dHrAEk4zq4STNE6KvQXpiarLmID4a_2FoFUcJAf"
            />
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="text-center max-w-4xl mx-auto space-y-12">
          <div className="section-divider h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="space-y-6">
            <h3 className="text-brand-red text-sm font-black tracking-[0.3em] uppercase">
              Our Philosophy
            </h3>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">
              True care is <span className="text-brand-red">quiet.</span>
            </h2>
            <p className="text-xl text-white/60 font-medium leading-relaxed max-w-2xl mx-auto">
              At GLOSMAX, we believe the best detailing experience should feel
              effortless yet deliver uncompromising results. Our products are
              designed with intelligent formulations, tested in real conditions,
              and refined to perform without harshness or shortcuts.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 pt-8">
              {["No hype.", "No exaggeration.", "Only results that last."].map(
                (item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                    <span className="text-white font-bold uppercase tracking-widest text-sm">
                      {item}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="section-divider h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </section>

        {/* Designed for Cars & Bikes */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative group">
            <div className="absolute -inset-4 border border-brand-red/20 rounded-xl group-hover:border-brand-red/40 transition-colors"></div>
            <img
              alt="Cars and Bikes"
              className="rounded-lg relative z-10 grayscale hover:grayscale-0 transition-all duration-700 w-full aspect-[4/3] object-cover shadow-2xl shadow-black/50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY3A7pseJ-IWeVJqRltdr4HfK2ZZD_yMsNa1umP808-2VibCRttsMQh5SyE4fz7S_ynJrvke24a_06YxzXu7v89MO1oNY1adlOgJFZDWejhTNiEHWUglk9cj5M_J4Zu4dlvNs6L0RaCVT7RBUEZdrX9QVq_k-zPXNlOSp5wPse09JBNK2a36w7rNqr9k-nlSeTUASPESEFzQEM3YP9MwCtIbbW1rUlLTIBh0lhuUnZQrCLikylwxff7SvLdzPkiujJ4m0pSQqr0yfB"
            />
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-2">
              <h3 className="text-brand-red text-sm font-black tracking-[0.3em] uppercase">
                Designed for
              </h3>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                Cars & <span className="text-brand-red">Bikes</span>
              </h2>
            </div>
            <div className="space-y-6 text-lg text-white/70 font-medium leading-relaxed">
              <p>
                GLOSMAX products are developed specifically for both automobiles
                and motorcycles, covering everything from cleaning and
                protection to finishing and maintenance.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Paint-safe and surface-respectful",
                  "Effective on cars and bikes alike",
                  "Suitable for metal, paint, plastic, and trim",
                  "Tested for real-world Indian road conditions",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-brand-red text-xl mt-1">
                      check_circle
                    </span>
                    <span className="text-white font-bold">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-white font-black italic border-l-4 border-brand-red pl-6 py-2 mt-6">
                "If it doesn’t elevate the finish, it doesn’t carry the name."
              </p>
            </div>
          </div>
        </section>

        {/* The Standard */}
        <section className="bg-surface-dark border border-white/5 rounded-3xl p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/5 rounded-full blur-[100px]"></div>

          <div className="relative z-10 text-center space-y-12 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-brand-red text-sm font-black tracking-[0.3em] uppercase">
                The Glosmax Standard
              </h3>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                We don’t chase trends
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                  we refine <span className="text-brand-red">essentials.</span>
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              <div className="space-y-4">
                <span className="text-4xl font-black text-brand-red/20 italic">
                  01
                </span>
                <h4 className="text-xl font-bold text-white uppercase italic">
                  Depth & Clarity
                </h4>
                <p className="text-white/50 text-sm">
                  Where others focus on instant gloss, we focus on depth,
                  clarity, and durability.
                </p>
              </div>
              <div className="space-y-4">
                <span className="text-4xl font-black text-brand-red/20 italic">
                  02
                </span>
                <h4 className="text-xl font-bold text-white uppercase italic">
                  Disciplined Design
                </h4>
                <p className="text-white/50 text-sm">
                  GLOSMAX represents disciplined design and intelligent
                  chemistry.
                </p>
              </div>
              <div className="space-y-4">
                <span className="text-4xl font-black text-brand-red/20 italic">
                  03
                </span>
                <h4 className="text-xl font-bold text-white uppercase italic">
                  Trusted Quality
                </h4>
                <p className="text-white/50 text-sm">
                  Products trusted by professionals and enthusiasts alike.
                  Detailing, refined.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
              Our <span className="text-brand-red">Commitment</span>
            </h2>
            <div className="space-y-6">
              {[
                "To uncompromising quality.",
                "To purposeful innovation.",
                "To products that earn trust through performance.",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="pl-8 border-l border-white/10 hover:border-brand-red transition-colors py-2"
                >
                  <p className="text-xl md:text-2xl font-bold text-white uppercase italic tracking-wide">
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-brand-red font-black uppercase tracking-widest text-sm pt-4">
              Because excellence is never accidental.
            </p>
          </div>
          <div className="relative h-full min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-red/20 to-transparent rounded-2xl transform rotate-3"></div>
            <img
              alt="Commitment"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
              src={commitmentImage}
            />
          </div>
        </section>
      </div>

      {/* Beyond the Shine - CTA */}
      <section className="bg-brand-red py-32 px-6 mt-12 overflow-hidden relative">
        <div className="absolute right-0 top-0 text-[20rem] font-black text-black/10 select-none -translate-y-1/2 translate-x-1/4 italic leading-none">
          GLOSMAX
        </div>
        <div className="max-w-[1440px] mx-auto text-center space-y-12 relative z-10">
          <div className="space-y-6">
            <h3 className="text-black/50 text-xl font-bold uppercase tracking-[0.5em] mb-4">
              Beyond the Shine
            </h3>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-none">
              A Car. A Bike.
              <br />
              Each is <span className="text-black">design in motion.</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto pt-4">
              GLOSMAX exists to protect that design—quietly, confidently,
              flawlessly.
            </p>
          </div>

          <div className="pt-8">
            <a
              className="bg-black text-white px-12 py-5 rounded font-black uppercase italic tracking-widest hover:bg-white hover:text-black transition-all inline-block shadow-2xl shadow-black/30 hover:shadow-black/50 hover:-translate-y-1"
              href="/shop"
            >
              Shop The Catalog
            </a>
          </div>

          <div className="pt-20 border-t border-black/10 max-w-xs mx-auto mt-20">
            <h4 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              GLOSMAX
            </h4>
            <p className="text-black font-bold text-xs uppercase tracking-widest mt-2">
              Deep Shine. Zero Effort.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
