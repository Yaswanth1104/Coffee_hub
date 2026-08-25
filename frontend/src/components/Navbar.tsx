import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<{ name: string; email: string } | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("customer") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncCustomer = () => {
      try {
        setCustomer(JSON.parse(localStorage.getItem("customer") || "null"));
      } catch {
        setCustomer(null);
      }
    };
    window.addEventListener("coffeehub:customer-auth", syncCustomer);
    return () => window.removeEventListener("coffeehub:customer-auth", syncCustomer);
  }, []);

  const logout = () => {
    localStorage.removeItem("customer_access_token");
    localStorage.removeItem("customer");
    setCustomer(null);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b" style={{ borderColor: "rgba(111, 78, 55, 0.12)" }}>
      <div className="coffee-container">
        <div className="h-20 flex items-center justify-between gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl" style={{ background: "var(--coffee-dark)" }}>☕</div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold" style={{ color: "var(--coffee-dark)" }}>CoffeeHub</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] coffee-muted">Coffee & Moments</p>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-7">
            <button onClick={() => navigate("/")} className="font-medium hover:opacity-70 transition">Home</button>
            <a href="#menu" className="font-medium hover:opacity-70 transition">Menu</a>
            <a href="#about" className="font-medium hover:opacity-70 transition">About</a>
            {customer ? (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate("/customer-auth")} className="font-semibold text-[var(--coffee-brown)]">Hi, {customer.name.split(" ")[0]}</button>
                <button onClick={logout} className="text-sm font-medium border border-black/10 rounded-full px-4 py-2 hover:bg-black/5">Logout</button>
              </div>
            ) : (
              <button onClick={() => navigate("/customer-auth")} className="coffee-button">Sign in</button>
            )}
            <button onClick={() => navigate("/login")} className="text-sm font-semibold border border-black/10 rounded-full px-4 py-2">Admin</button>
          </div>

          <button onClick={() => navigate("/customer-auth")} className="md:hidden rounded-full px-4 py-2 bg-[var(--coffee-dark)] text-white text-sm font-semibold">
            {customer ? "Account" : "Sign in"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
