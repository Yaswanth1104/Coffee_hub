import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Item { coffee_name: string; quantity: number; line_total: number; }
interface Order {
  id: number;
  customer_id: number;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  items: Item[];
}

const statuses = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/admin/orders/", { headers: { Authorization: `Bearer ${token}` } });
      const body = await response.json().catch(() => ({}));
      if (response.status === 401) { localStorage.removeItem("access_token"); navigate("/login", { replace: true }); return; }
      if (!response.ok) throw new Error(body.detail || "Unable to load orders");
      setOrders(body);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load orders"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id); setError("");
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://127.0.0.1:8000/admin/orders/${id}/status`, {
        method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status })
      });
      const body = await response.json().catch(() => ({}));
      if (response.status === 401) { localStorage.removeItem("access_token"); navigate("/login", { replace: true }); return; }
      if (!response.ok) throw new Error(body.detail || "Unable to update status");
      setOrders(current => current.map(order => order.id === id ? body : order));
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to update status"); }
    finally { setUpdating(null); }
  };

  const visibleOrders = useMemo(() => filter === "all" ? orders : orders.filter(order => order.status === filter), [orders, filter]);
  const revenue = orders.filter(order => order.status !== "cancelled").reduce((sum, order) => sum + order.total, 0);
  const pending = orders.filter(order => ["pending", "confirmed", "preparing"].includes(order.status)).length;

  const statusClass = (status: string) => {
    if (status === "delivered") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (status === "cancelled") return "bg-red-50 text-red-700 border-red-100";
    if (status === "preparing" || status === "ready") return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-blue-50 text-blue-700 border-blue-100";
  };

  return (
    <main className="min-h-screen bg-[#f7f2ec] text-[#2d211b]">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-[#eadfd6]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div><button onClick={() => navigate("/dashboard")} className="text-sm text-[#806c60] hover:text-[#4a2819]">← Dashboard</button><h1 className="text-2xl sm:text-3xl font-bold mt-1">Orders</h1></div>
          <div className="flex gap-2"><button onClick={() => navigate("/")} className="hidden sm:inline-flex border border-[#dfd1c6] bg-white px-4 py-2.5 rounded-xl font-semibold text-sm">View site</button><button onClick={load} className="bg-[#3a2115] text-white px-4 py-2.5 rounded-xl font-semibold text-sm">Refresh</button></div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-7"><p className="text-xs uppercase tracking-[.25em] text-[#9a725b]">Operations</p><p className="text-[#806c60] mt-2">Review incoming orders and keep customers updated.</p></div>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
          <div className="bg-white border border-[#eadfd6] rounded-2xl p-5"><p className="text-sm text-[#806c60]">Total orders</p><p className="text-3xl font-bold mt-2">{orders.length}</p></div>
          <div className="bg-white border border-[#eadfd6] rounded-2xl p-5"><p className="text-sm text-[#806c60]">Needs attention</p><p className="text-3xl font-bold mt-2">{pending}</p></div>
          <div className="bg-white border border-[#eadfd6] rounded-2xl p-5"><p className="text-sm text-[#806c60]">Order value</p><p className="text-3xl font-bold mt-2">₹{revenue.toFixed(0)}</p></div>
        </section>

        <div className="flex flex-wrap gap-2 mb-6">
          {["all", ...statuses].map(status => <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${filter === status ? "bg-[#3a2115] text-white border-[#3a2115]" : "bg-white text-[#6e5c52] border-[#dfd1c6] hover:border-[#a98d79]"}`}>{status === "all" ? "All" : status.replaceAll("_", " ")}</button>)}
        </div>

        {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 mb-5">{error}</div>}
        {loading ? <div className="bg-white rounded-2xl border border-[#eadfd6] p-14 text-center text-[#806c60]">Loading orders...</div> : !visibleOrders.length ? <div className="bg-white rounded-2xl border border-[#eadfd6] p-14 text-center"><div className="text-5xl">📦</div><h2 className="text-xl font-bold mt-4">No matching orders</h2><p className="text-[#806c60] mt-2">New orders will appear here automatically after checkout.</p></div> : <div className="space-y-5">
          {visibleOrders.map(order => <article key={order.id} className="bg-white rounded-2xl border border-[#eadfd6] shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-bold text-lg">Order #{order.id}</span><span className={`px-3 py-1 rounded-full border text-xs font-bold capitalize ${statusClass(order.status)}`}>{order.status.replaceAll("_", " ")}</span></div><p className="text-xs text-[#9b877a] mt-1">{new Date(order.created_at).toLocaleString()}</p><h2 className="text-lg font-bold text-[#4a2819] mt-5">{order.customer_name}</h2><p className="text-sm text-[#75675f] mt-1">{order.phone}</p><p className="text-sm text-[#75675f] mt-1 max-w-2xl">{order.address}, {order.city} — {order.pincode}</p></div>
              <div className="lg:text-right shrink-0"><p className="text-2xl font-bold text-[#4a2819]">₹{order.total}</p><p className="text-xs text-[#9b877a] mt-1">{order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method}</p><label className="block text-xs font-semibold text-[#806c60] mt-4 mb-1 lg:text-left">Update status</label><select value={order.status} disabled={updating === order.id} onChange={e => updateStatus(order.id, e.target.value)} className="border border-[#cdbfb3] rounded-xl px-3 py-2.5 text-sm bg-white min-w-48 outline-none focus:ring-2 focus:ring-[#6f3f22]/15">{statuses.map(status => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select></div>
            </div>
            <div className="border-t border-[#eee4dc] bg-[#fbf8f5] px-5 sm:px-6 py-5"><p className="text-xs uppercase tracking-[.2em] text-[#9a725b] mb-3">Items</p><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{order.items.map((item, index) => <div key={`${item.coffee_name}-${index}`} className="bg-white border border-[#eadfd6] rounded-xl p-4 flex justify-between gap-3"><div><p className="font-semibold text-[#4a2819]">{item.coffee_name}</p><p className="text-xs text-[#806c60] mt-1">Qty {item.quantity}</p></div><p className="font-semibold">₹{item.line_total}</p></div>)}</div></div>
          </article>)}
        </div>}
      </div>
    </main>
  );
}

export default Orders;
