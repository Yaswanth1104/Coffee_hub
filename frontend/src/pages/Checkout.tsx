import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderResponse {
  id: number;
  total: number;
  status: string;
}

interface ApiError {
  detail?: string | Array<{ msg?: string }>;
}

function getErrorMessage(body: ApiError, fallback: string) {
  if (typeof body.detail === "string") return body.detail;
  if (Array.isArray(body.detail)) {
    return body.detail.map((item) => item.msg).filter(Boolean).join(" · ") || fallback;
  }
  return fallback;
}

function Checkout() {
  const navigate = useNavigate();
  const [items] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("coffeehub_cart") || "[]");
    } catch {
      return [];
    }
  });

  const customer = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("customer") || "null");
    } catch {
      return null;
    }
  }, []);

  const [form, setForm] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    address: "",
    city: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<OrderResponse | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 0 ? 40 : 0;
  const total = subtotal + delivery;

  if (!localStorage.getItem("customer_access_token")) {
    return (
      <main className="coffee-page min-h-screen flex items-center justify-center px-5">
        <section className="coffee-card bg-white p-10 text-center max-w-md">
          <div className="text-6xl">🔐</div>
          <h1 className="text-2xl font-bold coffee-heading mt-5">Sign in to checkout</h1>
          <p className="coffee-muted mt-3">Please sign in to your CoffeeHub account before placing an order.</p>
          <button onClick={() => navigate("/customer-auth")} className="coffee-button mt-7">Sign in →</button>
        </section>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="coffee-page min-h-screen flex items-center justify-center px-5">
        <section className="coffee-card bg-white p-10 text-center max-w-md">
          <div className="text-6xl">☕</div>
          <h1 className="text-2xl font-bold coffee-heading mt-5">Your cart is empty</h1>
          <p className="coffee-muted mt-3">Add a coffee before continuing to checkout.</p>
          <button onClick={() => navigate("/")} className="coffee-button mt-7">Browse menu →</button>
        </section>
      </main>
    );
  }

  if (placedOrder) {
    return (
      <main className="coffee-page min-h-screen flex items-center justify-center px-5">
        <section className="coffee-card bg-white p-10 text-center max-w-lg">
          <div className="text-7xl">🎉</div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--coffee-brown)] mt-5">Order confirmed</p>
          <h1 className="text-4xl font-bold coffee-heading mt-2">Thank you, {form.name.split(" ")[0]}!</h1>
          <p className="coffee-muted mt-3">Your order <strong>#{placedOrder.id}</strong> has been placed successfully.</p>
          <div className="rounded-2xl bg-[#fbf7f2] p-5 mt-7 text-left">
            <div className="flex justify-between"><span className="coffee-muted">Total</span><strong>₹{placedOrder.total}</strong></div>
            <div className="flex justify-between mt-2"><span className="coffee-muted">Status</span><strong className="capitalize">{placedOrder.status}</strong></div>
            <div className="flex justify-between mt-2"><span className="coffee-muted">Payment</span><strong>Cash on Delivery</strong></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-7">
            <button onClick={() => navigate("/my-orders")} className="coffee-button w-full justify-center">View orders</button>
            <button onClick={() => { localStorage.removeItem("coffeehub_cart"); navigate("/"); }} className="coffee-button-outline w-full">Continue shopping</button>
          </div>
        </section>
      </main>
    );
  }

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const placeOrder = async () => {
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("customer_access_token");
      const response = await fetch("http://127.0.0.1:8000/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          pincode: form.pincode,
          payment_method: "cod",
          items: items.map((item) => ({ coffee_id: item.id, quantity: item.quantity })),
        }),
      });

      const body = (await response.json().catch(() => ({}))) as ApiError & Partial<OrderResponse>;

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("customer_access_token");
          localStorage.removeItem("customer");
          navigate("/customer-auth");
          return;
        }
        throw new Error(getErrorMessage(body, "Unable to place order"));
      }

      setPlacedOrder(body as OrderResponse);
      localStorage.removeItem("coffeehub_cart");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to place order");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = Boolean(
    form.name.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.pincode.length === 6
  );

  return (
    <main className="coffee-page min-h-screen py-12 px-5">
      <div className="coffee-container max-w-6xl mx-auto">
        <button onClick={() => navigate("/")} className="coffee-muted hover:text-[var(--coffee-brown)] mb-6">← Back to menu</button>
        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 items-start">
          <section className="coffee-card bg-white p-7 sm:p-9">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--coffee-brown)]">Checkout</p>
            <h1 className="text-4xl font-bold coffee-heading mt-2">Almost yours.</h1>
            <p className="coffee-muted mt-3 mb-8">Tell us where to deliver your freshly brewed coffee.</p>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="coffee-label">Full name</label>
                <input className="coffee-input" value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="Your name" />
              </div>
              <div>
                <label className="coffee-label">Phone</label>
                <input className="coffee-input" value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} required placeholder="9876543210" inputMode="tel" />
              </div>
              <div className="sm:col-span-2">
                <label className="coffee-label">Delivery address</label>
                <textarea className="coffee-input min-h-28 resize-none" value={form.address} onChange={(e) => update("address", e.target.value)} required placeholder="House / Flat, street, area" />
              </div>
              <div>
                <label className="coffee-label">City</label>
                <input className="coffee-input" value={form.city} onChange={(e) => update("city", e.target.value)} required placeholder="Your city" />
              </div>
              <div>
                <label className="coffee-label">Pincode</label>
                <input className="coffee-input" inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} required placeholder="520001" />
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#fbf7f2] border border-black/5 p-5">
              <p className="text-sm font-semibold coffee-heading">Payment</p>
              <p className="text-sm coffee-muted mt-1">Cash on delivery is available for this checkout.</p>
            </div>

            {error && <div className="rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm mt-5">{error}</div>}

            <button onClick={placeOrder} disabled={loading || !canSubmit} className="coffee-button w-full justify-center mt-7 disabled:opacity-40 disabled:cursor-not-allowed">
              {loading ? "Placing order..." : `Place order · ₹${total}`}
            </button>
          </section>

          <aside className="coffee-card bg-white p-7 sticky top-28">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--coffee-brown)]">Order summary</p>
            <h2 className="text-2xl font-bold coffee-heading mt-2">Your coffees</h2>
            <div className="space-y-4 mt-7">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 text-sm">
                  <div>
                    <p className="font-semibold coffee-heading">{item.name}</p>
                    <p className="coffee-muted mt-1">Qty {item.quantity} × ₹{item.price}</p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-black/10 mt-7 pt-5 space-y-3 text-sm">
              <div className="flex justify-between coffee-muted"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between coffee-muted"><span>Delivery</span><span>₹{delivery}</span></div>
              <div className="flex justify-between text-xl font-bold coffee-heading pt-3 border-t border-black/10"><span>Total</span><span>₹{total}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
