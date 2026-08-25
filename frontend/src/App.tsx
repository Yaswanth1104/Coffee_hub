import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CustomerAuth from "./pages/CustomerAuth";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/admin/Customers";
import CoffeeManagement from "./pages/admin/CoffeeManagement";
import Orders from "./pages/admin/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export interface Coffee { id: number; name: string; description: string; price: number; category: string; is_available: boolean; }
interface CartItem extends Coffee { quantity: number; }

function CartDrawer({ items, onClose, onIncrease, onDecrease, onRemove }: { items: CartItem[]; onClose: () => void; onIncrease: (id: number) => void; onDecrease: (id: number) => void; onRemove: (id: number) => void; }) {
  const navigate = useNavigate(); const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0); const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return <><button aria-label="Close cart" onClick={onClose} className="fixed inset-0 z-[60] bg-black/35 backdrop-blur-[2px]" /><aside className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-[#fbf7f2] shadow-2xl flex flex-col"><div className="flex items-center justify-between p-6 border-b border-black/10"><div><p className="text-[10px] uppercase tracking-[0.25em] text-[var(--coffee-brown)]">Your order</p><h2 className="text-2xl font-bold coffee-heading mt-1">Coffee Cart</h2></div><button onClick={onClose} className="w-10 h-10 rounded-full border border-black/10 text-xl">×</button></div><div className="flex-1 overflow-y-auto p-6">{items.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center"><div className="text-7xl mb-5">☕</div><h3 className="text-xl font-bold coffee-heading">Your cart is empty</h3><button onClick={onClose} className="coffee-button mt-6">Browse menu</button></div> : <div className="space-y-4">{items.map(item => <div key={item.id} className="rounded-2xl bg-white border border-black/5 p-4 shadow-sm"><div className="flex gap-4"><div className="w-16 h-16 rounded-xl bg-[#eadccf] flex items-center justify-center text-3xl">☕</div><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><div><h3 className="font-bold coffee-heading truncate">{item.name}</h3><p className="text-xs coffee-muted mt-1">₹{item.price} each</p></div><button onClick={() => onRemove(item.id)} className="text-xs text-red-700">Remove</button></div><div className="flex items-center justify-between mt-4"><div className="inline-flex items-center rounded-full border border-black/10 overflow-hidden"><button onClick={() => onDecrease(item.id)} className="w-9 h-8">−</button><span className="w-8 text-center text-sm font-semibold">{item.quantity}</span><button onClick={() => onIncrease(item.id)} className="w-9 h-8">+</button></div><span className="font-bold text-[var(--coffee-brown)]">₹{item.price * item.quantity}</span></div></div></div></div>)}</div>}</div>{items.length > 0 && <div className="border-t border-black/10 p-6 bg-white"><div className="flex justify-between text-sm coffee-muted"><span>Items</span><span>{totalItems}</span></div><div className="flex justify-between mt-2 text-sm coffee-muted"><span>Subtotal</span><span>₹{subtotal}</span></div><div className="flex justify-between mt-4 pt-4 border-t border-black/10 text-xl font-bold coffee-heading"><span>Total</span><span>₹{subtotal}</span></div><button onClick={() => { onClose(); navigate("/checkout"); }} className="coffee-button w-full mt-5 justify-center">Proceed to checkout <span>→</span></button></div>}</aside></>;
}

function HomePage() {
  const [coffees, setCoffees] = useState<Coffee[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [cartItems, setCartItems] = useState<CartItem[]>(() => { try { return JSON.parse(localStorage.getItem("coffeehub_cart") || "[]"); } catch { return []; } }); const [cartOpen, setCartOpen] = useState(false); const navigate = useNavigate();
  useEffect(() => { fetch("http://127.0.0.1:8000/coffees/").then(r => { if (!r.ok) throw new Error(); return r.json(); }).then((data: Coffee[]) => { setCoffees(data); setLoading(false); }).catch(() => { setError("Unable to load coffee menu"); setLoading(false); }); }, []);
  useEffect(() => { localStorage.setItem("coffeehub_cart", JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { const handler = (event: Event) => { const coffee = (event as CustomEvent<Coffee>).detail; if (!coffee) return; setCartItems(current => { const existing = current.find(i => i.id === coffee.id); return existing ? current.map(i => i.id === coffee.id ? { ...i, quantity: i.quantity + 1 } : i) : [...current, { ...coffee, quantity: 1 }]; }); setCartOpen(true); }; window.addEventListener("coffeehub:add-to-cart", handler); return () => window.removeEventListener("coffeehub:add-to-cart", handler); }, []);
  const increase = (id: number) => setCartItems(items => items.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)); const decrease = (id: number) => setCartItems(items => items.flatMap(i => i.id !== id ? [i] : i.quantity > 1 ? [{ ...i, quantity: i.quantity - 1 }] : [])); const remove = (id: number) => setCartItems(items => items.filter(i => i.id !== id)); const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  if (loading) return <div className="coffee-page min-h-screen flex items-center justify-center"><div className="text-center"><div className="text-6xl mb-5 animate-pulse">☕</div><p className="text-[var(--coffee-brown)]">Brewing your coffee menu...</p></div></div>;
  if (error) return <div className="coffee-page min-h-screen flex items-center justify-center"><div className="coffee-card p-8 text-center"><div className="text-5xl">☕</div><h2 className="text-2xl font-bold coffee-heading mt-4">Something went wrong</h2><p className="coffee-muted mt-3">{error}</p><button onClick={() => window.location.reload()} className="coffee-button mt-6">Try Again</button></div></div>;
  return <><Navbar /><div className="fixed right-5 bottom-5 z-50"><button onClick={() => setCartOpen(true)} className="w-16 h-16 rounded-full bg-[var(--coffee-dark)] text-white shadow-2xl hover:scale-105 transition-transform text-2xl relative">🛒{cartCount > 0 && <span className="absolute -top-1 -right-1 min-w-6 h-6 px-1 rounded-full bg-[var(--coffee-brown)] text-white text-xs font-bold flex items-center justify-center">{cartCount}</span>}</button></div><Home coffees={coffees} onLogin={() => navigate("/login")} /><Footer />{cartOpen && <CartDrawer items={cartItems} onClose={() => setCartOpen(false)} onIncrease={increase} onDecrease={decrease} onRemove={remove} />}</>;
}

function isAdminToken(): boolean {
  const token = localStorage.getItem("access_token");
  if (!token) return false;

  try {
    const payload = token.split(".")[1];
    if (!payload) return false;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), "="))
        .split("")
        .map(char => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );
    return JSON.parse(json).role === "admin";
  } catch {
    return false;
  }
}

function ProtectedAdminPage({ children }: { children: JSX.Element }) {
  return isAdminToken() ? children : <Navigate to="/login" replace />;
}

function ProtectedProfile() { return localStorage.getItem("customer_access_token") ? <Profile /> : <Navigate to="/customer-auth" replace />; }

function App() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/customer-auth" element={<CustomerAuth />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/my-orders" element={<MyOrders />} />
    <Route path="/profile" element={<ProtectedProfile />} />
    <Route path="/dashboard" element={<ProtectedAdminPage><Dashboard /></ProtectedAdminPage>} />
    <Route path="/customers" element={<ProtectedAdminPage><Customers /></ProtectedAdminPage>} />
    <Route path="/coffees" element={<ProtectedAdminPage><CoffeeManagement /></ProtectedAdminPage>} />
    <Route path="/admin/orders" element={<ProtectedAdminPage><Orders /></ProtectedAdminPage>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

export default App;
