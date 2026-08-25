import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    navigate("/login", { replace: true });
  };

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
          <button onClick={() => navigate("/")} className="text-left mb-10 group">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-2xl bg-[#f1dfcf] text-[#5a301e] flex items-center justify-center text-2xl shadow-lg">☕</span>
              <div>
                <div className="text-xl font-bold tracking-tight">CoffeeHub</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#d9bca6]">Admin Studio</div>
              </div>
            </div>
          </button>

          <div className="text-[10px] uppercase tracking-[0.25em] text-[#b9957d] mb-3 px-3">Workspace</div>
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${index === 0 ? "bg-[#f4e5d7] text-[#3b2115] shadow-sm" : "text-[#ead9cc] hover:bg-white/10"}`}
              >
                <span className="w-7 text-center text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-2">
            <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[#ead9cc] hover:bg-white/10 transition">
              <span className="w-7 text-center">↗</span>
              <span>View Website</span>
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[#f3c8bc] hover:bg-red-500/10 transition">
              <span className="w-7 text-center">↪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="bg-[#fffdfb] border-b border-[#e9ddd3] px-5 sm:px-8 lg:px-10 py-5 flex items-center justify-between sticky top-0 z-20">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#8d6a56]">CoffeeHub / Workspace</p>
              <h1 className="text-xl sm:text-2xl font-bold mt-1">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/")} className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#dfd1c6] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f7f0ea] transition">↗ View site</button>
              <div className="w-10 h-10 rounded-full bg-[#ead5c4] text-[#4a291b] flex items-center justify-center font-bold">A</div>
            </div>
          </header>

          <div className="px-5 sm:px-8 lg:px-10 py-8 max-w-[1500px] mx-auto">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#9a725b]">Good to see you</p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">Welcome back, Administrator.</h2>
                <p className="text-[#7d685c] mt-2">Keep an eye on your menu, customers, and incoming orders.</p>
              </div>
              <button onClick={() => navigate("/admin/orders")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4a2819] hover:bg-[#351b11] text-white px-5 py-3 font-semibold shadow-lg shadow-[#4a2819]/10 transition">View orders <span>→</span></button>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {[
                ["Orders", "24", "Today", "▣"],
                ["Revenue", "₹4,820", "Today", "₹"],
                ["Customers", "186", "Registered", "♙"],
                ["Coffee Menu", "12", "Available items", "☕"],
              ].map(([title, value, meta, icon]) => (
                <div key={title} className="bg-white rounded-2xl border border-[#eadfd6] p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-[#806c60]">{title}</p>
                      <p className="text-2xl font-bold mt-2">{value}</p>
                    </div>
                    <span className="w-11 h-11 rounded-xl bg-[#f4e8de] text-[#633821] flex items-center justify-center text-xl">{icon}</span>
                  </div>
                  <p className="text-xs text-[#9b877a] mt-4">{meta}</p>
                </div>
              ))}
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl border border-[#eadfd6] shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-[#eee4dc] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#9a725b]">Activity</p>
                    <h3 className="text-xl font-bold mt-1">Recent Orders</h3>
                  </div>
                  <button onClick={() => navigate("/admin/orders")} className="text-sm font-semibold text-[#6b3c24] hover:underline">View all</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[650px]">
                    <thead className="bg-[#fbf7f3] text-xs uppercase tracking-wider text-[#907969]">
                      <tr><th className="px-6 py-4 font-semibold">Order</th><th className="px-6 py-4 font-semibold">Customer</th><th className="px-6 py-4 font-semibold">Items</th><th className="px-6 py-4 font-semibold">Total</th><th className="px-6 py-4 font-semibold">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-[#eee5de] text-sm">
                      {[['#1024', 'Yaswanth', 'Americano × 2', '₹300', 'Preparing'], ['#1023', 'Rahul', 'Mocha × 1', '₹160', 'Delivered'], ['#1022', 'Anu', 'Latte × 1', '₹170', 'Pending']].map(([id, customer, items, total, status]) => (
                        <tr key={id} className="hover:bg-[#fffaf6] transition">
                          <td className="px-6 py-4 font-semibold">{id}</td><td className="px-6 py-4">{customer}</td><td className="px-6 py-4 text-[#78665b]">{items}</td><td className="px-6 py-4 font-semibold">{total}</td>
                          <td className="px-6 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status === 'Delivered' ? 'bg-green-50 text-green-700' : status === 'Preparing' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[#3a2115] text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5" />
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#d8b9a2]">Quick actions</p>
                <h3 className="text-2xl font-bold mt-2">Manage CoffeeHub</h3>
                <p className="text-sm text-[#d7c4b7] mt-2 leading-6">Jump straight into the areas you manage most often.</p>
                <div className="space-y-3 mt-7">
                  <button onClick={() => navigate("/coffees")} className="w-full rounded-xl bg-white text-[#3a2115] px-4 py-3 text-left font-semibold hover:bg-[#f7eee8] transition">☕ Manage coffee menu <span className="float-right">→</span></button>
                  <button onClick={() => navigate("/customers")} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-left font-semibold hover:bg-white/15 transition">♙ Manage customers <span className="float-right">→</span></button>
                  <button onClick={() => navigate("/admin/orders")} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-left font-semibold hover:bg-white/15 transition">▣ Manage orders <span className="float-right">→</span></button>
                </div>
              </div>
            </section>

            <div className="lg:hidden grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => navigate("/")} className="rounded-xl border border-[#dfd1c6] bg-white px-4 py-3 font-medium">↗ View Website</button>
              <button onClick={handleLogout} className="rounded-xl bg-[#4a2819] text-white px-4 py-3 font-medium">Logout</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
