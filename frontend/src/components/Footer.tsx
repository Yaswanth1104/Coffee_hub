function Footer() {
  return (
    <footer className="bg-[var(--coffee-dark)] text-white">
      <div className="coffee-container py-14">
        <div className="grid md:grid-cols-[1.3fr_.7fr_.7fr] gap-10 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-[#f3e1cf] text-[#5a321f] grid place-items-center text-2xl">☕</span>
              <div><p className="font-serif text-2xl font-bold">CoffeeHub</p><p className="text-[9px] uppercase tracking-[.28em] text-[#d9ad76]">Specialty Coffee</p></div>
            </div>
            <p className="text-white/65 leading-7 text-sm max-w-md mt-5">Thoughtfully sourced beans, small-batch roasting and beautifully crafted cups for slow mornings and good conversations.</p>
          </div>
          <div><p className="text-[10px] uppercase tracking-[.25em] text-[#d9ad76] font-bold">Explore</p><div className="flex flex-col gap-3 mt-5 text-sm text-white/70"><a href="#menu" className="hover:text-white transition">Menu</a><a href="#about" className="hover:text-white transition">Our Story</a><a href="#" className="hover:text-white transition">Back to top ↑</a></div></div>
          <div><p className="text-[10px] uppercase tracking-[.25em] text-[#d9ad76] font-bold">CoffeeHub</p><div className="mt-5 text-sm text-white/70 space-y-3"><p>Fresh Coffee. Great Moments.</p><p>Crafted daily with intention.</p></div></div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-7 text-xs text-white/45"><p>© 2026 CoffeeHub. All rights reserved.</p><p>Made for coffee people.</p></div>
      </div>
    </footer>
  );
}
export default Footer;
