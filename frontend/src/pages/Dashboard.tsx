import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Order { id: number; customer_name: string; total: number; status: string; created_at: string; items: { coffee_name: string; quantity: number }[]; }
interface Customer { id: number; name: string; }
interface Coffee { id: number; name: string; is_available: boolean; }

function Dashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    navigate("/login", { replace: true });
  };

  const loadDashboard = async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };
      const [ordersResponse, customersResponse, coffeesResponse] = await Promise.all([
        fetch("http://127.0.0.1:8000/admin/orders/", { headers }),
        fetch("http://127.0.0.1:8000/customers/", { headers }),
        fetch("http://127.0.0.1:8000/coffees/", { headers }),
      ]);
      if ([ordersResponse, customersResponse, coffeesResponse].some((response) => response.status === 401)) {
        localStorage.removeItem("access_token"); navigate("/login", { replace: true }); return;
      }
      if (!ordersResponse.ok || !customersResponse.ok || !coffeesResponse.ok) throw new Error("Unable to load dashboard data");
      setOrders(await ordersResponse.json());
      setCustomers(await customersResponse.json());
      setCoffees(await coffeesResponse.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load dashboard data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadDashboard(); }, []);

  const revenue = useMemo(() => orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0), [orders]);
  const activeOrders = orders.filter(o => ["pending", "confirmed", "preparing", "ready", "out_for_delivery"].includes(o.status)).length;
  const recentOrders = orders.slice(0, 5);
  const statusClass = (status: string) => status === "delivered" ? "bg-emerald-50 text-emerald-700" : status === "cancelled" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700";

  const navItems = [
    { label: "Dashboard", icon: "⌂", action: () => navigate("/dashboard") },
    { label: "Customers", icon: "♙", action: () => navigate("/customers") },
    { label: "Coffee Menu", icon: "☕", action: () => navigate("/coffees") },
    { label: "Orders", icon: "▣", action: () => navigate("/admin/orders") },
  ];

  return (
    <div className="min-h-screen bg-[#f7f2ec] text-[#342016]">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-[#2f1b11] text-white px-6 py-7 sticky top-0 h-screen">
          <button onClick={() => navigate("/")} className="text-left mb-10"><div className="flex items-center gap-3"><span className="w-11 h-11 rounded-2xl bg-[#f1dfcf] text-[#5a301e] flex items-center justify-center text-2xl shadow-lg">☕</span><div><div className="text-xl font-bold tracking-tight">CoffeeHub</div><div className="text-[10px] uppercase tracking-[.25em] text-[#d9bca6]">Admin Studio</div></div></div></button>
          <div className="text-[10px] uppercase tracking-[.25em] text-[#b9957d] mb-3 px-3">Workspace</div>
          <nav className="space-y-2">{navItems.map((item, index) => <button key={item.label} onClick={item.action} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${index === 0 ? "bg-[#f4e5d7] text-[#3b2115] shadow-sm" : "text-[#ead9cc] hover:bg-white/10"}`}><span className="w-7 text-center text-lg">{item.icon}</span><span className="font-medium">{item.label}</span></button>)}</nav>
          <div className="mt-auto space-y-2"><button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[#ead9cc] hover:bg-white/10"><span className="w-7 text-center">↗</span><span>View Website</span></button><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[#f3c8bc] hover:bg-red-500/10"><span className="w-7 text-center">↪</span><span>Logout</span></button></div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="bg-[#fffdfb] border-b border-[#e9ddd3] px-5 sm:px-8 lg:px-10 py-5 flex items-center justify-between sticky top-0 z-20"><div><p className="text-[10px] uppercase tracking-[.28em] text-[#8d6a56]">CoffeeHub / Workspace</p><h1 className="text-xl sm:text-2xl font-bold mt-1">Admin Dashboard</h1></div><div className="flex items-center gap-3"><button onClick={() => navigate("/")} className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#dfd1c6] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f7f0ea]">↗ View site</button><div className="w-10 h-10 rounded-full bg-[#ead5c4] text-[#4a291b] flex items-center justify-center font-bold">A</div></div></header>

          <div className="px-5 sm:px-8 lg:px-10 py-8 max-w-[1500px] mx-auto">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 mb-8"><div><p className="text-xs uppercase tracking-[.25em] text-[#9a725b]">Overview</p><h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">Welcome back, Administrator.</h2><p className="text-[#7d685c] mt-2">Your live CoffeeHub operations at a glance.</p></div><div className="flex gap-2"><button onClick={loadDashboard} className="rounded-xl border border-[#dfd1c6] bg-white px-4 py-3 font-semibold">Refresh</button><button onClick={() => navigate("/admin/orders")} className="rounded-xl bg-[#4a2819] hover:bg-[#351b11] text-white px-5 py-3 font-semibold shadow-lg">View orders →</button></div></div>

            {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 mb-6">{error}</div>}
            {loading ? <div className="bg-white rounded-2xl border border-[#eadfd6] p-14 text-center text-[#806c60]">Loading your dashboard...</div> : <>
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {[["Orders", orders.length.toString(), "All incoming orders", "▣"], ["Revenue", `₹${revenue.toFixed(0)}`, "Excluding cancelled", "₹"], ["Customers", customers.length.toString(), "Registered customers", "♙"], ["Coffee Menu", coffees.filter(c => c.is_available).length.toString(), "Available items", "☕"]].map(([title, value, meta, icon]) => <div key={title} className="bg-white rounded-2xl border border-[#eadfd6] p-5 shadow-sm hover:shadow-md transition-shadow"><div className="flex items-start justify-between"><div><p className="text-sm text-[#806c60]">{title}</p><p className="text-2xl font-bold mt-2">{value}</p></div><span className="w-11 h-11 rounded-xl bg-[#f4e8de] text-[#633821] flex items-center justify-center text-xl">{icon}</span></div><p className="text-xs text-[#9b877a] mt-4">{meta}</p></div>)}
              </section>

              <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white rounded-2xl border border-[#eadfd6] shadow-sm overflow-hidden"><div className="px-6 py-5 border-b border-[#eee4dc] flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.25em] text-[#9a725b]">Live activity</p><h3 className="text-xl font-bold mt-1">Recent Orders</h3></div><span className="text-xs font-semibold text-[#806c60]">{activeOrders} active</span></div>{recentOrders.length ? <div className="overflow-x-auto"><table className="w-full text-left min-w-[650px]"><thead className="bg-[#fbf7f3] text-xs uppercase tracking-wider text-[#907969]"><tr><th className="px-6 py-4">Order</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Items</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th></tr></thead><tbody className="divide-y divide-[#eee5de] text-sm">{recentOrders.map(order => <tr key={order.id} className="hover:bg-[#fffaf6]"><td className="px-6 py-4 font-semibold">#{order.id}</td><td className="px-6 py-4">{order.customer_name}</td><td className="px-6 py-4 text-[#78665b]">{order.items.map(i => `${i.coffee_name} × ${i.quantity}`).join(", ")}</td><td className="px-6 py-4 font-semibold">₹{order.total}</td><td className="px-6 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(order.status)}`}>{order.status.replaceAll("_", " ")}</span></td></tr>)}</tbody></table></div> : <div className="p-10 text-center text-[#806c60]">No orders yet. They will appear here after the first checkout.</div>}<div className="px-6 py-4 border-t border-[#eee4dc]"><button onClick={() => navigate("/admin/orders")} className="text-sm font-semibold text-[#6b3c24] hover:underline">Manage all orders →</button></div></div>

                <div className="bg-[#3a2115] text-white rounded-2xl p-6 shadow-lg relative overflow-hidden"><div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5"/><p className="text-[10px] uppercase tracking-[.25em] text-[#d8b9a2]">Quick actions</p><h3 className="text-2xl font-bold mt-2">Manage CoffeeHub</h3><p className="text-sm text-[#d7c4b7] mt-2 leading-6">Jump directly into the areas you manage most often.</p><div className="space-y-3 mt-7"><button onClick={() => navigate("/coffees")} className="w-full rounded-xl bg-white text-[#3a2115] px-4 py-3 text-left font-semibold hover:bg-[#f7eee8]">☕ Manage coffee menu <span className="float-right">→</span></button><button onClick={() => navigate("/customers")} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-left font-semibold hover:bg-white/15">♙ Manage customers <span className="float-right">→</span></button><button onClick={() => navigate("/admin/orders")} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-left font-semibold hover:bg-white/15">▣ Manage orders <span className="float-right">→</span></button><button onClick={() => navigate("/")} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-left font-semibold hover:bg-white/15">↗ Open customer website <span className="float-right">→</span></button></div></div>
              </section>
            </>}

            <div className="lg:hidden grid grid-cols-2 gap-3 mt-6"><button onClick={() => navigate("/")} className="rounded-xl border border-[#dfd1c6] bg-white px-4 py-3 font-medium">↗ View Website</button><button onClick={handleLogout} className="rounded-xl bg-[#4a2819] text-white px-4 py-3 font-medium">Logout</button></div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
