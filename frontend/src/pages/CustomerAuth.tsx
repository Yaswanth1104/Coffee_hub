import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type Mode = "login" | "register";

interface CustomerAuthResponse {
  access_token: string;
  token_type: string;
  customer_id: number;
  name: string;
  email: string;
}

interface AdminAuthResponse {
  access_token: string;
  token_type: string;
}

// CoffeeHub has one administrator. Entering these credentials in the
// customer login form routes the administrator to the protected dashboard.
const ADMIN_EMAIL = "yashuchowdary565@gmail.com";

function CustomerAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Keep one simple authentication screen: the reserved admin email
      // uses the admin login endpoint and goes directly to the dashboard.
      if (mode === "login" && normalizedEmail === ADMIN_EMAIL) {
        const response = await fetch("http://127.0.0.1:8000/admins/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail, password }),
        });

        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(body.detail || "Invalid email or password");
        }

        const data: AdminAuthResponse = body;
        localStorage.removeItem("customer_access_token");
        localStorage.removeItem("customer");
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("token_type", data.token_type);
        window.dispatchEvent(new Event("coffeehub:admin-auth"));
        navigate("/dashboard", { replace: true });
        return;
      }

      const endpoint = mode === "register" ? "register" : "login";
      const response = await fetch(`http://127.0.0.1:8000/customer-auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "register"
            ? { name, email: normalizedEmail, phone: phone || null, password }
            : { email: normalizedEmail, password },
        ),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body.detail || "Authentication failed");
      }

      const data: CustomerAuthResponse = body;
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");
      localStorage.setItem("customer_access_token", data.access_token);
      localStorage.setItem(
        "customer",
        JSON.stringify({ id: data.customer_id, name: data.name, email: data.email }),
      );
      window.dispatchEvent(new Event("coffeehub:customer-auth"));
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="coffee-page min-h-screen flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg">
        <button
          onClick={() => navigate("/")}
          className="coffee-muted mb-6 hover:text-[var(--coffee-brown)]"
        >
          ← Back to CoffeeHub
        </button>
        <section className="coffee-card bg-white p-7 sm:p-10 shadow-xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">☕</div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--coffee-brown)]">
              Welcome to CoffeeHub
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold coffee-heading mt-2">
              {mode === "login" ? "Welcome back." : "Join the coffee club."}
            </h1>
            <p className="coffee-muted mt-3">
              {mode === "login"
                ? "Sign in to continue your order."
                : "Create an account and make every cup count."}
            </p>
          </div>

          <div className="grid grid-cols-2 rounded-full bg-[#f2ebe4] p-1 mb-7">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`rounded-full py-2.5 text-sm font-semibold transition ${
                mode === "login" ? "bg-[var(--coffee-dark)] text-white shadow" : "coffee-muted"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`rounded-full py-2.5 text-sm font-semibold transition ${
                mode === "register" ? "bg-[var(--coffee-dark)] text-white shadow" : "coffee-muted"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {mode === "register" && (
              <>
                <div>
                  <label className="coffee-label">Full name</label>
                  <input
                    className="coffee-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    minLength={2}
                    required
                  />
                </div>
                <div>
                  <label className="coffee-label">
                    Phone <span className="font-normal opacity-60">(optional)</span>
                  </label>
                  <input
                    className="coffee-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                  />
                </div>
              </>
            )}

            <div>
              <label className="coffee-label">Email</label>
              <input
                className="coffee-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="coffee-label">Password</label>
              <input
                className="coffee-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>

            {mode === "register" && (
              <div>
                <label className="coffee-label">Confirm password</label>
                <input
                  className="coffee-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  minLength={8}
                  required
                />
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="coffee-button w-full justify-center disabled:opacity-50"
              type="submit"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign in →" : "Create account →"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default CustomerAuth;
