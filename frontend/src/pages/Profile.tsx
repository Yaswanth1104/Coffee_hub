import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface Profile { id: number; name: string; email: string; phone: string | null; created_at: string; }

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("customer_access_token");
    if (!token) { navigate("/customer-auth", { replace: true }); return; }
    fetch("http://127.0.0.1:8000/customer-profile/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => { const body = await r.json().catch(() => ({})); if (!r.ok) throw new Error(body.detail || "Unable to load profile"); return body as Profile; })
      .then(data => { setProfile(data); setName(data.name); setEmail(data.email); setPhone(data.phone || ""); })
      .catch(err => setError(err instanceof Error ? err.message : "Unable to load profile"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const save = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setMessage(""); setSaving(true);
    const token = localStorage.getItem("customer_access_token");
    try {
      const r = await fetch("http://127.0.0.1:8000/customer-profile/me", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ name, email, phone: phone || null }) });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(body.detail || "Unable to update profile");
      setProfile(body); setMessage("Profile updated successfully.");
      localStorage.setItem("customer", JSON.stringify({ id: body.id, name: body.name, email: body.email }));
      window.dispatchEvent(new Event("coffeehub:customer-auth"));
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to update profile"); }
    finally { setSaving(false); }
  };

  if (loading) return <main className="coffee-page min-h-screen flex items-center justify-center"><p className="coffee-muted">Loading your profile...</p></main>;

  return <main className="coffee-page min-h-screen px-5 py-12 sm:py-16"><div className="max-w-3xl mx-auto">
    <button onClick={() => navigate("/")} className="coffee-muted hover:text-[var(--coffee-brown)] mb-7">← Back to CoffeeHub</button>
    <section className="coffee-card bg-white p-7 sm:p-10 shadow-xl">
      <div className="flex items-start justify-between gap-5 mb-8"><div><p className="text-[10px] uppercase tracking-[0.3em] text-[var(--coffee-brown)]">My account</p><h1 className="text-4xl font-bold coffee-heading mt-2">Your profile.</h1><p className="coffee-muted mt-2">Keep your delivery details up to date.</p></div><div className="w-14 h-14 rounded-full bg-[var(--coffee-dark)] text-white flex items-center justify-center text-xl">☕</div></div>
      {profile && <form onSubmit={save} className="space-y-5">
        <div><label className="coffee-label">Full name</label><input className="coffee-input" value={name} onChange={e => setName(e.target.value)} required minLength={2} /></div>
        <div><label className="coffee-label">Email</label><input className="coffee-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <div><label className="coffee-label">Phone</label><input className="coffee-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="98765 43210" /></div>
        {error && <div className="rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm">{error}</div>}
        {message && <div className="rounded-xl bg-green-50 border border-green-100 text-green-700 px-4 py-3 text-sm">{message}</div>}
        <div className="flex flex-wrap gap-3 pt-2"><button disabled={saving} className="coffee-button disabled:opacity-50" type="submit">{saving ? "Saving..." : "Save changes →"}</button><button type="button" onClick={() => navigate("/my-orders")} className="px-5 py-3 rounded-full border border-black/10 font-semibold">View my orders</button></div>
      </form>}
    </section>
  </div></main>;
}
export default Profile;
