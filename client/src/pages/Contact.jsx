import React from "react";

const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = React.useState("idle"); // idle, submitting, success, error

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("submitting");

    const mailtoLink = `mailto:glosmax1@gmail.com?subject=${encodeURIComponent(
      formData.subject,
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
    )}`;

    window.location.href = mailtoLink;
    setStatus("success");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-12">
      <div className="mb-12">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 font-bold mb-4">
          <a className="hover:text-brand-red transition-colors" href="/">
            Home
          </a>
          <span className="material-symbols-outlined text-[10px]">
            chevron_right
          </span>
          <span className="text-brand-red">Contact Support</span>
        </nav>
        <h2 className="text-5xl font-black tracking-tighter uppercase italic">
          Contact <span className="text-brand-red">Glosmax</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <div className="bg-surface-dark p-8 lg:p-10 border border-white/5 rounded-lg soft-glow-red">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/40 border-white/10 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-brand-red focus:border-brand-red outline-none transition-all placeholder-white/10 input-focus-red"
                    placeholder="Enter your name"
                    required
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">
                    Email Address
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/40 border-white/10 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-brand-red focus:border-brand-red outline-none transition-all placeholder-white/10 input-focus-red"
                    placeholder="your@email.com"
                    required
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">
                  Subject
                </label>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-black/40 border-white/10 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-brand-red focus:border-brand-red focus:shadow-[0_0_15px_rgba(139,0,0,0.3)] outline-none transition-all placeholder-white/10 input-focus-red"
                  placeholder="What can we help you with?"
                  required
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-black/40 border-white/10 rounded px-4 py-3 text-sm h-40 focus:ring-1 focus:ring-brand-red focus:border-brand-red focus:shadow-[0_0_15px_rgba(139,0,0,0.3)] outline-none transition-all placeholder-white/10 resize-none input-focus-red"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>
              <button className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-4 rounded font-black text-xs uppercase italic tracking-widest transition-all shadow-lg shadow-brand-red/20 flex items-center justify-center gap-3 group">
                {status === "success" ? (
                  "Opening Email Client..."
                ) : (
                  <>
                    Send Message
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      send
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-8">
            <div className="group">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-red mb-6 border-l-2 border-brand-red pl-4">
                Contact Details
              </h4>
              <div className="space-y-8">
                {/* Location Removed as per request */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded flex items-center justify-center flex-shrink-0 group-hover:border-brand-red/50 transition-colors">
                    <span className="material-symbols-outlined text-brand-red filled-icon">
                      phone
                    </span>
                  </div>
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-widest mb-1">
                      Phone Number
                    </h5>
                    <p className="text-sm text-white/50">9447749122</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded flex items-center justify-center flex-shrink-0 group-hover:border-brand-red/50 transition-colors">
                    <span className="material-symbols-outlined text-brand-red filled-icon">
                      mail
                    </span>
                  </div>
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-widest mb-1">
                      Email Support
                    </h5>
                    <p className="text-sm text-white/50">glosmax1@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-brand-red/5 border border-brand-red/20 rounded-lg">
              <h5 className="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-red text-sm">
                  schedule
                </span>
                Business Hours
              </h5>
              <p className="text-xs text-white/60">24/7 Support</p>
              <p className="text-xs text-white/60">Always available for you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
