import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

type Mode = "login" | "register";
interface CustomerAuthResponse { access_token: string; token_type: string; customer_id?: number; name?: string; email: string; role: "admin" | "customer"; }

function CustomerAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError("");
    if (mode === "register" && password !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const endpoint = mode === "register" ? "register" : "login";
      const response = await fetch(`${API_BASE_URL}/customer-auth/${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mode === "register" ? { name: name.trim(), email: normalizedEmail, phone: phone || null, password } : { email: normalizedEmail, password }) });
      const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(body.detail || "Authentication failed");
      const data: CustomerAuthResponse = body;

      if (mode === "login" && data.role === "admin") {
        localStorage.removeItem("customer_access_token");
        localStorage.removeItem("customer");
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("token_type", data.token_type);
        navigate("/dashboard", { replace: true });
        return;
      }

      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");
      localStorage.setItem("customer_access_token", data.access_token);
      localStorage.setItem("customer", JSON.stringify({ id: data.customer_id, name: data.name, email: data.email }));
      window.dispatchEvent(new Event("coffeehub:customer-auth"));
      navigate("/", { replace: true });
    } catch (err) { setError(err instanceof Error ? err.message : "Authentication failed"); } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#1b120e] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(226,176,111,.2),transparent_28%),radial-gradient(circle_at_88%_88%,rgba(90,50,31,.4),transparent_35%)]" />
      <div className="relative w-full max-w-6xl grid lg:grid-cols-[.9fr_1.1fr] bg-[#fffaf4] rounded-[30px] overflow-hidden shadow-[0_35px_100px_rgba(0,0,0,.35)]">
        <section className="hidden lg:flex min-h-[720px] bg-[#241610] text-white p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border border-[#e2b06f]/15" />
          <div><button onClick={() => navigate("/")} className="flex items-center gap-3 text-left"><span className="w-12 h-12 rounded-2xl bg-[#f4e5d7] text-[#5a321f] flex items-center justify-center text-2xl">☕</span><span><span className="block text-xl font-extrabold">CoffeeHub</span><span className="block text-[10px] uppercase tracking-[.28em] text-[#d7b89d]">Specialty Coffee</span></span></button>
            <div className="mt-32 max-w-md"><p className="text-xs uppercase tracking-[.35em] text-[#e2b06f]">Slow coffee. Good moments.</p><h1 className="text-5xl xl:text-6xl font-black leading-[1.03] tracking-[-.04em] mt-5">Your next favourite cup starts here.</h1><p className="text-[#d8c4b6] leading-7 mt-7">Create your CoffeeHub account, discover your favourite brews and keep your orders close.</p></div>
          </div><p className="text-sm text-[#bfa595]">Made for everyday coffee rituals.</p>
        </section>
        <section className="p-7 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-center">
          <button onClick={() => navigate("/")} className="self-start text-sm font-semibold text-[#806b5e] hover:text-[#5a321f] mb-8">← Back to CoffeeHub</button>
          <div className="lg:hidden flex items-center gap-3 mb-8"><span className="w-11 h-11 rounded-2xl bg-[#f0dfd0] text-[#5a321f] flex items-center justify-center text-2xl">☕</span><div><p className="text-xl font-extrabold text-[#241610]">CoffeeHub</p><p className="text-[10px] uppercase tracking-[.25em] text-[#9a725b]">Specialty Coffee</p></div></div>
          <div className="mb-7"><p className="text-xs uppercase tracking-[.3em] text-[#a16d45] font-bold">CoffeeHub membership</p><h1 className="text-4xl sm:text-5xl font-black tracking-[-.035em] text-[#241610] mt-3">{mode === "login" ? "Welcome back." : "Join the coffee club."}</h1><p className="text-[#806b5e] mt-3">{mode === "login" ? "Sign in and continue your coffee journey." : "Create an account for faster checkout and order history."}</p></div>
          <div className="grid grid-cols-2 rounded-2xl bg-[#f1e5d9] p-1.5 mb-7"><button type="button" onClick={() => { setMode("login"); setError(""); }} className={`rounded-xl py-3 text-sm font-bold transition ${mode === "login" ? "bg-[#241610] text-white shadow-md" : "text-[#806b5e]"}`}>Sign in</button><button type="button" onClick={() => { setMode("register"); setError(""); }} className={`rounded-xl py-3 text-sm font-bold transition ${mode === "register" ? "bg-[#241610] text-white shadow-md" : "text-[#806b5e]"}`}>Create account</button></div>
          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && <><div><label className="coffee-label">Full name</label><input className="coffee-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" minLength={2} required /></div><div><label className="coffee-label">Phone <span className="font-normal opacity-60">(optional)</span></label><input className="coffee-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="98765 43210" /></div></>}
            <div><label className="coffee-label">Email address</label><input className="coffee-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
            <div><label className="coffee-label">Password</label><input className="coffee-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} required /></div>
            {mode === "register" && <div><label className="coffee-label">Confirm password</label><input className="coffee-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat your password" minLength={8} required /></div>}
            {error && <div className="rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm">{error}</div>}
            <button disabled={loading} className="coffee-button w-full justify-center disabled:opacity-50" type="submit">{loading ? "Please wait..." : mode === "login" ? "Continue to CoffeeHub →" : "Create my account →"}</button>
          </form>
          <p className="text-xs text-[#9b877a] text-center mt-7">One login for customers and administrators.</p>
        </section>
      </div>
    </main>
  );
}
export default CustomerAuth;
