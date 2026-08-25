import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

function Checkout() {
  const navigate = useNavigate();
  const [items] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("coffeehub_cart") || "[]"); } catch { return []; }
  });
  const customer = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("customer") || "null"); } catch { return null; }
  }, []);
  const [form, setForm] = useState({ name: customer?.name || "", phone: "", address: "", city: "", pincode: "" });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 0 ? 40 : 0;
  const total = subtotal + delivery;

  if (!localStorage.getItem("customer_access_token")) {
    return <main className="coffee-page min-h-screen flex items-center justify-center px-5"><section className="coffee-card bg-white p-10 text-center max-w-md"><div className="text-6xl">🔐</div><h1 className="text-2xl font-bold coffee-heading mt-5">Sign in to checkout</h1><p className="coffee-muted mt-3">Please sign in to your CoffeeHub account before placing an order.</p><button onClick={() => navigate("/customer-auth")} className="coffee-button mt-7">Sign in →</button></section></main>;
  }

  if (!items.length) {
    return <main className="coffee-page min-h-screen flex items-center justify-center px-5"><section className="coffee-card bg-white p-10 text-center max-w-md"><div className="text-6xl">☕</div><h1 className="text-2xl font-bold coffee-heading mt-5">Your cart is empty</h1><p className="coffee-muted mt-3">Add a coffee before continuing to checkout.</p><button onClick={() => navigate("/")} className="coffee-button mt-7">Browse menu →</button></section></main>;
  }

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return <main className="coffee-page min-h-screen py-12 px-5"><div className="coffee-container max-w-6xl mx-auto">
    <button onClick={() => navigate("/")} className="coffee-muted hover:text-[var(--coffee-brown)] mb-6">← Back to menu</button>
    <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 items-start">
      <section className="coffee-card bg-white p-7 sm:p-9">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--coffee-brown)]">Checkout</p>
        <h1 className="text-4xl font-bold coffee-heading mt-2">Almost yours.</h1>
        <p className="coffee-muted mt-3 mb-8">Tell us where to deliver your freshly brewed coffee.</p>
        <div className="grid sm:grid-cols-2 gap-5">
          <div><label className="coffee-label">Full name</label><input className="coffee-input" value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="Your name" /></div>
          <div><label className="coffee-label">Phone</label><input className="coffee-input" value={form.phone} onChange={(e) => update("phone", e.target.value)} required placeholder="98765 43210" /></div>
          <div className="sm:col-span-2"><label className="coffee-label">Delivery address</label><textarea className="coffee-input min-h-28 resize-none" value={form.address} onChange={(e) => update("address", e.target.value)} required placeholder="House / Flat, street, area" /></div>
          <div><label className="coffee-label">City</label><input className="coffee-input" value={form.city} onChange={(e) => update("city", e.target.value)} required placeholder="Your city" /></div>
          <div><label className="coffee-label">Pincode</label><input className="coffee-input" inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))} required placeholder="520001" /></div>
        </div>
        <div className="mt-8 rounded-2xl bg-[#fbf7f2] border border-black/5 p-5"><p className="text-sm font-semibold coffee-heading">Payment</p><p className="text-sm coffee-muted mt-1">Cash on delivery is available for this demo checkout.</p></div>
        <button disabled={!form.name || !form.phone || !form.address || !form.city || form.pincode.length !== 6} className="coffee-button w-full justify-center mt-7 disabled:opacity-40 disabled:cursor-not-allowed">Place order →</button>
      </section>

      <aside className="coffee-card bg-white p-7 sticky top-28"><p className="text-[10px] uppercase tracking-[0.25em] text-[var(--coffee-brown)]">Order summary</p><h2 className="text-2xl font-bold coffee-heading mt-2">Your coffees</h2><div className="space-y-4 mt-7">{items.map((item) => <div key={item.id} className="flex justify-between gap-4 text-sm"><div><p className="font-semibold coffee-heading">{item.name}</p><p className="coffee-muted mt-1">Qty {item.quantity} × ₹{item.price}</p></div><p className="font-semibold">₹{item.price * item.quantity}</p></div>)}</div><div className="border-t border-black/10 mt-7 pt-5 space-y-3 text-sm"><div className="flex justify-between coffee-muted"><span>Subtotal</span><span>₹{subtotal}</span></div><div className="flex justify-between coffee-muted"><span>Delivery</span><span>₹{delivery}</span></div><div className="flex justify-between text-xl font-bold coffee-heading pt-3 border-t border-black/10"><span>Total</span><span>₹{total}</span></div></div></aside>
    </div>
  </div></main>;
}

export default Checkout;
