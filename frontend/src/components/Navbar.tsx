import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function readCartCount() {
  try { return JSON.parse(localStorage.getItem("coffeehub_cart") || "[]").reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0); } catch { return 0; }
}

export default function Navbar() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<{ name: string; email: string } | null>(() => {
    try { return JSON.parse(localStorage.getItem("customer") || "null"); } catch { return null; }
  });
  const [cartCount, setCartCount] = useState(readCartCount);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sync = () => { try { setCustomer(JSON.parse(localStorage.getItem("customer") || "null")); } catch { setCustomer(null); } };
    const cart = () => setCartCount(readCartCount());
    window.addEventListener("coffeehub:customer-auth", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("coffeehub:cart-updated", cart);
    return () => {
      window.removeEventListener("coffeehub:customer-auth", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("coffeehub:cart-updated", cart);
    };
  }, []);

  const go = (path: string) => { setMobileOpen(false); navigate(path); };
  const logout = () => {
    localStorage.removeItem("customer_access_token");
    localStorage.removeItem("customer");
    setCustomer(null);
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="reference-nav premium-nav">
        <button className="reference-brand premium-brand" onClick={() => go("/")} aria-label="CoffeeHub home">
          <span className="reference-brand-mark premium-mark">◒</span>
          <span><strong>CoffeeHub</strong><small>Specialty Coffee</small></span>
        </button>
        <div className="reference-nav-links premium-nav-links" aria-label="Primary navigation">
          <button onClick={() => go("/")}>Home</button>
          <button onClick={() => go("/menu")}>Menu</button>
          <button onClick={() => go("/story")}>Our Story</button>
          <button onClick={() => go("/news")}>Journal</button>
          <button onClick={() => go("/contact")}>Contact</button>
        </div>
        <div className="reference-nav-actions premium-nav-actions">
          <button className="reference-icon" onClick={() => go("/menu")} aria-label="Browse coffee menu">⌕</button>
          <button className="reference-icon cart" onClick={() => go("/cart")} aria-label={`Open cart${cartCount ? `, ${cartCount} items` : ""}`}>▱{cartCount > 0 && <span>{cartCount}</span>}</button>
          {customer ? <>
            <button className="reference-user premium-user" onClick={() => go("/profile")}><span>{customer.name.charAt(0).toUpperCase()}</span><b>{customer.name.split(" ")[0]}</b></button>
            <button className="reference-signin premium-signout" onClick={logout}>Sign out</button>
          </> : <button className="reference-signin" onClick={() => go("/customer-auth")}>Sign in <b>→</b></button>}
        </div>
        <button className="premium-mobile-toggle" onClick={() => setMobileOpen(v => !v)} aria-expanded={mobileOpen} aria-label="Toggle navigation">{mobileOpen ? "×" : "☰"}</button>
      </nav>
      {mobileOpen && <div className="premium-mobile-menu">
        <button onClick={() => go("/")}>Home <span>01</span></button>
        <button onClick={() => go("/menu")}>Menu <span>02</span></button>
        <button onClick={() => go("/story")}>Our Story <span>03</span></button>
        <button onClick={() => go("/news")}>Journal <span>04</span></button>
        <button onClick={() => go("/contact")}>Contact <span>05</span></button>
        <div className="premium-mobile-actions"><button onClick={() => go("/cart")}>Cart · {cartCount}</button>{customer ? <><button onClick={() => go("/profile")}>Profile</button><button onClick={logout}>Sign out</button></> : <button onClick={() => go("/customer-auth")}>Sign in</button>}</div>
      </div>}
    </>
  );
}
