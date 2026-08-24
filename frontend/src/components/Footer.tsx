function Footer() {
  return (
    <footer
      className="py-10"
      style={{
        background: "var(--coffee-dark)",
      }}
    >
      <div className="coffee-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">

          <div className="text-center md:text-left">

            <div className="flex items-center justify-center md:justify-start gap-3">

              <span className="text-2xl">
                ☕
              </span>

              <span className="text-xl font-bold text-white">
                CoffeeHub
              </span>

            </div>

            <p className="text-white/60 text-sm mt-2">
              Fresh Coffee. Great Moments.
            </p>

          </div>

          <p className="text-white/50 text-sm">
            © 2026 CoffeeHub. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}

export default Footer;