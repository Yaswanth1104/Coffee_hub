import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b"
      style={{
        borderColor: "rgba(111, 78, 55, 0.12)",
      }}
    >
      <div className="coffee-container">
        <div className="h-20 flex items-center justify-between">

          {/* Logo */}

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
              style={{
                background: "var(--coffee-dark)",
              }}
            >
              ☕
            </div>

            <div>
              <h1
                className="text-xl font-bold"
                style={{
                  color: "var(--coffee-dark)",
                }}
              >
                CoffeeHub
              </h1>

              <p className="text-[10px] uppercase tracking-[0.2em] coffee-muted">
                Coffee & Moments
              </p>
            </div>
          </button>

          {/* Navigation */}

          <div className="hidden md:flex items-center gap-8">

            <button
              onClick={() => navigate("/")}
              className="font-medium hover:opacity-70 transition"
              style={{
                color: "var(--coffee-dark)",
              }}
            >
              Home
            </button>

            <a
              href="#menu"
              className="font-medium hover:opacity-70 transition"
              style={{
                color: "var(--coffee-dark)",
              }}
            >
              Menu
            </a>

            <a
              href="#about"
              className="font-medium hover:opacity-70 transition"
              style={{
                color: "var(--coffee-dark)",
              }}
            >
              About
            </a>

            <button
              onClick={() => navigate("/login")}
              className="coffee-button"
            >
              Admin Login
            </button>

          </div>

          {/* Mobile */}

          <button
            className="md:hidden text-2xl"
            style={{
              color: "var(--coffee-dark)",
            }}
          >
            ☰
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;