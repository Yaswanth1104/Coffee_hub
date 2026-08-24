import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/admin/Customers";
import CoffeeManagement from "./pages/admin/CoffeeManagement";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export interface Coffee {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

function HomePage() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/coffees/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch coffees");
        }

        return response.json();
      })
      .then((data: Coffee[]) => {
        setCoffees(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load coffee menu");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="coffee-page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-5 animate-pulse">
            ☕
          </div>

          <p
            className="font-medium"
            style={{
              color: "var(--coffee-brown)",
            }}
          >
            Brewing your coffee menu...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coffee-page min-h-screen flex items-center justify-center px-6">
        <div className="coffee-card max-w-md w-full p-8 text-center">
          <div className="text-5xl mb-4">
            ☕
          </div>

          <h2 className="text-2xl font-bold coffee-heading">
            Something went wrong
          </h2>

          <p className="coffee-muted mt-3">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="coffee-button mt-6"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <Home
        coffees={coffees}
        onLogin={() => navigate("/login")}
      />

      <Footer />
    </>
  );
}

/* --------------------------------
   Protected Dashboard
--------------------------------- */

function ProtectedDashboard() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Dashboard />;
}

/* --------------------------------
   Protected Customers
--------------------------------- */

function ProtectedCustomers() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Customers />;
}

/* --------------------------------
   Protected Coffee Management
--------------------------------- */

function ProtectedCoffeeManagement() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <CoffeeManagement />;
}

/* --------------------------------
   Main App
--------------------------------- */

function App() {
  return (
    <Routes>

      {/* Public Home */}
      <Route
        path="/"
        element={<HomePage />}
      />

      {/* Admin Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Protected Admin Dashboard */}
      <Route
        path="/dashboard"
        element={<ProtectedDashboard />}
      />

      {/* Protected Customers */}
      <Route
        path="/customers"
        element={<ProtectedCustomers />}
      />

      {/* Protected Coffee Management */}
      <Route
        path="/coffees"
        element={<ProtectedCoffeeManagement />}
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;