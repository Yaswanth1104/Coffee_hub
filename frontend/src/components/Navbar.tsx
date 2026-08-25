import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<{ name: string; email: string } | null>(() => {
    try { return JSON.parse(localStorage.getItem("customer") || "null"); } catch { return null; }
  });

  useEffect(() => {
    const syncCustomer = () => {
      try { setCustomer(JSON.parse(localStorage.getItem("customer") || "null")); }
      catch { setCustomer(null); }
    };
    window.addEventListener("coffeehub:customer-auth", syncCustomer);
    window.addEventListener("storage", syncCustomer);
    return () => {
      window.removeEventListener("coffeehub:customer-auth", syncCustomer);
      window.removeEventListener("storage", syncCustomer);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("customer_access_token");
    localStorage.removeItem("customer");
    setCustomer(null);
    navigate("/");
  };

  return (
    <nav className="coffee-navbar">
      <div className="coffee-container coffee-navbar-inner">
        <button onClick={() => navigate("/")} className="coffee-brand" aria-label="CoffeeHub home">
          <span className="coffee-brand-mark">C</span>
          <span className="coffee-brand-copy">
            <strong>CoffeeHub</strong>
            <small>Specialty Coffee</small>
          </span>
        </button>

        <div className="coffee-nav-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>Menu</button>
          <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>Our Story</button>
        </div>

        <div className="coffee-nav-actions">
          {customer ? (
            <>
              <button onClick={() => navigate("/my-orders")} className="coffee-nav-text">My Orders</button>
              <button onClick={() => navigate("/profile")} className="coffee-user-pill">
                <span>{customer.name.charAt(0).toUpperCase()}</span>
                <b>{customer.name.split(" ")[0]}</b>
              </button>
              <button onClick={logout} className="coffee-nav-outline">Logout</button>
            </>
          ) : (
            <button onClick={() => navigate("/customer-auth")} className="coffee-nav-cta">Sign in <span>→</span></button>
          )}
        </div>

        <button
          onClick={() => navigate(customer ? "/profile" : "/customer-auth")}
          className="coffee-mobile-action"
          aria-label={customer ? "Open profile" : "Sign in"}
        >
          {customer ? customer.name.charAt(0).toUpperCase() : "→"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
