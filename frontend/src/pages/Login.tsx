import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/admins/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data: LoginResponse =
        await response.json();

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "token_type",
        data.token_type
      );

      // Go to Admin Dashboard
      navigate("/dashboard");

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">

        {/* Logo */}

        <div className="text-center mb-6">

          <div className="text-5xl mb-3">
            ☕
          </div>

          <h2 className="text-3xl font-bold text-amber-700">
            CoffeeHub
          </h2>

          <p className="text-gray-600 mt-2">
            Admin Login
          </p>

        </div>

        {/* Login Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />

          </div>

          {/* Password */}

          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />

          </div>

          {/* Error */}

          {error && (
            <p className="text-center text-red-600 text-sm">
              {error}
            </p>
          )}

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-700 hover:bg-amber-800"
            }`}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* Back Button */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full mt-4 text-gray-600 hover:text-amber-700"
        >
          ← Back to CoffeeHub
        </button>

      </div>

    </div>
  );
}

export default Login;