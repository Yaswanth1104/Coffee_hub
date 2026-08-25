import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface LoginResponse { access_token: string; token_type: string; }

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/admins/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.detail || "Invalid email or password");
      const data: LoginResponse = body;
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token_type", data.token_type);
      navigate("/dashboard", { replace: true });
    } catch (err) { setError(err instanceof Error ? err.message : "Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#f7f2ec] flex items-center justify-center px-5 py-10 relative overflow-hidden">
      <div className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-[#d8b28e]/25 blur-3xl" />
      <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-[#6f3f22]/10 blur-3xl" />
      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[28px] overflow-hidden shadow-2xl border border-[#eadfd6]">
        <section className="hidden lg:flex bg-[#2f1b11] text-white p-12 flex-col justify-between min-h-[600px]">
          <div><div className="flex items-center gap-3"><span className="w-12 h-12 rounded-2xl bg-[#f1dfcf] text-[#5a301e] flex items-center justify-center text-2xl">☕</span><div><p className="text-xl font-bold">CoffeeHub</p><p className="text-[10px] uppercase tracking-[.28em] text-[#d9bca6]">Admin Studio</p></div></div><div className="mt-24"><p className="text-xs uppercase tracking-[.3em] text-[#c9a58b]">Secure workspace</p><h1 className="text-5xl font-bold leading-tight mt-4">Run your coffee business with confidence.</h1><p className="text-[#d9c4b5] leading-7 mt-5 max-w-md">Manage your menu, customers and incoming orders from one focused workspace.</p></div></div>
          <p className="text-sm text-[#b9957d]">CoffeeHub · Administration</p>
        </section>

        <section className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
          <button onClick={() => navigate("/")} className="self-start text-sm text-[#806c60] hover:text-[#4a2819] mb-10">← Back to website</button>
          <div className="lg:hidden flex items-center gap-3 mb-8"><span className="w-11 h-11 rounded-2xl bg-[#f0e0d2] text-[#5a301e] flex items-center justify-center text-2xl">☕</span><div><p className="text-xl font-bold text-[#2f1b11]">CoffeeHub</p><p className="text-[10px] uppercase tracking-[.25em] text-[#9a725b]">Admin Studio</p></div></div>
          <p className="text-xs uppercase tracking-[.3em] text-[#9a725b]">Administrator access</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2f1b11] mt-3">Welcome back.</h2>
          <p className="text-[#806c60] mt-2 mb-8">Sign in to manage your CoffeeHub workspace.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="coffee-label">Email address</label><input type="email" placeholder="admin@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="coffee-input" autoComplete="username" /></div>
            <div><div className="flex justify-between items-center mb-2"><label className="coffee-label !mb-0">Password</label></div><input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required className="coffee-input" autoComplete="current-password" /></div>
            {error && <div className="rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="coffee-button w-full disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "Signing in..." : "Sign in to dashboard →"}</button>
          </form>
          <p className="text-xs text-[#9b877a] text-center mt-7">Authorized administrators only.</p>
        </section>
      </div>
    </main>
  );
}

export default Login;
